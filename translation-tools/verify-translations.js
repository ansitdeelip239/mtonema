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

// Function to validate JSON structure
function validateJsonStructure(obj, path = '') {
  const issues = [];

  if (typeof obj !== 'object' || obj === null) {
    return issues;
  }

  for (const key in obj) {
    const currentPath = path ? `${path}.${key}` : key;
    const value = obj[key];

    if (value === null) {
      issues.push(`Null value at: ${currentPath}`);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Recursively validate nested objects
      issues.push(...validateJsonStructure(value, currentPath));
    } else if (typeof value === 'string') {
      // Check for empty strings
      if (value.trim() === '') {
        issues.push(`Empty string at: ${currentPath}`);
      }
    }
  }

  return issues;
}

// Function to compare two translation objects
function compareTranslations(enObj, targetObj, targetLang) {
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

// Main verification function
function verifyTranslationCompleteness() {
  console.log('🔍 Verifying translation completeness...\n');

  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  const enPath = path.join(localesDir, 'en.json');
  const amPath = path.join(localesDir, 'am.json');

  // Check if files exist
  if (!fs.existsSync(enPath)) {
    console.error('❌ en.json file not found at:', enPath);
    return;
  }

  if (!fs.existsSync(amPath)) {
    console.error('❌ am.json file not found at:', amPath);
    return;
  }

  let enTranslations, amTranslations;

  try {
    const enContent = fs.readFileSync(enPath, 'utf8');
    enTranslations = JSON.parse(enContent);
    console.log('✅ en.json parsed successfully');
  } catch (error) {
    console.error('❌ Error parsing en.json:', error.message);
    return;
  }

  try {
    const amContent = fs.readFileSync(amPath, 'utf8');
    amTranslations = JSON.parse(amContent);
    console.log('✅ am.json parsed successfully');
  } catch (error) {
    console.error('❌ Error parsing am.json:', error.message);
    return;
  }

  // Validate JSON structures
  console.log('\n🔍 Validating JSON structures...');

  const enIssues = validateJsonStructure(enTranslations);
  const amIssues = validateJsonStructure(amTranslations);

  if (enIssues.length > 0) {
    console.log('⚠️  Issues in en.json:');
    enIssues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('✅ en.json structure is valid');
  }

  if (amIssues.length > 0) {
    console.log('⚠️  Issues in am.json:');
    amIssues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('✅ am.json structure is valid');
  }

  // Compare translations
  console.log('\n🔍 Comparing translations...');
  const comparison = compareTranslations(enTranslations, amTranslations, 'am');

  console.log('\n📊 COMPARISON RESULTS:');
  console.log(`   English keys: ${comparison.totalEnKeys}`);
  console.log(`   Amharic keys: ${comparison.totalTargetKeys}`);
  console.log(`   Coverage: ${Math.round((comparison.totalTargetKeys / comparison.totalEnKeys) * 100)}%`);

  if (comparison.missingKeys.length > 0) {
    console.log('\n❌ MISSING KEYS IN am.json:');
    console.log('   (These English keys are not translated to Amharic)');
    comparison.missingKeys.forEach(key => console.log(`   - ${key}`));
  } else {
    console.log('\n✅ All English keys have Amharic translations');
  }

  if (comparison.extraKeys.length > 0) {
    console.log('\n⚠️  EXTRA KEYS IN am.json:');
    console.log('   (These keys exist in Amharic but not in English)');
    comparison.extraKeys.forEach(key => console.log(`   - ${key}`));
  } else {
    console.log('\n✅ No extra keys found in am.json');
  }

  if (comparison.emptyTranslations.length > 0) {
    console.log('\n⚠️  EMPTY TRANSLATIONS IN am.json:');
    console.log('   (These keys have empty string values)');
    comparison.emptyTranslations.forEach(key => console.log(`   - ${key}`));
  } else {
    console.log('\n✅ No empty translations found in am.json');
  }

  // Summary
  console.log('\n📋 SUMMARY:');
  const hasIssues = comparison.missingKeys.length > 0 || comparison.extraKeys.length > 0 ||
                   comparison.emptyTranslations.length > 0 || enIssues.length > 0 || amIssues.length > 0;

  if (hasIssues) {
    console.log('⚠️  ISSUES FOUND:');
    if (comparison.missingKeys.length > 0) {
      console.log(`   - ${comparison.missingKeys.length} missing translations`);
    }
    if (comparison.extraKeys.length > 0) {
      console.log(`   - ${comparison.extraKeys.length} extra keys`);
    }
    if (comparison.emptyTranslations.length > 0) {
      console.log(`   - ${comparison.emptyTranslations.length} empty translations`);
    }
    if (enIssues.length > 0) {
      console.log(`   - ${enIssues.length} structural issues in en.json`);
    }
    if (amIssues.length > 0) {
      console.log(`   - ${amIssues.length} structural issues in am.json`);
    }
  } else {
    console.log('🎉 am.json is complete and structurally sound!');
    console.log('   - All English keys have Amharic translations');
    console.log('   - No structural issues found');
    console.log('   - No empty translations');
  }

  // Save detailed report
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logsDir = path.join(__dirname, 'logs');
  
  // Ensure logs directory exists
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  const reportPath = path.join(logsDir, `translation-verification-${timestamp}.json`);

  const report = {
    summary: {
      enKeys: comparison.totalEnKeys,
      amKeys: comparison.totalTargetKeys,
      coverage: `${Math.round((comparison.totalTargetKeys / comparison.totalEnKeys) * 100)}%`,
      missingKeys: comparison.missingKeys.length,
      extraKeys: comparison.extraKeys.length,
      emptyTranslations: comparison.emptyTranslations.length,
      enIssues: enIssues.length,
      amIssues: amIssues.length,
      isComplete: !hasIssues,
      verificationDate: new Date().toISOString()
    },
    details: {
      missingKeys: comparison.missingKeys,
      extraKeys: comparison.extraKeys,
      emptyTranslations: comparison.emptyTranslations,
      enIssues,
      amIssues
    }
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Detailed report saved to: ${path.basename(reportPath)}`);

  return report;
}

// Helper function to verify all locale files
function verifyAllLocales() {
  console.log('🌍 Verifying all locale files...\n');

  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  const enPath = path.join(localesDir, 'en.json');

  if (!fs.existsSync(enPath)) {
    console.error('❌ en.json file not found');
    return;
  }

  let enTranslations;
  try {
    enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  } catch (error) {
    console.error('❌ Error parsing en.json:', error.message);
    return;
  }

  const localeFiles = fs.readdirSync(localesDir)
    .filter(file => file.endsWith('.json') && file !== 'en.json');

  const results = {};

  for (const file of localeFiles) {
    const filePath = path.join(localesDir, file);
    const langCode = file.replace('.json', '');

    console.log(`\n🔍 Checking ${file}...`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const translations = JSON.parse(content);
      const comparison = compareTranslations(enTranslations, translations, langCode);

      results[langCode] = {
        totalKeys: comparison.totalTargetKeys,
        coverage: Math.round((comparison.totalTargetKeys / comparison.totalEnKeys) * 100),
        missingKeys: comparison.missingKeys.length,
        extraKeys: comparison.extraKeys.length,
        emptyTranslations: comparison.emptyTranslations.length,
        isComplete: comparison.missingKeys.length === 0 && comparison.extraKeys.length === 0
      };

      console.log(`   Keys: ${comparison.totalTargetKeys}/${comparison.totalEnKeys} (${results[langCode].coverage}%)`);
      if (comparison.missingKeys.length > 0) {
        console.log(`   ❌ Missing: ${comparison.missingKeys.length} keys`);
      }
      if (comparison.extraKeys.length > 0) {
        console.log(`   ⚠️  Extra: ${comparison.extraKeys.length} keys`);
      }
      if (comparison.emptyTranslations.length > 0) {
        console.log(`   ⚠️  Empty: ${comparison.emptyTranslations.length} translations`);
      }

    } catch (error) {
      console.error(`   ❌ Error parsing ${file}: ${error.message}`);
      results[langCode] = { error: error.message };
    }
  }

  console.log('\n📊 OVERALL LOCALE STATUS:');
  Object.entries(results).forEach(([lang, data]) => {
    if (data.error) {
      console.log(`   ${lang}: ❌ Parse error`);
    } else {
      const status = data.isComplete ? '✅' : '⚠️ ';
      console.log(`   ${lang}: ${status} ${data.coverage}% complete (${data.totalKeys} keys)`);
    }
  });

  return results;
}

// Run verification
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--all')) {
    verifyAllLocales();
  } else {
    verifyTranslationCompleteness();
  }
}

module.exports = {
  verifyTranslationCompleteness,
  verifyAllLocales,
  flattenKeys,
  validateJsonStructure,
  compareTranslations
};