import Village from '../models/Village.js';

export const getVillages = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const query = {};

    // If not admin or includeInactive not set, only return active villages
    if (!includeInactive || includeInactive !== 'true') {
      query.isActive = true;
    }

    const villages = await Village.find(query).sort({ villageName: 1 });

    res.status(200).json({
      status: 'success',
      data: villages,
    });
  } catch (error) {
    next(error);
  }
};

export const getVillageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const village = await Village.findById(id);

    if (!village) {
      res.status(404).json({ message: 'Village not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: village,
    });
  } catch (error) {
    next(error);
  }
};

export const createVillage = async (req, res, next) => {
  try {
    const { villageName, isActive = true } = req.body;

    // Check for duplicate
    const existingVillage = await Village.findOne({
      villageName: villageName.trim(),
    });

    if (existingVillage) {
      res.status(400).json({ message: 'Village name already exists' });
      return;
    }

    const village = new Village({
      villageName: villageName.trim(),
      isActive,
    });

    await village.save();

    res.status(201).json({
      status: 'success',
      data: village,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Village name already exists' });
      return;
    }
    next(error);
  }
};

export const updateVillage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { villageName, isActive } = req.body;

    const updateData = {};
    if (villageName !== undefined) updateData.villageName = villageName.trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    // Check for duplicate if villageName is being updated
    if (villageName) {
      const existingVillage = await Village.findOne({
        villageName: villageName.trim(),
        _id: { $ne: id },
      });

      if (existingVillage) {
        res.status(400).json({ message: 'Village name already exists' });
        return;
      }
    }

    const village = await Village.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!village) {
      res.status(404).json({ message: 'Village not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: village,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Village name already exists' });
      return;
    }
    next(error);
  }
};

export const deleteVillage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const village = await Village.findByIdAndDelete(id);

    if (!village) {
      res.status(404).json({ message: 'Village not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Village deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

