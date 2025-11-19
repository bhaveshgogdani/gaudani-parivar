/**
 * Script to show instructions for downloading Gujarati font for PDF generation
 * Run this script: node scripts/downloadFont.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');
const fontsDir = path.resolve(backendDir, 'fonts');

// Create fonts directory if it doesn't exist
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fontPath = path.resolve(fontsDir, 'NotoSansGujarati-Regular.ttf');

console.log('\n=== Gujarati Font Setup for PDF Generation ===\n');

// Check if font already exists
if (fs.existsSync(fontPath)) {
  console.log('✓ Font already exists at:', fontPath);
  console.log('✓ Your PDFs should display Gujarati text correctly.\n');
  process.exit(0);
}

console.log('⚠ No Gujarati font found!');
console.log('To enable proper Gujarati text rendering in PDFs, please download a font.\n');

console.log('Option 1: Download Noto Sans Gujarati (Recommended)');
console.log('  1. Visit: https://fonts.google.com/noto/specimen/Noto+Sans+Gujarati');
console.log('  2. Click "Download family" button (top right)');
console.log('  3. Extract the ZIP file');
console.log('  4. Copy "NotoSansGujarati-Regular.ttf" to:', fontsDir);
console.log('  5. Restart your server\n');

console.log('Option 2: Use Nirmala UI (Windows only)');
console.log('  1. Open: C:\\Windows\\Fonts\\');
console.log('  2. Find: Nirmala.ttf or NirmalaUI.ttf');
console.log('  3. Copy it to:', fontsDir);
console.log('  4. Rename to: Nirmala.ttf or NirmalaUI.ttf');
console.log('  5. Restart your server\n');

console.log('After placing the font file, restart your server and generate a PDF.');
console.log('You should see a success message in the console when the font is registered.\n');
