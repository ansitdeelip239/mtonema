# Translation Tools 📝

This folder contains scripts for managing and debugging translation files in the MT O    └── locale-issues-detailed-*.json
```

## 📊 Report Files Location

All report files are now automatically saved to the `logs/` folder with timestamps:
- `logs/unused-translations-*.json` - Keys that can be safely removed
- `logs/used-translations-*.json` - Keys currently being used
- `logs/translation-verification-*.json` - Completeness verification results
- `logs/locale-issues-detailed-*.json` - Detailed issue analysis

**View recent reports:**
```bash
ls -la logs/
# Shows all generated report files with timestamps
```

**Clean old reports:**
```bash
# Remove reports older than 30 days
find logs/ -name "*.json" -mtime +30 -delete
```roject.

## 📋 Available Scripts

### 1. `find-unused-translations.js`
**Purpose**: Find translation keys that are not being used in the codebase
- Scans all TypeScript/JavaScript files in `src/`
- Compares against `en.json` translations
- Generates reports of unused keys
- Creates removal script automatically

**Usage**:
```bash
node find-unused-translations.js
```

**Output**:
- Console report with usage statistics
- `unused-translations-[timestamp].json` - detailed unused keys
- `used-translations-[timestamp].json` - keys that are being used
- `remove-unused-translations.js` - auto-generated removal script

### 2. `verify-translations.js`
**Purpose**: Verify translation completeness across all locale files
- Compares each locale file against `en.json`
- Checks for missing, extra, and empty translations
- Validates JSON structure

**Usage**:
```bash
# Check specific language (default: am.json)
node verify-translations.js

# Check all languages
node verify-translations.js --all
```

**Output**:
- Coverage percentage for each language
- List of missing/extra keys
- `translation-verification-[timestamp].json` - detailed report

### 3. `analyze-locale-issues.js`
**Purpose**: Detailed analysis of specific locale issues
- Focuses on Hindi (missing keys) and Arabic (extra keys)
- Shows exact English text for missing translations
- Provides actionable recommendations

**Usage**:
```bash
node analyze-locale-issues.js
```

**Output**:
- Detailed breakdown of missing Hindi keys
- List of extra Arabic keys
- Recommendations for fixing issues
- `locale-issues-detailed-[timestamp].json` - comprehensive report

### 5. `run-translation-tool.js`
**Purpose**: Unified runner for all translation tools
- Single entry point for all translation scripts
- Easy command-line interface

**Usage**:
```bash
node run-translation-tool.js <command>
```

**Available commands**:
- `find-unused` - Find unused translation keys
- `verify` - Verify translation completeness
- `verify-all` - Verify all locale files
- `analyze-issues` - Detailed Hindi/Arabic analysis
- `remove-unused` - Remove unused translations
- `list` - Show all available commands

### 6. `status.js`
**Purpose**: Quick overview of translation status
- Shows key counts and coverage for all languages
- Fast status check without detailed analysis

**Usage**:
```bash
node status.js
```

**Output**:
- Total keys per language
- Coverage percentage
- Status indicators (✅⚠️❌)

## � Folder Structure

```
translation-tools/
├── README.md                    # This documentation
├── run-translation-tool.js     # Unified command runner
├── status.js                   # Quick status overview
├── find-unused-translations.js # Find unused keys
├── verify-translations.js      # Verify completeness
├── analyze-locale-issues.js    # Detailed issue analysis
├── remove-unused-translations.js # Remove unused keys
└── logs/                       # 📁 All report files stored here
    ├── unused-translations-*.json
    ├── used-translations-*.json
    ├── translation-verification-*.json
    └── locale-issues-detailed-*.json
```

## � Common Workflows

### Quick Status Check
```bash
# Get instant overview of all translations
node status.js
```

### Finding and Removing Unused Translations
```bash
# 1. Find unused translations
node run-translation-tool.js find-unused

# 2. Review the generated reports
# 3. Backup your locale files
cp -r src/i18n/locales src/i18n/locales.backup

# 4. Run the removal script (if satisfied)
node run-translation-tool.js remove-unused
```

### Checking Translation Completeness
```bash
# Check all languages at once
node run-translation-tool.js verify-all

# Or check specific issues in detail
node run-translation-tool.js analyze-issues
```

### Debugging Translation Issues
```bash
# 1. Verify overall status
node run-translation-tool.js verify-all

# 2. Get detailed issue breakdown
node run-translation-tool.js analyze-issues

# 3. Find unused keys if needed
node run-translation-tool.js find-unused
```