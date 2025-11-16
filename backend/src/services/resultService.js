import Result from '../models/Result.js';
import mongoose from 'mongoose';

export const getResults = async (filters = {}, sort = {}, pagination = {}) => {
  const query = {};

  if (filters.medium) {
    query.medium = filters.medium;
  }

  if (filters.standardId && mongoose.Types.ObjectId.isValid(filters.standardId)) {
    query.standardId = filters.standardId;
  }

  if (filters.villageId && mongoose.Types.ObjectId.isValid(filters.villageId)) {
    query.villageId = filters.villageId;
  }

  if (filters.search) {
    query.studentName = { $regex: filters.search, $options: 'i' };
  }

  if (filters.dateFrom || filters.dateTo) {
    query.submittedAt = {};
    if (filters.dateFrom) query.submittedAt.$gte = filters.dateFrom;
    if (filters.dateTo) query.submittedAt.$lte = filters.dateTo;
  }

  if (filters.isVerified !== undefined) {
    query.isVerified = filters.isVerified;
  }

  const sortOptions = {};
  const sortBy = sort.sortBy || 'submittedAt';
  const sortOrder = sort.sortOrder === 'asc' ? 1 : -1;
  sortOptions[sortBy] = sortOrder;

  const page = pagination.page || 1;
  const limit = pagination.limit || 50;
  const skip = (page - 1) * limit;

  const results = await Result.find(query)
    .populate('standardId', 'standardName standardCode isCollegeLevel')
    .populate('villageId', 'villageName')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Result.countDocuments(query);

  return {
    results,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

