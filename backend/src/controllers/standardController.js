import Standard from '../models/Standard.js';

export const getStandards = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const query = {};

    // If not admin or includeInactive not set, only return active standards
    if (!includeInactive || includeInactive !== 'true') {
      query.isActive = true;
    }

    const standards = await Standard.find(query).sort({ displayOrder: 1, standardName: 1 });

    res.status(200).json({
      status: 'success',
      data: standards,
    });
  } catch (error) {
    next(error);
  }
};

export const getStandardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const standard = await Standard.findById(id);

    if (!standard) {
      res.status(404).json({ message: 'Standard not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: standard,
    });
  } catch (error) {
    next(error);
  }
};

export const createStandard = async (req, res, next) => {
  try {
    const {
      standardName,
      standardCode,
      displayOrder,
      isCollegeLevel = false,
      isActive = true,
    } = req.body;

    // Check for duplicate code
    const existingStandard = await Standard.findOne({
      standardCode: standardCode.trim().toUpperCase(),
    });

    if (existingStandard) {
      res.status(400).json({ message: 'Standard code already exists' });
      return;
    }

    const standard = new Standard({
      standardName: standardName.trim(),
      standardCode: standardCode.trim().toUpperCase(),
      displayOrder: parseInt(displayOrder),
      isCollegeLevel,
      isActive,
    });

    await standard.save();

    res.status(201).json({
      status: 'success',
      data: standard,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Standard code already exists' });
      return;
    }
    next(error);
  }
};

export const updateStandard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { standardName, standardCode, displayOrder, isCollegeLevel, isActive } = req.body;

    const updateData = {};
    if (standardName !== undefined) updateData.standardName = standardName.trim();
    if (standardCode !== undefined) updateData.standardCode = standardCode.trim().toUpperCase();
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (isCollegeLevel !== undefined) updateData.isCollegeLevel = isCollegeLevel;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Check for duplicate code if standardCode is being updated
    if (standardCode) {
      const existingStandard = await Standard.findOne({
        standardCode: standardCode.trim().toUpperCase(),
        _id: { $ne: id },
      });

      if (existingStandard) {
        res.status(400).json({ message: 'Standard code already exists' });
        return;
      }
    }

    const standard = await Standard.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!standard) {
      res.status(404).json({ message: 'Standard not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: standard,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Standard code already exists' });
      return;
    }
    next(error);
  }
};

export const deleteStandard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const standard = await Standard.findByIdAndDelete(id);

    if (!standard) {
      res.status(404).json({ message: 'Standard not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Standard deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

