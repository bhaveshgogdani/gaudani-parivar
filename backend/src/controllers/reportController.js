import Result from '../models/Result.js';
import mongoose from 'mongoose';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } from 'docx';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export const getTopThree = async (req, res, next) => {
  try {
    const { standardId } = req.query;

    const matchQuery = {};
    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      matchQuery.standardId = new mongoose.Types.ObjectId(standardId);
    }

    const topThree = await Result.aggregate([
      { $match: matchQuery },
      {
        $sort: { percentage: -1 },
      },
      {
        $group: {
          _id: '$standardId',
          results: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 1,
          topThree: { $slice: ['$results', 3] },
        },
      },
    ]);

    const populatedResults = await Result.populate(topThree, [
      { path: '_id', select: 'standardName standardCode isCollegeLevel' },
      { path: 'topThree.standardId', select: 'standardName standardCode isCollegeLevel' },
      { path: 'topThree.villageId', select: 'villageName' },
    ]);

    res.status(200).json({
      status: 'success',
      data: populatedResults,
    });
  } catch (error) {
    next(error);
  }
};

export const exportTopThreeDocx = async (req, res, next) => {
  try {
    const { standardId } = req.query;

    const matchQuery = {};
    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      matchQuery.standardId = new mongoose.Types.ObjectId(standardId);
    }

    const topThree = await Result.aggregate([
      { $match: matchQuery },
      { $sort: { percentage: -1 } },
      {
        $group: {
          _id: '$standardId',
          results: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 1,
          topThree: { $slice: ['$results', 3] },
        },
      },
    ]);

    const populatedResults = await Result.populate(topThree, [
      { path: '_id', select: 'standardName standardCode' },
      { path: 'topThree.standardId', select: 'standardName standardCode' },
      { path: 'topThree.villageId', select: 'villageName' },
    ]);

    const children = [
      new Paragraph({
        text: 'Top 3 Ranking List',
        heading: 'Heading1',
      }),
      new Paragraph({ text: '' }),
    ];

    for (const group of populatedResults) {
      const standardName = group._id?.standardName || 'Unknown';
      children.push(
        new Paragraph({
          text: standardName,
          heading: 'Heading2',
        })
      );

      const tableRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Sr. No.')] }),
            new TableCell({ children: [new Paragraph('Student Name')] }),
            new TableCell({ children: [new Paragraph('Percentage')] }),
            new TableCell({ children: [new Paragraph('Village')] }),
            new TableCell({ children: [new Paragraph('Contact')] }),
          ],
        }),
      ];

      group.topThree.forEach((result, index) => {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(String(index + 1))] }),
              new TableCell({ children: [new Paragraph(result.studentName || '')] }),
              new TableCell({ children: [new Paragraph(`${result.percentage.toFixed(2)}%`)] }),
              new TableCell({ children: [new Paragraph(result.villageId?.villageName || '')] }),
              new TableCell({ children: [new Paragraph(result.contactNumber || '')] }),
            ],
          })
        );
      });

      children.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
      children.push(new Paragraph({ text: '' }));
    }

    const doc = new Document({
      sections: [
        {
          children: children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=top-three-ranking.docx');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const getAwardsList = async (req, res, next) => {
  try {
    const { rank, standardId, medium } = req.query;
    const rankNum = rank === 'first' ? 1 : rank === 'second' ? 2 : 1;

    const matchQuery = {};
    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      matchQuery.standardId = new mongoose.Types.ObjectId(standardId);
    }
    if (medium && (medium === 'gujarati' || medium === 'english')) {
      matchQuery.medium = medium;
    }

    const results = await Result.aggregate([
      { $match: matchQuery },
      { $sort: { percentage: -1 } },
      {
        $group: {
          _id: '$standardId',
          results: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 1,
          ranked: { $slice: ['$results', rankNum] },
        },
      },
    ]);

    const populatedResults = await Result.populate(results, [
      { path: '_id', select: 'standardName standardCode' },
      { path: 'ranked.standardId', select: 'standardName standardCode' },
      { path: 'ranked.villageId', select: 'villageName' },
    ]);

    res.status(200).json({
      status: 'success',
      data: populatedResults,
    });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const { medium, standardId, villageId, dateFrom, dateTo } = req.query;

    const matchQuery = {};
    if (medium && (medium === 'gujarati' || medium === 'english')) {
      matchQuery.medium = medium;
    }
    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      matchQuery.standardId = standardId;
    }
    if (villageId && mongoose.Types.ObjectId.isValid(villageId)) {
      matchQuery.villageId = villageId;
    }
    if (dateFrom || dateTo) {
      matchQuery.submittedAt = {};
      if (dateFrom) matchQuery.submittedAt.$gte = new Date(dateFrom);
      if (dateTo) matchQuery.submittedAt.$lte = new Date(dateTo);
    }

    const stats = await Result.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          averagePercentage: { $avg: '$percentage' },
          maxPercentage: { $max: '$percentage' },
          minPercentage: { $min: '$percentage' },
        },
      },
    ]);

    const byMedium = await Result.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$medium',
          count: { $sum: 1 },
          averagePercentage: { $avg: '$percentage' },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        summary: stats[0] || { total: 0, averagePercentage: 0, maxPercentage: 0, minPercentage: 0 },
        byMedium,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getByMedium = async (req, res, next) => {
  try {
    const { standardId, villageId, dateFrom, dateTo } = req.query;

    const matchQuery = {};
    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      matchQuery.standardId = new mongoose.Types.ObjectId(standardId);
    }
    if (villageId && mongoose.Types.ObjectId.isValid(villageId)) {
      matchQuery.villageId = new mongoose.Types.ObjectId(villageId);
    }
    if (dateFrom || dateTo) {
      matchQuery.submittedAt = {};
      if (dateFrom) matchQuery.submittedAt.$gte = new Date(dateFrom);
      if (dateTo) matchQuery.submittedAt.$lte = new Date(dateTo);
    }

    const gujaratiResults = await Result.find({ ...matchQuery, medium: 'gujarati' })
      .populate('standardId', 'standardName standardCode')
      .populate('villageId', 'villageName')
      .sort({ percentage: -1 });

    const englishResults = await Result.find({ ...matchQuery, medium: 'english' })
      .populate('standardId', 'standardName standardCode')
      .populate('villageId', 'villageName')
      .sort({ percentage: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        gujarati: gujaratiResults,
        english: englishResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getByVillage = async (req, res, next) => {
  try {
    const { medium, standardId, dateFrom, dateTo } = req.query;

    const matchQuery = {};
    if (medium && (medium === 'gujarati' || medium === 'english')) {
      matchQuery.medium = medium;
    }
    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      matchQuery.standardId = new mongoose.Types.ObjectId(standardId);
    }
    if (dateFrom || dateTo) {
      matchQuery.submittedAt = {};
      if (dateFrom) matchQuery.submittedAt.$gte = new Date(dateFrom);
      if (dateTo) matchQuery.submittedAt.$lte = new Date(dateTo);
    }

    const results = await Result.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$villageId',
          results: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
    ]);

    const populatedResults = await Result.populate(results, [
      { path: '_id', select: 'villageName' },
      { path: 'results.standardId', select: 'standardName standardCode' },
      { path: 'results.villageId', select: 'villageName' },
    ]);

    res.status(200).json({
      status: 'success',
      data: populatedResults,
    });
  } catch (error) {
    next(error);
  }
};

export const getByStandard = async (req, res, next) => {
  try {
    const { medium, villageId, dateFrom, dateTo } = req.query;

    const matchQuery = {};
    if (medium && (medium === 'gujarati' || medium === 'english')) {
      matchQuery.medium = medium;
    }
    if (villageId && mongoose.Types.ObjectId.isValid(villageId)) {
      matchQuery.villageId = new mongoose.Types.ObjectId(villageId);
    }
    if (dateFrom || dateTo) {
      matchQuery.submittedAt = {};
      if (dateFrom) matchQuery.submittedAt.$gte = new Date(dateFrom);
      if (dateTo) matchQuery.submittedAt.$lte = new Date(dateTo);
    }

    const results = await Result.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$standardId',
          results: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
    ]);

    const populatedResults = await Result.populate(results, [
      { path: '_id', select: 'standardName standardCode isCollegeLevel' },
      { path: 'results.standardId', select: 'standardName standardCode' },
      { path: 'results.villageId', select: 'villageName' },
    ]);

    res.status(200).json({
      status: 'success',
      data: populatedResults,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopPerformers = async (req, res, next) => {
  try {
    const { medium, limit = '10', standardId, villageId } = req.query;

    const matchQuery = {};
    if (medium && (medium === 'gujarati' || medium === 'english')) {
      matchQuery.medium = medium;
    }
    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      matchQuery.standardId = new mongoose.Types.ObjectId(standardId);
    }
    if (villageId && mongoose.Types.ObjectId.isValid(villageId)) {
      matchQuery.villageId = new mongoose.Types.ObjectId(villageId);
    }

    const topPerformers = await Result.find(matchQuery)
      .populate('standardId', 'standardName standardCode')
      .populate('villageId', 'villageName')
      .sort({ percentage: -1 })
      .limit(parseInt(limit, 10));

    res.status(200).json({
      status: 'success',
      data: topPerformers,
    });
  } catch (error) {
    next(error);
  }
};

export const exportAwardsDocx = async (req, res, next) => {
  try {
    const { rank, standardId, medium } = req.query;
    const rankNum = rank === 'first' ? 1 : rank === 'second' ? 2 : 1;

    const matchQuery = {};
    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      matchQuery.standardId = new mongoose.Types.ObjectId(standardId);
    }
    if (medium && (medium === 'gujarati' || medium === 'english')) {
      matchQuery.medium = medium;
    }

    const results = await Result.aggregate([
      { $match: matchQuery },
      { $sort: { percentage: -1 } },
      {
        $group: {
          _id: '$standardId',
          results: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 1,
          ranked: { $slice: ['$results', rankNum] },
        },
      },
    ]);

    const populatedResults = await Result.populate(results, [
      { path: '_id', select: 'standardName standardCode' },
      { path: 'ranked.standardId', select: 'standardName standardCode' },
      { path: 'ranked.villageId', select: 'villageName' },
    ]);

    const children = [
      new Paragraph({
        text: `${rank === 'first' ? 'First' : 'Second'} Rank Awards List`,
        heading: 'Heading1',
      }),
      new Paragraph({ text: '' }),
    ];

    for (const group of populatedResults) {
      const standardName = group._id?.standardName || 'Unknown';
      children.push(
        new Paragraph({
          text: standardName,
          heading: 'Heading2',
        })
      );

      const tableRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Student Name')] }),
            new TableCell({ children: [new Paragraph('Percentage')] }),
            new TableCell({ children: [new Paragraph('Village')] }),
            new TableCell({ children: [new Paragraph('Contact')] }),
          ],
        }),
      ];

      group.ranked.forEach((result) => {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(result.studentName || '')] }),
              new TableCell({ children: [new Paragraph(`${result.percentage.toFixed(2)}%`)] }),
              new TableCell({ children: [new Paragraph(result.villageId?.villageName || '')] }),
              new TableCell({ children: [new Paragraph(result.contactNumber || '')] }),
            ],
          })
        );
      });

      children.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
      children.push(new Paragraph({ text: '' }));
    }

    const doc = new Document({
      sections: [
        {
          children: children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${rank}-rank-awards.docx`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const exportReport = async (req, res, next) => {
  try {
    const { format, medium, standardId, villageId } = req.query;

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

    const results = await Result.find(query)
      .populate('standardId', 'standardName standardCode')
      .populate('villageId', 'villageName')
      .sort({ percentage: -1 });

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Results');

      worksheet.columns = [
        { header: 'Student Name', key: 'studentName', width: 30 },
        { header: 'Standard', key: 'standard', width: 20 },
        { header: 'Medium', key: 'medium', width: 15 },
        { header: 'Percentage', key: 'percentage', width: 15 },
        { header: 'Village', key: 'village', width: 25 },
        { header: 'Contact', key: 'contact', width: 15 },
      ];

      results.forEach((result) => {
        worksheet.addRow({
          studentName: result.studentName,
          standard: result.standardId?.standardName || '',
          medium: result.medium,
          percentage: result.percentage,
          village: result.villageId?.villageName || '',
          contact: result.contactNumber || '',
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=results.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    } else {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=results.pdf');
      doc.pipe(res);

      doc.fontSize(20).text('Results Report', { align: 'center' });
      doc.moveDown();

      results.forEach((result, index) => {
        doc.fontSize(12).text(`${index + 1}. ${result.studentName}`);
        doc.text(`   Standard: ${result.standardId?.standardName || ''}`);
        doc.text(`   Medium: ${result.medium}`);
        doc.text(`   Percentage: ${result.percentage}%`);
        doc.text(`   Village: ${result.villageId?.villageName || ''}`);
        doc.moveDown();
      });

      doc.end();
    }
  } catch (error) {
    next(error);
  }
};

