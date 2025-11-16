import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import Result from '../models/Result.js';
import Village from '../models/Village.js';
import Standard from '../models/Standard.js';

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
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

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

