import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Standard from '../src/models/Standard.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gaudani_parivar';

// List of standards to add
// Format: { standardName, standardCode, displayOrder, isCollegeLevel }
const standards = [
  // School Level (Primary/Secondary)
  { standardName: 'બાલભવન', standardCode: 'BALBHAVAN', displayOrder: 0, isCollegeLevel: false },
  { standardName: 'જુ.કે.જી', standardCode: 'JKG', displayOrder: 1, isCollegeLevel: false },
  { standardName: 'સી.કે.જી', standardCode: 'CKG', displayOrder: 2, isCollegeLevel: false },
  { standardName: 'ધો. ૧', standardCode: 'STD1', displayOrder: 3, isCollegeLevel: false },
  { standardName: 'ધો. ૨', standardCode: 'STD2', displayOrder: 4, isCollegeLevel: false },
  { standardName: 'ધો. ૩', standardCode: 'STD3', displayOrder: 5, isCollegeLevel: false },
  { standardName: 'ધો. ૪', standardCode: 'STD4', displayOrder: 6, isCollegeLevel: false },
  { standardName: 'ધો. ૫', standardCode: 'STD5', displayOrder: 7, isCollegeLevel: false },
  { standardName: 'ધો. ૬', standardCode: 'STD6', displayOrder: 8, isCollegeLevel: false },
  { standardName: 'ધો. ૭', standardCode: 'STD7', displayOrder: 9, isCollegeLevel: false },
  { standardName: 'ધો. ૮', standardCode: 'STD8', displayOrder: 10, isCollegeLevel: false },
  { standardName: 'ધો. ૯', standardCode: 'STD9', displayOrder: 11, isCollegeLevel: false },
  { standardName: 'ધો. ૧૦', standardCode: 'STD10', displayOrder: 12, isCollegeLevel: false },
  { standardName: 'ધો. ૧૧', standardCode: 'STD11', displayOrder: 13, isCollegeLevel: false },
  { standardName: 'ધો. ૧૨', standardCode: 'STD12', displayOrder: 14, isCollegeLevel: false },
  
  // College Level - Medical & Health Sciences
  { standardName: 'BPT', standardCode: 'BPT', displayOrder: 16, isCollegeLevel: true },
  { standardName: 'MPT', standardCode: 'MPT', displayOrder: 17, isCollegeLevel: true },
  { standardName: 'B.S.C', standardCode: 'BSC', displayOrder: 18, isCollegeLevel: true },
  { standardName: 'M.B.B.S', standardCode: 'MBBS', displayOrder: 19, isCollegeLevel: true },
  { standardName: 'BDS', standardCode: 'BDS', displayOrder: 20, isCollegeLevel: true },
  { standardName: 'MDS', standardCode: 'MDS', displayOrder: 21, isCollegeLevel: true },
  { standardName: 'B.H.M.S', standardCode: 'BHMS', displayOrder: 22, isCollegeLevel: true },
  { standardName: 'BAMS', standardCode: 'BAMS', displayOrder: 23, isCollegeLevel: true },
  { standardName: 'B.Pharm', standardCode: 'BPHARM', displayOrder: 24, isCollegeLevel: true },
  { standardName: 'M.Pharm', standardCode: 'MPHARM', displayOrder: 25, isCollegeLevel: true },
  { standardName: 'D.Pharm', standardCode: 'DPHARM', displayOrder: 26, isCollegeLevel: true },
  { standardName: 'B.Sc Nursing', standardCode: 'BSCNURSING', displayOrder: 27, isCollegeLevel: true },
  { standardName: 'M.Sc Nursing', standardCode: 'MSCNURSING', displayOrder: 28, isCollegeLevel: true },
  { standardName: 'MD', standardCode: 'MD', displayOrder: 29, isCollegeLevel: true },
  { standardName: 'MS', standardCode: 'MS', displayOrder: 30, isCollegeLevel: true },
  
  // College Level - Engineering & Technology
  { standardName: 'B.TECH', standardCode: 'BTECH', displayOrder: 31, isCollegeLevel: true },
  { standardName: 'M.TECH', standardCode: 'MTECH', displayOrder: 32, isCollegeLevel: true },
  { standardName: 'B.E', standardCode: 'BE', displayOrder: 33, isCollegeLevel: true },
  { standardName: 'M.E', standardCode: 'ME', displayOrder: 34, isCollegeLevel: true },
  { standardName: 'DIPLOMA Eng.', standardCode: 'DIPLOMAENG', displayOrder: 35, isCollegeLevel: true },
  { standardName: 'B.Arch', standardCode: 'BARCH', displayOrder: 36, isCollegeLevel: true },
  { standardName: 'M.Arch', standardCode: 'MARCH', displayOrder: 37, isCollegeLevel: true },
  
  // College Level - Computer Science & IT
  { standardName: 'B.C.A', standardCode: 'BCA', displayOrder: 38, isCollegeLevel: true },
  { standardName: 'M.C.A', standardCode: 'MCA', displayOrder: 39, isCollegeLevel: true },
  { standardName: 'B.S.C IT', standardCode: 'BSCIT', displayOrder: 40, isCollegeLevel: true },
  { standardName: 'M.S.C IT', standardCode: 'MSCIT', displayOrder: 41, isCollegeLevel: true },
  { standardName: 'B.Tech IT', standardCode: 'BTECHIT', displayOrder: 42, isCollegeLevel: true },
  { standardName: 'M.Tech IT', standardCode: 'MTECHIT', displayOrder: 43, isCollegeLevel: true },
  
  // College Level - Commerce & Business
  { standardName: 'B.B.A', standardCode: 'BBA', displayOrder: 44, isCollegeLevel: true },
  { standardName: 'M.B.A', standardCode: 'MBA', displayOrder: 45, isCollegeLevel: true },
  { standardName: 'B.COM', standardCode: 'BCOM', displayOrder: 46, isCollegeLevel: true },
  { standardName: 'M.com', standardCode: 'MCOM', displayOrder: 47, isCollegeLevel: true },
  { standardName: 'CA', standardCode: 'CA', displayOrder: 48, isCollegeLevel: true },
  { standardName: 'CS', standardCode: 'CS', displayOrder: 49, isCollegeLevel: true },
  { standardName: 'CMA', standardCode: 'CMA', displayOrder: 50, isCollegeLevel: true },
  
  // College Level - Arts & Humanities
  { standardName: 'B.A', standardCode: 'BA', displayOrder: 51, isCollegeLevel: true },
  { standardName: 'M.A', standardCode: 'MA', displayOrder: 52, isCollegeLevel: true },
  { standardName: 'BFA', standardCode: 'BFA', displayOrder: 53, isCollegeLevel: true },
  { standardName: 'MFA', standardCode: 'MFA', displayOrder: 54, isCollegeLevel: true },
  
  // College Level - Science
  { standardName: 'MSC', standardCode: 'MSC', displayOrder: 55, isCollegeLevel: true },
  { standardName: 'M.Sc', standardCode: 'MSCGEN', displayOrder: 56, isCollegeLevel: true },
  
  // College Level - Law
  { standardName: 'LLB', standardCode: 'LLB', displayOrder: 57, isCollegeLevel: true },
  { standardName: 'LLM', standardCode: 'LLM', displayOrder: 58, isCollegeLevel: true },
  
  // College Level - Education
  { standardName: 'B.Ed', standardCode: 'BED', displayOrder: 59, isCollegeLevel: true },
  { standardName: 'M.Ed', standardCode: 'MED', displayOrder: 60, isCollegeLevel: true },
  
  // College Level - Design
  { standardName: 'B.Des', standardCode: 'BDES', displayOrder: 61, isCollegeLevel: true },
  { standardName: 'M.Des', standardCode: 'MDES', displayOrder: 62, isCollegeLevel: true },
  
  // College Level - Veterinary
  { standardName: 'B.V.Sc', standardCode: 'BVSC', displayOrder: 63, isCollegeLevel: true },
  { standardName: 'M.V.Sc', standardCode: 'MVSC', displayOrder: 64, isCollegeLevel: true },
];

const addStandards = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully\n');

    let addedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // Add each standard
    for (const standardData of standards) {
      try {
        // Check if standard already exists (by code, as it's unique)
        const existingStandard = await Standard.findOne({ 
          standardCode: standardData.standardCode.toUpperCase()
        });

        if (existingStandard) {
          console.log(`⏭️  Skipped: "${standardData.standardName}" (${standardData.standardCode}) - already exists`);
          skippedCount++;
        } else {
          // Create new standard
          const newStandard = new Standard({
            standardName: standardData.standardName.trim(),
            standardCode: standardData.standardCode.toUpperCase().trim(),
            displayOrder: standardData.displayOrder,
            isCollegeLevel: standardData.isCollegeLevel,
            isActive: true,
          });

          await newStandard.save();
          console.log(`✅ Added: "${standardData.standardName}" (${standardData.standardCode})`);
          addedCount++;
        }
      } catch (error) {
        console.error(`❌ Error adding "${standardData.standardName}":`, error.message);
        errors.push({ standard: standardData.standardName, error: error.message });
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✅ Added: ${addedCount} standards`);
    console.log(`   ⏭️  Skipped: ${skippedCount} standards (already exist)`);
    if (errors.length > 0) {
      console.log(`   ❌ Errors: ${errors.length} standards`);
      errors.forEach(({ standard, error }) => {
        console.log(`      - "${standard}": ${error}`);
      });
    }
    console.log('='.repeat(50));

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
addStandards();

