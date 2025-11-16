import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Village from '../src/models/Village.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gaudani_parivar';

// List of villages to add
const villages = [
  'એકલેરા',
  'ધામેલ',
  'કણકોટ',
  'હાવતડ',
  'સમુહ ખેતી',
  'ભાણવડ',
  'કાંધી',
  'તરકતળાવ',
  'ડુંડાશ',
  'ફીફાદ',
  'ટીંબી',
  'હરીપર',
  'ઠાંસા',
  'વેળાવદર',
  'વાપી',
  'અમદાવાદ',
];

const addVillages = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully\n');

    let addedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // Add each village
    for (const villageName of villages) {
      try {
        // Check if village already exists
        const existingVillage = await Village.findOne({ 
          villageName: villageName.trim() 
        });

        if (existingVillage) {
          console.log(`⏭️  Skipped: "${villageName}" (already exists)`);
          skippedCount++;
        } else {
          // Create new village
          const newVillage = new Village({
            villageName: villageName.trim(),
            isActive: true,
          });

          await newVillage.save();
          console.log(`✅ Added: "${villageName}"`);
          addedCount++;
        }
      } catch (error) {
        console.error(`❌ Error adding "${villageName}":`, error.message);
        errors.push({ village: villageName, error: error.message });
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✅ Added: ${addedCount} villages`);
    console.log(`   ⏭️  Skipped: ${skippedCount} villages (already exist)`);
    if (errors.length > 0) {
      console.log(`   ❌ Errors: ${errors.length} villages`);
      errors.forEach(({ village, error }) => {
        console.log(`      - "${village}": ${error}`);
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
addVillages();

