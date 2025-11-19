import Result from '../models/Result.js';
import Standard from '../models/Standard.js';
import Village from '../models/Village.js';
import mongoose from 'mongoose';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, PageBreak } from 'docx';
import ExcelJS from 'exceljs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PdfPrinter = require('pdfmake/src/printer.js');
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export const getTopThree = async (req, res, next) => {
  try {
    const { standardId, medium } = req.query;

    // First, get all school level standards (isCollegeLevel: false)
    const schoolStandards = await Standard.find({ isCollegeLevel: false }).select('_id displayOrder');
    const schoolStandardIds = schoolStandards.map(s => s._id);

    const matchQuery = {
      standardId: { $in: schoolStandardIds }, // Only school level standards
      isApproved: true, // Only approved results
    };
    
    if (standardId && mongoose.Types.ObjectId.isValid(standardId)) {
      matchQuery.standardId = new mongoose.Types.ObjectId(standardId);
    }

    if (medium && (medium === 'gujarati' || medium === 'english')) {
      matchQuery.medium = medium;
    }

    // Group by standardId and medium, then sort by percentage
    const groupedResults = await Result.aggregate([
      { $match: matchQuery },
      {
        $sort: { percentage: -1, submittedAt: 1 }, // Sort by percentage desc, then by submission date
      },
      {
        $group: {
          _id: {
            standardId: '$standardId',
            medium: '$medium',
          },
          results: { $push: '$$ROOT' },
        },
      },
    ]);

    // Process each group to assign ranks (same percentage = same rank) and get top 3 ranks
    const processedGroups = groupedResults.map((group) => {
      let previousPercentage = null;
      let uniqueRankCount = 1;
      let currentRank = 1;
      const rankedResults = [];

      for (let i = 0; i < group.results.length; i++) {
        const result = group.results[i];
        
        // If percentage is different from previous, update rank
        if (previousPercentage !== null && result.percentage !== previousPercentage) {
          uniqueRankCount += 1;
          currentRank = uniqueRankCount;
        }
        
        // Only include results with rank 1, 2, or 3
        if (uniqueRankCount <= 3) {
          result.rank = currentRank;
          rankedResults.push(result);
          previousPercentage = result.percentage;
        } else {
          // Stop once we've passed rank 3
          break;
        }
      }

      return {
        _id: group._id,
        topThree: rankedResults,
      };
    });

    // Manually populate the results since aggregation returns plain objects
    const populatedResults = await Promise.all(
      processedGroups.map(async (group) => {
        // Populate standard
        const standard = await Standard.findById(group._id.standardId).select('standardName standardCode isCollegeLevel displayOrder');
        
        // Populate each result
        const populatedTopThree = await Promise.all(
          group.topThree.map(async (result) => {
            const populatedResult = { ...result };
            
            // Populate standardId
            if (populatedResult.standardId) {
              const standardId = populatedResult.standardId.toString ? populatedResult.standardId.toString() : populatedResult.standardId;
              if (mongoose.Types.ObjectId.isValid(standardId)) {
                populatedResult.standardId = await Standard.findById(standardId).select('standardName standardCode isCollegeLevel displayOrder');
              }
            }
            
            // Populate villageId
            if (populatedResult.villageId) {
              const villageId = populatedResult.villageId.toString ? populatedResult.villageId.toString() : populatedResult.villageId;
              if (mongoose.Types.ObjectId.isValid(villageId)) {
                populatedResult.villageId = await Village.findById(villageId).select('villageName');
              }
            }
            
            return populatedResult;
          })
        );
        
        return {
          _id: {
            standardId: standard,
            medium: group._id.medium,
          },
          topThree: populatedTopThree,
        };
      })
    );

    const sortedResults = populatedResults.sort((a, b) => {
      const orderA = a._id.standardId?.displayOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b._id.standardId?.displayOrder ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    // Get all school level standards to ensure we show all of them
    const allSchoolStandards = await Standard.find({ isCollegeLevel: false })
      .select('_id standardName standardCode displayOrder')
      .sort({ displayOrder: 1 });

    // Create a map of standards that have results
    const standardsWithResults = new Map();
    sortedResults.forEach((group) => {
      const standardId = group._id.standardId?._id?.toString() || group._id.standardId?.toString();
      if (standardId) {
        standardsWithResults.set(standardId, group);
      }
    });

    // Create final result with all standards, including empty ones
    const finalResults = allSchoolStandards.map((standard) => {
      const standardId = standard._id.toString();
      const existingGroup = standardsWithResults.get(standardId);
      
      if (existingGroup) {
        return existingGroup;
      } else {
        // Return empty group for standards with no results
        return {
          _id: {
            standardId: standard,
            medium: medium || null,
          },
          topThree: [],
        };
      }
    });

    res.status(200).json({
      status: 'success',
      data: finalResults,
    });
  } catch (error) {
    next(error);
  }
};

export const exportTopThreePdf = async (req, res, next) => {
  try {
    const { medium } = req.query;

    // First, get all school level standards (isCollegeLevel: false)
    const schoolStandards = await Standard.find({ isCollegeLevel: false }).select('_id displayOrder');
    const schoolStandardIds = schoolStandards.map(s => s._id);

    const matchQuery = {
      standardId: { $in: schoolStandardIds }, // Only school level standards
      isApproved: true, // Only approved results
    };
    
    if (medium && (medium === 'gujarati' || medium === 'english')) {
      matchQuery.medium = medium;
    }

    // Group by standardId and medium, then sort by percentage
    const groupedResults = await Result.aggregate([
      { $match: matchQuery },
      {
        $sort: { percentage: -1, submittedAt: 1 }, // Sort by percentage desc, then by submission date
      },
      {
        $group: {
          _id: {
            standardId: '$standardId',
            medium: '$medium',
          },
          results: { $push: '$$ROOT' },
        },
      },
    ]);

    // Process each group to assign ranks (same percentage = same rank) and get top 3 ranks
    const processedGroups = groupedResults.map((group) => {
      let previousPercentage = null;
      let uniqueRankCount = 1;
      let currentRank = 1;
      const rankedResults = [];

      for (let i = 0; i < group.results.length; i++) {
        const result = group.results[i];
        
        // If percentage is different from previous, update rank
        if (previousPercentage !== null && result.percentage !== previousPercentage) {
          uniqueRankCount += 1;
          currentRank = uniqueRankCount;
        }
        
        // Only include results with rank 1, 2, or 3
        if (uniqueRankCount <= 3) {
          result.rank = currentRank;
          rankedResults.push(result);
          previousPercentage = result.percentage;
        } else {
          // Stop once we've passed rank 3
          break;
        }
      }

      return {
        _id: group._id,
        topThree: rankedResults,
      };
    });

    // Manually populate the results
    const populatedResults = await Promise.all(
      processedGroups.map(async (group) => {
        const standard = await Standard.findById(group._id.standardId).select('standardName standardCode isCollegeLevel displayOrder');
        
        const populatedTopThree = await Promise.all(
          group.topThree.map(async (result) => {
            const populatedResult = { ...result };
            
            if (populatedResult.standardId) {
              const standardId = populatedResult.standardId.toString ? populatedResult.standardId.toString() : populatedResult.standardId;
              if (mongoose.Types.ObjectId.isValid(standardId)) {
                populatedResult.standardId = await Standard.findById(standardId).select('standardName standardCode isCollegeLevel displayOrder');
              }
            }
            
            if (populatedResult.villageId) {
              const villageId = populatedResult.villageId.toString ? populatedResult.villageId.toString() : populatedResult.villageId;
              if (mongoose.Types.ObjectId.isValid(villageId)) {
                populatedResult.villageId = await Village.findById(villageId).select('villageName');
              }
            }
            
            return populatedResult;
          })
        );
        
        return {
          _id: {
            standardId: standard,
            medium: group._id.medium,
          },
          topThree: populatedTopThree,
        };
      })
    );

    // Sort by standard display order
    const sortedResults = populatedResults.sort((a, b) => {
      const orderA = a._id.standardId?.displayOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b._id.standardId?.displayOrder ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    // Group by rank (1, 2, 3) - flat list of all students for each rank
    const rankGroups = {
      1: [],
      2: [],
      3: [],
    };

    sortedResults.forEach((group) => {
      group.topThree.forEach((result) => {
        if (result.rank >= 1 && result.rank <= 3) {
          // Add standard info to each result
          const resultWithStandard = {
            ...result,
            standardName: group._id.standardId?.standardName || 'Unknown',
          };
          rankGroups[result.rank].push(resultWithStandard);
        }
      });
    });

    // Setup fonts for pdfmake
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const backendDir = path.resolve(__dirname, '..', '..');
    
    // Find NirmalaUI font (primary) or fallback to other Gujarati fonts
    const fontPaths = [
      path.resolve(backendDir, 'fonts', 'NirmalaUI-01.ttf'),
      path.resolve(backendDir, 'fonts', 'NirmalaUI.ttf'),
      path.resolve(backendDir, 'fonts', 'NirmalaText-04.ttf'),
      path.resolve(backendDir, 'fonts', 'Nirmala.ttf'),
    ];

    let gujaratiFontPath = null;
    let gujaratiFontName = 'NirmalaUI';

    // Find Gujarati font
    for (const fontPath of fontPaths) {
      if (fs.existsSync(fontPath) && !fontPath.toLowerCase().endsWith('.ttc')) {
        gujaratiFontPath = fontPath;
        console.log(`✓ Gujarati font found: ${fontPath}`);
        break;
      }
    }

    // Define fonts for pdfmake
    const fonts = {};
    
    if (gujaratiFontPath) {
      // Find bold variant
      const fontDir = path.dirname(gujaratiFontPath);
      const boldFontPath = fs.existsSync(path.join(fontDir, 'NirmalaUI-Bold-02.ttf'))
        ? path.join(fontDir, 'NirmalaUI-Bold-02.ttf')
        : gujaratiFontPath;
      
      fonts[gujaratiFontName] = {
        normal: gujaratiFontPath,
        bold: boldFontPath,
        italics: gujaratiFontPath,
        bolditalics: boldFontPath,
      };
    } else {
      console.warn('⚠ WARNING: Gujarati font not found! PDF may not render correctly.');
      console.warn('  Please add NirmalaUI-01.ttf to:', path.resolve(backendDir, 'fonts'));
    }

    const defaultFont = gujaratiFontPath ? gujaratiFontName : 'Roboto';
    
    const printer = new PdfPrinter(fonts);

    // Helper function to create rank page content
    const createRankPage = (rank, rankData, rankTitle) => {
      if (rankData.length === 0) return null;

      const tableBody = [
        // Header row - explicitly set font on each cell
        [
          { text: 'ક્રમ', style: 'tableHeader', alignment: 'center', font: defaultFont },
          { text: 'વિધાર્થી નું નામ', style: 'tableHeader', alignment: 'center', font: defaultFont },
          { text: 'ધોરણ', style: 'tableHeader', alignment: 'center', font: defaultFont },
          { text: 'ટકાવારી', style: 'tableHeader', alignment: 'center', font: defaultFont },
          { text: 'ગામ', style: 'tableHeader', alignment: 'center', font: defaultFont },
          { text: 'નોંધ', style: 'tableHeader', alignment: 'center', font: defaultFont },
        ],
      ];

      // Add data rows - explicitly set font on each cell
      let srNo = 1;
      rankData.forEach((result, index) => {
        const rowColor = index % 2 === 0 ? '#FFFFFF' : '#FFFFFF';
        tableBody.push([
          { text: String(srNo++), style: 'tableCell', alignment: 'center', fillColor: rowColor, font: defaultFont },
          { text: result.studentName || '', style: 'tableCell', fillColor: rowColor, font: defaultFont },
          { text: result.standardName || result.standardId?.standardName || '', style: 'tableCell', fillColor: rowColor, font: defaultFont },
          { text: `${result.percentage.toFixed(2)}%`, style: 'tableCellBold', alignment: 'center', fillColor: rowColor, font: defaultFont },
          { text: result.villageId?.villageName || '', style: 'tableCell', fillColor: rowColor, font: defaultFont },
          { text: '', style: 'tableCell', fillColor: rowColor, font: defaultFont },
        ]);
      });

      return {
        stack: [
          { text: 'ગૌદાની પરિવાર સ્નેહમિલન સમારોહ - ' + (new Date().getFullYear() + 1), style: 'mainTitle', alignment: 'center' },
          { text: 'તેજસ્વી તારલાઓ ને પુરસ્કાર ઇનામ', style: 'subtitle', alignment: 'center' },
          { text: rankTitle, style: 'rankTitle', alignment: 'center' },
          { text: '', margin: [0, 5] },
          {
            table: {
              headerRows: 1,
              widths: ['6%', '28%', '11%', '10%', '12%', '33%'],
              body: tableBody,
            },
            layout: {
              paddingTop: () => 8,
              paddingBottom: () => 8,
              hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1 : 0.5),
              vLineWidth: () => 0.5,
              hLineColor: () => '#c9c9c9',
              vLineColor: () => '#c9c9c9',
              fillColor: (rowIndex) => {
                if (rowIndex === 0) return '#F0F0F0';
                return rowIndex % 2 === 0 ? '#FFFFFF' : '#FFFFFF';
              },
            },
          },
        ],
        pageBreak: rank > 1 ? 'before' : undefined,
      };
    };

    // Build document content
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      defaultStyle: {
        font: defaultFont,
        fontSize: 11,
      },
      styles: {
        mainTitle: {
          fontSize: 20,
          bold: true,
          font: defaultFont,
          margin: [0, 0, 0, 2],
        },
        subtitle: {
          fontSize: 16,
          bold: true,
          font: defaultFont,
          margin: [0, 0, 0, 2],
        },
        rankTitle: {
          fontSize: 18,
          bold: true,
          font: defaultFont,
          margin: [0, 0, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          fillColor: '#E8E8E8',
          font: defaultFont,
        },
        tableCell: {
          fontSize: 11,
          font: defaultFont,
        },
        tableCellBold: {
          fontSize: 11,
          bold: true,
          font: defaultFont,
        },
      },
      content: [],
    };

    // Add pages for each rank
    if (rankGroups[1].length > 0) {
      docDefinition.content.push(createRankPage(1, rankGroups[1], 'પહેલા નંબર ના તેજસ્વી તારલાઓ'));
    }
    if (rankGroups[2].length > 0) {
      docDefinition.content.push(createRankPage(2, rankGroups[2], 'બીજા નંબર ના તેજસ્વી તારલાઓ'));
    }
    if (rankGroups[3].length > 0) {
      docDefinition.content.push(createRankPage(3, rankGroups[3], 'ત્રીજા નંબર ના તેજસ્વી તારલાઓ'));
    }

    // Generate PDF
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=top-three-ranking.pdf');
    
    pdfDoc.pipe(res);
    pdfDoc.end();
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

