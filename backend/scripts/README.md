# Backend Scripts

This folder contains utility scripts for database operations and maintenance.

## Available Scripts

### addVillages.js

Adds a list of villages to the database. The script will:
- Connect to MongoDB using the connection string from `.env` file or default
- Check if each village already exists (to avoid duplicates)
- Add only new villages
- Provide a summary of added, skipped, and errored villages

#### Usage

From the `backend` directory, run:

```bash
npm run add-villages
```

Or directly:

```bash
node scripts/addVillages.js
```

#### Requirements

- MongoDB must be running
- `.env` file should contain `MONGODB_URI` (optional, defaults to `mongodb://localhost:27017/gaudani_parivar`)

#### Output

The script will display:
- Connection status
- Status for each village (Added/Skipped/Error)
- Summary with counts
- Connection closure confirmation

#### Example Output

```
🔌 Connecting to MongoDB...
✅ MongoDB connected successfully

✅ Added: "એકલેરા"
✅ Added: "ધામેલ"
⏭️  Skipped: "કણકોટ" (already exists)
...

==================================================
📊 Summary:
   ✅ Added: 14 villages
   ⏭️  Skipped: 2 villages (already exist)
==================================================

✅ Database connection closed
```

### addStandards.js

Adds a comprehensive list of standards (school and college levels) to the database. The script includes:
- School levels: બાલભવન, જુ.કે.જી, સી.કે.જી, ધો. ૧ to ધો. ૧૨
- College degrees: Medical, Engineering, Commerce, Arts, Law, Education, and more
- Automatically sets `isCollegeLevel` flag for college degrees
- Sets proper `displayOrder` for sorting

#### Usage

From the `backend` directory, run:

```bash
npm run add-standards
```

Or directly:

```bash
node scripts/addStandards.js
```

#### Requirements

- MongoDB must be running
- `.env` file should contain `MONGODB_URI` (optional, defaults to `mongodb://localhost:27017/gaudani_parivar`)

#### Output

The script will display:
- Connection status
- Status for each standard (Added/Skipped/Error)
- Summary with counts
- Connection closure confirmation

#### Standards Included

**School Level:**
- બાલભવન, જુ.કે.જી, સી.કે.જી
- ધો. ૧ to ધો. ૧૨

**College Level (Medical & Health):**
- BPT, MPT, B.S.C, M.B.B.S, BDS, MDS, B.H.M.S, BAMS
- B.Pharm, M.Pharm, D.Pharm
- B.Sc Nursing, M.Sc Nursing
- MD, MS

**College Level (Engineering & Technology):**
- B.TECH, M.TECH, B.E, M.E
- DIPLOMA Eng., B.Arch, M.Arch

**College Level (Computer Science & IT):**
- B.C.A, M.C.A
- B.S.C IT, M.S.C IT
- B.Tech IT, M.Tech IT

**College Level (Commerce & Business):**
- B.B.A, M.B.A
- B.COM, M.com
- CA, CS, CMA

**College Level (Arts & Humanities):**
- B.A, M.A
- BFA, MFA

**College Level (Science):**
- MSC, M.Sc

**College Level (Law):**
- LLB, LLM

**College Level (Education):**
- B.Ed, M.Ed

**College Level (Design):**
- B.Des, M.Des

**College Level (Veterinary):**
- B.V.Sc, M.V.Sc

#### Example Output

```
🔌 Connecting to MongoDB...
✅ MongoDB connected successfully

✅ Added: "બાલભવન" (BALBHAVAN)
✅ Added: "જુ.કે.જી" (JKG)
⏭️  Skipped: "ધો. ૧" (STD1) - already exists
...

==================================================
📊 Summary:
   ✅ Added: 60 standards
   ⏭️  Skipped: 5 standards (already exist)
==================================================

✅ Database connection closed
```

