import Standard from '../models/Standard.js';

export const getAllStandards = async (includeInactive = false) => {
  const query = {};
  if (!includeInactive) {
    query.isActive = true;
  }
  return Standard.find(query).sort({ displayOrder: 1, standardName: 1 });
};

export const getStandardById = async (id) => {
  return Standard.findById(id);
};

export const createStandard = async (data) => {
  const standard = new Standard({
    standardName: data.standardName.trim(),
    standardCode: data.standardCode.trim().toUpperCase(),
    displayOrder: data.displayOrder,
    isCollegeLevel: data.isCollegeLevel || false,
    isActive: data.isActive !== undefined ? data.isActive : true,
  });
  return standard.save();
};

export const updateStandard = async (id, data) => {
  const updateData = {};
  if (data.standardName !== undefined) updateData.standardName = data.standardName.trim();
  if (data.standardCode !== undefined)
    updateData.standardCode = data.standardCode.trim().toUpperCase();
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
  if (data.isCollegeLevel !== undefined) updateData.isCollegeLevel = data.isCollegeLevel;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return Standard.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteStandard = async (id) => {
  return Standard.findByIdAndDelete(id);
};

export const checkDuplicateStandardCode = async (standardCode, excludeId) => {
  const query = { standardCode: standardCode.trim().toUpperCase() };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return Standard.findOne(query);
};

