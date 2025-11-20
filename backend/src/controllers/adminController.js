import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import Result from '../models/Result.js';
import Village from '../models/Village.js';
import Standard from '../models/Standard.js';
import Settings from '../models/Settings.js';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin || !admin.isActive) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'JWT_SECRET environment variable is not configured' });
      return;
    }
    if (!process.env.JWT_EXPIRES_IN) {
      res.status(500).json({ message: 'JWT_EXPIRES_IN environment variable is not configured' });
      return;
    }
    
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const totalResults = await Result.countDocuments();
    const totalVillages = await Village.countDocuments({ isActive: true });
    const totalStandards = await Standard.countDocuments({ isActive: true });

    const resultsByMedium = await Result.aggregate([
      {
        $group: {
          _id: '$medium',
          count: { $sum: 1 },
          averagePercentage: { $avg: '$percentage' },
        },
      },
    ]);

    const recentResults = await Result.find()
      .populate('standardId', 'standardName')
      .populate('villageId', 'villageName')
      .sort({ submittedAt: -1 })
      .limit(10);

    const resultsByStandard = await Result.aggregate([
      {
        $group: {
          _id: '$standardId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'standards',
          localField: '_id',
          foreignField: '_id',
          as: 'standard',
        },
      },
      {
        $unwind: '$standard',
      },
      {
        $project: {
          standardName: '$standard.standardName',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalResults,
        totalVillages,
        totalStandards,
        resultsByMedium,
        resultsByStandard,
        recentResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.status(200).json({
      status: 'success',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { lastDateToUploadResult } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    
    if (lastDateToUploadResult !== undefined) {
      settings.lastDateToUploadResult = lastDateToUploadResult ? new Date(lastDateToUploadResult) : null;
    }
    
    await settings.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

