const fs = require('fs');
const path = require('path');

// Function to flatten nested object keys with dot notation
function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(flattenKeys(obj[key], newKey));
    } else {
      keys.push(newKey);
    }
  }
  return keys;
}

// Function to compare two translation objects and return detailed differences
function getDetailedDifferences(enObj, targetObj, targetLang) {
  const enKeys = new Set(flattenKeys(enObj));
  const targetKeys = new Set(flattenKeys(targetObj));

  const missingKeys = [];
  const extraKeys = [];
  const emptyTranslations = [];

  // Find missing keys in target language
  for (const key of enKeys) {
    if (!targetKeys.has(key)) {
      missingKeys.push(key);
    }
  }

  // Find extra keys in target language (not in en.json)
  for (const key of targetKeys) {
    if (!enKeys.has(key)) {
      extraKeys.push(key);
    }
  }

  // Check for empty translations in target language
  const targetFlat = flattenKeys(targetObj);
  for (const key of targetFlat) {
    const keyPath = key.split('.');
    let current = targetObj;
    for (const part of keyPath) {
      current = current[part];
    }
    if (typeof current === 'string' && current.trim() === '') {
      emptyTranslations.push(key);
    }
  }

  return {
    missingKeys,
    extraKeys,
    emptyTranslations,
    totalEnKeys: enKeys.size,
    totalTargetKeys: targetKeys.size
  };
}

// Function to get translation value from nested object
function getNestedValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  return current;
}

// Main function to analyze specific locale issues
function analyzeLocaleIssues() {
  console.log('🔍 Analyzing specific locale issues...\n');

  const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
  const enPath = path.join(localesDir, 'en.json');

  // Read English translations
  let enTranslations;
  try {
    enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  } catch (error) {
    console.error('❌ Error reading en.json:', error.message);
    return;
  }

  // Analyze Hindi (missing keys)
  console.log('🇮🇳 ANALYZING HINDI (hi.json) - MISSING KEYS:\n');

  const hiPath = path.join(localesDir, 'hi.json');
  try {
    const hiContent = fs.readFileSync(hiPath, 'utf8');
    const hiTranslations = JSON.parse(hiContent);
    const hiComparison = getDetailedDifferences(enTranslations, hiTranslations, 'hi');

    console.log(`📊 Hindi Status: ${hiComparison.totalTargetKeys}/${hiComparison.totalEnKeys} keys (${Math.round((hiComparison.totalTargetKeys / hiComparison.totalEnKeys) * 100)}% coverage)`);

    if (hiComparison.missingKeys.length > 0) {
      console.log(`\n❌ MISSING KEYS IN HINDI (${hiComparison.missingKeys.length}):`);
      console.log('   These English keys need Hindi translations:\n');

      hiComparison.missingKeys.forEach((key, index) => {
        const englishValue = getNestedValue(enTranslations, key);
        console.log(`   ${index + 1}. ${key}`);
        console.log(`      English: "${englishValue}"`);
        console.log(`      Hindi: (MISSING)`);
        console.log('');
      });
    }

    if (hiComparison.emptyTranslations.length > 0) {
      console.log(`\n⚠️  EMPTY TRANSLATIONS IN HINDI (${hiComparison.emptyTranslations.length}):`);
      hiComparison.emptyTranslations.forEach((key, index) => {
        const englishValue = getNestedValue(enTranslations, key);
        console.log(`   ${index + 1}. ${key}`);
        console.log(`      English: "${englishValue}"`);
        console.log(`      Hindi: "" (EMPTY)`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error reading hi.json:', error.message);
  }

  // Analyze Arabic (extra keys)
  console.log('\n🇸🇦 ANALYZING ARABIC (ar.json) - EXTRA KEYS:\n');

  const arPath = path.join(localesDir, 'ar.json');
  try {
    const arContent = fs.readFileSync(arPath, 'utf8');
    const arTranslations = JSON.parse(arContent);
    const arComparison = getDetailedDifferences(enTranslations, arTranslations, 'ar');

    console.log(`📊 Arabic Status: ${arComparison.totalTargetKeys}/${arComparison.totalEnKeys} keys (${Math.round((arComparison.totalTargetKeys / arComparison.totalEnKeys) * 100)}% coverage)`);

    if (arComparison.extraKeys.length > 0) {
      console.log(`\n⚠️  EXTRA KEYS IN ARABIC (${arComparison.extraKeys.length}):`);
      console.log('   These Arabic keys do not exist in English (may need to be added to en.json or removed from ar.json):\n');

      arComparison.extraKeys.forEach((key, index) => {
        const arabicValue = getNestedValue(arTranslations, key);
        console.log(`   ${index + 1}. ${key}`);
        console.log(`      Arabic: "${arabicValue}"`);
        console.log(`      English: (DOES NOT EXIST)`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error reading ar.json:', error.message);
  }

  // Summary and recommendations
  console.log('📋 SUMMARY AND RECOMMENDATIONS:\n');

  console.log('🇮🇳 HINDI (hi.json):');
  console.log('   - Missing translations need to be added');
  console.log('   - Empty translations should be filled with proper Hindi text');
  console.log('   - Consider using Google Translate or professional translators');

  console.log('\n🇸🇦 ARABIC (ar.json):');
  console.log('   - Extra keys should be reviewed:');
  console.log('     * If they represent new features: Add them to en.json first');
  console.log('     * If they are obsolete: Remove them from ar.json');
  console.log('     * If they are language-specific: Consider keeping them');

  console.log('\n💡 RECOMMENDED ACTIONS:');
  console.log('   1. Add missing Hindi translations');
  console.log('   2. Fill empty Hindi translations');
  console.log('   3. Review Arabic extra keys and decide their fate');
  console.log('   4. Re-run verification after fixes');

  // Save detailed report
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logsDir = path.join(__dirname, 'logs');
  
  // Ensure logs directory exists
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  const reportPath = path.join(logsDir, `locale-issues-detailed-${timestamp}.json`);

  const hiComparison = getDetailedDifferences(enTranslations, JSON.parse(fs.readFileSync(hiPath, 'utf8')), 'hi');
  const arComparison = getDetailedDifferences(enTranslations, JSON.parse(fs.readFileSync(arPath, 'utf8')), 'ar');

  const report = {
    hindi: {
      missingKeys: hiComparison.missingKeys,
      emptyTranslations: hiComparison.emptyTranslations,
      coverage: `${Math.round((hiComparison.totalTargetKeys / hiComparison.totalEnKeys) * 100)}%`
    },
    arabic: {
      extraKeys: arComparison.extraKeys,
      coverage: `${Math.round((arComparison.totalTargetKeys / arComparison.totalEnKeys) * 100)}%`
    },
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Detailed report saved to: ${path.basename(reportPath)}`);
}

// Run the analysis
if (require.main === module) {
  analyzeLocaleIssues();
}

module.exports = { analyzeLocaleIssues, getDetailedDifferences, getNestedValue };