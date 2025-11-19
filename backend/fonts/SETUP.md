# Gujarati Font Setup for PDF Generation

## Quick Setup (Choose One Option)

### Option 1: Download Noto Sans Gujarati (Recommended - Works on All Systems)

1. **Visit Google Fonts:**
   - Go to: https://fonts.google.com/noto/specimen/Noto+Sans+Gujarati
   - Click the **"Download family"** button (top right)

2. **Extract the ZIP file:**
   - Extract the downloaded ZIP file
   - Find the file: `NotoSansGujarati-Regular.ttf`

3. **Copy to fonts folder:**
   - Copy `NotoSansGujarati-Regular.ttf` to this folder: `backend/fonts/`
   - The full path should be: `backend/fonts/NotoSansGujarati-Regular.ttf`

4. **Restart your server:**
   - Stop your Node.js server (Ctrl+C)
   - Start it again: `npm run dev` or `npm start`

### Option 2: Use Nirmala UI (Windows Only)

If you're on Windows, Nirmala UI is usually pre-installed:

1. **Find the font:**
   - Open: `C:\Windows\Fonts\`
   - Look for: `Nirmala.ttf` or `NirmalaUI.ttf`

2. **Copy to fonts folder:**
   - Copy the font file to: `backend/fonts/Nirmala.ttf` or `backend/fonts/NirmalaUI.ttf`

3. **Restart your server**

## Verify Font is Working

After placing the font file and restarting:

1. Generate a PDF from the admin panel
2. Check the server console - you should see:
   ```
   ✓ Nirmala UI font registered successfully from: [path]
   ```
   OR
   ```
   ✓ Gujarati font registered successfully from: [path]
   ```

3. Open the PDF and verify Gujarati text displays correctly (not as boxes or garbled text)

## Troubleshooting

**If you see garbled text in the PDF:**
- Make sure the font file is in `backend/fonts/` folder
- Check the file name matches exactly (case-sensitive on some systems)
- Restart your server after adding the font
- Check server console for font registration messages

**If font is not found:**
- Verify the file exists: Check `backend/fonts/` folder
- Check file extension is `.ttf` (not `.otf` or `.woff`)
- Make sure you have read permissions on the font file

## Direct Download Links

- **Noto Sans Gujarati:** https://fonts.google.com/noto/specimen/Noto+Sans+Gujarati
- **Alternative:** Search for "Noto Sans Gujarati TTF download"

## Need Help?

If you continue to have issues:
1. Check the server console logs when generating a PDF
2. Verify the font file is a valid TTF file
3. Try a different Gujarati font (Shruti, Aakar, etc.)


