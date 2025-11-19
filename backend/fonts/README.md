# Gujarati Font for PDF Generation

This directory should contain a Gujarati font file for proper rendering of Gujarati text in PDF documents.

## Recommended Fonts

### 1. Nirmala UI (Recommended - Windows System Font)
**Nirmala UI** is a Windows system font that provides excellent support for Gujarati characters. It's pre-installed on Windows systems.

**Location on Windows:**
- `C:\Windows\Fonts\NirmalaUI.ttf`
- `C:\Windows\Fonts\Nirmala.ttf`

**How to use:**
- The PDF generation code automatically detects Nirmala UI from Windows Fonts directory
- If you want to use a local copy, place it in this directory as:
  - `NirmalaUI.ttf` (preferred)
  - `Nirmala.ttf`

### 2. Noto Sans Gujarati (Alternative)
**Noto Sans Gujarati** is also recommended as it provides excellent support for Gujarati characters.

**How to Add:**
1. Download Noto Sans Gujarati from:
   - Google Fonts: https://fonts.google.com/noto/specimen/Noto+Sans+Gujarati
   - Or use: https://github.com/google/fonts/tree/main/ofl/notosansgujarati

2. Place the font file in this directory with one of these names:
   - `NotoSansGujarati-Regular.ttf` (preferred)
   - `NotoSansGujarati.ttf`
   - `gujarati.ttf`
   - `Gujarati.ttf`

## Font Priority

The PDF generation code will try fonts in this order:
1. **Nirmala UI** from Windows Fonts directory (if on Windows)
2. **Nirmala UI** from this directory
3. **Noto Sans Gujarati** from this directory
4. Other Gujarati fonts from this directory

## Alternative Fonts

You can also use other Gujarati fonts such as:
- Shruti
- Aakar
- Any other TTF font that supports Gujarati Unicode range

Just rename the font file to one of the names listed above, or update the font path in `backend/src/controllers/reportController.js`.

## Note

If no Gujarati font is found, the PDF will fall back to the default Helvetica font, which may not render Gujarati characters correctly (they may appear as boxes or question marks). The code will log a warning message if no font is found.

