import Result from '../models/Result.js';
import mongoose from 'mongoose';

export const createResult = async (req, res, next) => {
  try {
    const {
      studentName,
      standardId,
      medium,
      totalMarks,
      obtainedMarks,
      percentage,
      villageId,
      contactNumber,
    } = req.body;

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

    // Calculate percentage if marks are provided
    let calculatedPercentage = percentage;
    if (totalMarks && obtainedMarks) {
      calculatedPercentage = (obtainedMarks / totalMarks) * 100;
    }

    // Handle file upload (required)
    const resultImageUrl = `/uploads/results/${req.file.filename}`;
    const resultImageFileName = req.file.originalname;

    const result = new Result({
      studentName,
      standardId,
      medium,
      totalMarks: totalMarks ? parseFloat(totalMarks) : undefined,
      obtainedMarks: obtainedMarks ? parseFloat(obtainedMarks) : undefined,
      percentage: parseFloat(calculatedPercentage),
      villageId,
      contactNumber,
      resultImageUrl,
      resultImageFileName,
      submittedAt: new Date(),
    });

    await result.save();
    await result.populate('standardId', 'standardName standardCode');
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
      query.studentName = { $regex: search, $options: 'i' };
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
    const updateData = req.body;

    // Calculate percentage if marks are provided
    if (updateData.totalMarks && updateData.obtainedMarks) {
      updateData.percentage = (updateData.obtainedMarks / updateData.totalMarks) * 100;
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

