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

// Function to recursively find all TypeScript files
function findTSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, and other common directories
      if (!['node_modules', '.git', 'build', 'dist', 'coverage', '.expo'].includes(file)) {
        findTSFiles(filePath, fileList);
      }
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Function to search for translation key usage in files
function searchKeyInFiles(key, files) {
  const patterns = [
    // Common i18n usage patterns
    `t('${key}')`,
    `t("${key}")`,
    `t\`${key}\``,
    `translate('${key}')`,
    `translate("${key}")`,
    `i18n.t('${key}')`,
    `i18n.t("${key}")`,
    `$t('${key}')`,
    `$t("${key}")`,
    // Direct string usage (in case keys are used as strings)
    `'${key}'`,
    `"${key}"`,
    `\`${key}\``,
    // Template usage (common in React Native i18n)
    `'${key.replace(/\./g, '\\.')}'`,
    `"${key.replace(/\./g, '\\.')}"`,
  ];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check each pattern
      for (const pattern of patterns) {
        if (content.includes(pattern.replace(/'/g, '"')) || 
            content.includes(pattern.replace(/"/g, "'")) ||
            content.includes(pattern)) {
          return { found: true, file, pattern };
        }
      }

      // Also check for partial key matches (in case of dynamic keys)
      const keyParts = key.split('.');
      for (let i = keyParts.length - 1; i >= 0; i--) {
        const partialKey = keyParts.slice(i).join('.');
        if (content.includes(`'${partialKey}'`) || 
            content.includes(`"${partialKey}"`) ||
            content.includes(`\`${partialKey}\``)) {
          return { found: true, file, pattern: `partial: ${partialKey}` };
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not read file ${file}: ${error.message}`);
    }
  }
  
  return { found: false };
}

// Function to analyze translation usage
function analyzeTranslationUsage() {
  console.log('🔍 Starting translation usage analysis...\n');

  // Read and parse en.json
  const enJsonPath = path.join(__dirname, 'src', 'i18n', 'locales', 'en.json');
  
  if (!fs.existsSync(enJsonPath)) {
    console.error('❌ en.json file not found at:', enJsonPath);
    return;
  }

  let translations;
  try {
    const enContent = fs.readFileSync(enJsonPath, 'utf8');
    translations = JSON.parse(enContent);
  } catch (error) {
    console.error('❌ Error parsing en.json:', error.message);
    return;
  }

  // Get all translation keys
  const allKeys = flattenKeys(translations);
  console.log(`📝 Found ${allKeys.length} translation keys in en.json`);

  // Find all TypeScript files
  console.log('🔎 Scanning TypeScript files...');
  const srcDir = path.join(__dirname, 'src');
  const tsFiles = findTSFiles(srcDir);
  console.log(`📁 Found ${tsFiles.length} TypeScript/JavaScript files to analyze`);

  // Analyze each key
  console.log('\n🕵️  Analyzing key usage...');
  const unusedKeys = [];
  const usedKeys = [];

  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i];
    process.stdout.write(`\r📊 Progress: ${i + 1}/${allKeys.length} (${Math.round((i + 1) / allKeys.length * 100)}%)`);

    const result = searchKeyInFiles(key, tsFiles);
    if (result.found) {
      usedKeys.push({ key, ...result });
    } else {
      unusedKeys.push(key);
    }
  }

  console.log('\n\n✅ Analysis complete!\n');

  // Results
  console.log('📊 RESULTS:');
  console.log(`   Total keys: ${allKeys.length}`);
  console.log(`   Used keys: ${usedKeys.length}`);
  console.log(`   Unused keys: ${unusedKeys.length}`);
  console.log(`   Usage rate: ${Math.round(usedKeys.length / allKeys.length * 100)}%`);

  if (unusedKeys.length > 0) {
    console.log('\n🗑️  UNUSED TRANSLATION KEYS:');
    console.log('   (These keys can potentially be safely removed)\n');

    // Group by top-level category
    const grouped = unusedKeys.reduce((acc, key) => {
      const category = key.split('.')[0];
      if (!acc[category]) acc[category] = [];
      acc[category].push(key);
      return acc;
    }, {});

    // Display grouped results
    Object.keys(grouped).sort().forEach(category => {
      console.log(`📂 ${category}:`);
      grouped[category].forEach(key => {
        console.log(`   - ${key}`);
      });
      console.log('');
    });

    // Save detailed results to files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logsDir = path.join(__dirname, 'logs');
    
    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Save unused keys list
    const unusedKeysFile = path.join(logsDir, `unused-translations-${timestamp}.json`);
    fs.writeFileSync(unusedKeysFile, JSON.stringify({
      summary: {
        totalKeys: allKeys.length,
        usedKeys: usedKeys.length,
        unusedKeys: unusedKeys.length,
        usageRate: `${Math.round(usedKeys.length / allKeys.length * 100)}%`,
        analysisDate: new Date().toISOString()
      },
      unusedKeys: unusedKeys,
      groupedByCategory: grouped
    }, null, 2));

    // Save used keys with file references
    const usedKeysFile = path.join(logsDir, `used-translations-${timestamp}.json`);
    fs.writeFileSync(usedKeysFile, JSON.stringify({
      summary: {
        totalUsedKeys: usedKeys.length,
        analysisDate: new Date().toISOString()
      },
      usedKeys: usedKeys.map(item => ({
        key: item.key,
        foundInFile: path.relative(__dirname, item.file),
        matchPattern: item.pattern
      }))
    }, null, 2));

    console.log(`💾 Detailed results saved:`);
    console.log(`   📄 Unused keys: ${path.basename(unusedKeysFile)}`);
    console.log(`   📄 Used keys: ${path.basename(usedKeysFile)}`);
    
    console.log('\n⚠️  IMPORTANT NOTES:');
    console.log('   - Review the unused keys before deletion');
    console.log('   - Some keys might be used dynamically or in templates');
    console.log('   - Keys might be used in native code (Android/iOS)');
    console.log('   - Consider checking other file types (.json config files, etc.)');
    console.log('   - Test thoroughly after removing any keys');

  } else {
    console.log('\n🎉 All translation keys are being used!');
  }

  return {
    total: allKeys.length,
    used: usedKeys.length,
    unused: unusedKeys.length,
    unusedKeys,
    usedKeys
  };
}

// Helper function to create a removal script
function createRemovalScript(unusedKeys) {
  if (unusedKeys.length === 0) return;

  const scriptContent = `// Auto-generated script to remove unused translation keys
// Review carefully before running!

const fs = require('fs');
const path = require('path');

const keysToRemove = ${JSON.stringify(unusedKeys, null, 2)};

function removeKeysFromTranslation(filePath, keys) {
  const content = fs.readFileSync(filePath, 'utf8');
  const translations = JSON.parse(content);
  
  keys.forEach(key => {
    const keyPath = key.split('.');
    let current = translations;
    
    for (let i = 0; i < keyPath.length - 1; i++) {
      if (current[keyPath[i]]) {
        current = current[keyPath[i]];
      } else {
        return; // Key doesn't exist
      }
    }
    
    if (current[keyPath[keyPath.length - 1]]) {
      delete current[keyPath[keyPath.length - 1]];
      console.log(\`Removed: \${key}\`);
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
}

// Apply to all locale files
const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const localeFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

localeFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(\`Processing \${file}...\`);
  removeKeysFromTranslation(filePath, keysToRemove);
});

console.log('Done! Please review the changes and test your application.');
`;

  const scriptPath = path.join(__dirname, 'remove-unused-translations.js');
  fs.writeFileSync(scriptPath, scriptContent);
  console.log(`\n🛠️  Removal script created: ${path.basename(scriptPath)}`);
  console.log('   ⚠️  Review the script before running it!');
}

// Run the analysis
if (require.main === module) {
  const results = analyzeTranslationUsage();
  if (results && results.unusedKeys.length > 0) {
    createRemovalScript(results.unusedKeys);
  }
}

module.exports = { 
  analyzeTranslationUsage, 
  flattenKeys, 
  findTSFiles, 
  searchKeyInFiles 
};