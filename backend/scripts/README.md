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

