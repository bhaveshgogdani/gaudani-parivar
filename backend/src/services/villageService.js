import Village from '../models/Village.js';

export const getAllVillages = async (includeInactive = false) => {
  const query = {};
  if (!includeInactive) {
    query.isActive = true;
  }
  return Village.find(query).sort({ villageName: 1 });
};

export const getVillageById = async (id) => {
  return Village.findById(id);
};

export const createVillage = async (data) => {
  const village = new Village({
    villageName: data.villageName.trim(),
    isActive: data.isActive !== undefined ? data.isActive : true,
  });
  return village.save();
};

export const updateVillage = async (id, data) => {
  const updateData = {};
  if (data.villageName !== undefined) updateData.villageName = data.villageName.trim();
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return Village.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteVillage = async (id) => {
  return Village.findByIdAndDelete(id);
};

export const checkDuplicateVillageName = async (villageName, excludeId) => {
  const query = { villageName: villageName.trim() };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return Village.findOne(query);
};

