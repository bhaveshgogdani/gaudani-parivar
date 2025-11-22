import Result from '../models/Result.js';
import Settings from '../models/Settings.js';
import mongoose from 'mongoose';

export const createResult = async (req, res, next) => {
  try {
    const {
      studentName,
      standardId,
      otherStandardName,
      medium,
      totalMarks,
      obtainedMarks,
      percentage,
      villageId,
      contactNumber,
    } = req.body;

    // Check if upload deadline has passed
    const settings = await Settings.getSettings();
    if (settings.lastDateToUploadResult) {
      const lastDate = new Date(settings.lastDateToUploadResult);
      lastDate.setHours(23, 59, 59, 999); // End of the day
      const now = new Date();
      if (now > lastDate) {
        return res.status(400).json({
          status: 'error',
          message: 'The last date to upload results has passed. Please contact the administrator.',
        });
      }
    }

    // Validate required fields
    if (!contactNumber || !contactNumber.match(/^[0-9]{10}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Contact number is required and must be exactly 10 digits',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Result image is required',
      });
    }

    // Validate standard: either standardId or otherStandardName must be provided
    // Note: standardId can be "other" or undefined when using otherStandardName
    const isOtherStandard = standardId === 'other' || (!standardId && otherStandardName);
    
    if (!standardId && !otherStandardName) {
      return res.status(400).json({
        status: 'error',
        message: 'Either standard or other standard name is required',
      });
    }

    // If both are provided and standardId is not "other", that's an error
    if (standardId && standardId !== 'other' && otherStandardName) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot provide both standard and other standard name',
      });
    }

    // Handle standard selection
    let finalStandardId = null;
    let finalOtherStandardName = null;
    
    if (isOtherStandard) {
      // Using "other" standard - validate otherStandardName
      if (!otherStandardName || typeof otherStandardName !== 'string') {
        return res.status(400).json({
          status: 'error',
          message: 'Other standard name is required when selecting "Other"',
        });
      }
      finalOtherStandardName = otherStandardName.trim();
      if (finalOtherStandardName.length < 2 || finalOtherStandardName.length > 100) {
        return res.status(400).json({
          status: 'error',
          message: 'Other standard name must be between 2 and 100 characters',
        });
      }
      // Don't set standardId when using otherStandardName
      finalStandardId = null;
    } else if (standardId) {
      // Using a regular standard - validate standardId
      if (!mongoose.Types.ObjectId.isValid(standardId)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid standard ID',
        });
      }
      finalStandardId = standardId;
      // Ensure otherStandardName is not set
      finalOtherStandardName = null;
    }

    // Calculate percentage from marks (always recalculate in backend)
    let calculatedPercentage = 0;
    if (totalMarks && obtainedMarks) {
      calculatedPercentage = (parseFloat(obtainedMarks) / parseFloat(totalMarks)) * 100;
      // Round to 2 decimal places
      calculatedPercentage = Math.round(calculatedPercentage * 100) / 100;
    } else if (percentage) {
      // If no marks but percentage provided, use it and round to 2 decimals
      calculatedPercentage = Math.round(parseFloat(percentage) * 100) / 100;
    }

    // Handle file upload (required)
    const resultImageUrl = `/uploads/results/${req.file.filename}`;
    const resultImageFileName = req.file.originalname;

    const result = new Result({
      studentName,
      standardId: finalStandardId,
      otherStandardName: finalOtherStandardName,
      medium,
      totalMarks: totalMarks ? parseFloat(totalMarks) : undefined,
      obtainedMarks: obtainedMarks ? parseFloat(obtainedMarks) : undefined,
      percentage: calculatedPercentage,
      villageId,
      contactNumber,
      resultImageUrl,
      resultImageFileName,
      submittedAt: new Date(),
    });

    await result.save();
    if (finalStandardId) {
      await result.populate('standardId', 'standardName standardCode');
    }
    await result.populate('villageId', 'villageName');

    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getResults = async (req, res, next) => {
  try {
    const {
      page = '1',
      limit = '50',
      medium,
      standardId,
      villageId,
      search,
      sortBy = 'submittedAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    if (medium && (medium === 'gujarati' || medium === 'english')) {
      query.medium = medium;
    }

    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      query.standardId = standardId;
    }

    if (villageId && mongoose.Types.ObjectId.isValid(villageId)) {
      query.villageId = villageId;
    }

    if (search) {
      // Search by student name or contact number
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { contactNumber: search },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const results = await Result.find(query)
      .populate('standardId', 'standardName standardCode isCollegeLevel')
      .populate('villageId', 'villageName')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Result.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getResultById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Result.findById(id)
      .populate('standardId', 'standardName standardCode isCollegeLevel')
      .populate('villageId', 'villageName');

    if (!result) {
      res.status(404).json({ message: 'Result not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      standardId,
      otherStandardName,
      ...restData
    } = req.body;

    const updateData = { ...restData };

    // Handle standard: either standardId or otherStandardName
    if (standardId && standardId !== 'other') {
      // Validate that standardId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(standardId)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid standard ID',
        });
      }
      updateData.standardId = standardId;
      updateData.otherStandardName = undefined; // Clear otherStandardName if standardId is provided
    } else if (otherStandardName) {
      const trimmedOtherStandardName = otherStandardName.trim();
      if (trimmedOtherStandardName.length < 2 || trimmedOtherStandardName.length > 100) {
        return res.status(400).json({
          status: 'error',
          message: 'Other standard name must be between 2 and 100 characters',
        });
      }
      updateData.standardId = null; // Clear standardId if otherStandardName is provided
      updateData.otherStandardName = trimmedOtherStandardName;
    }

    // When admin edits, use the percentage value they provide directly (no recalculation)
    // Only round to 2 decimal places to ensure consistency
    if (updateData.percentage !== undefined) {
      updateData.percentage = Math.round(parseFloat(updateData.percentage) * 100) / 100;
    }

    // Handle file upload
    if (req.file) {
      updateData.resultImageUrl = `/uploads/results/${req.file.filename}`;
      updateData.resultImageFileName = req.file.originalname;
    }

    const result = await Result.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('standardId', 'standardName standardCode isCollegeLevel')
      .populate('villageId', 'villageName');

    if (!result) {
      res.status(404).json({ message: 'Result not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResult = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      res.status(404).json({ message: 'Result not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Result deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

