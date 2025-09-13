#!/usr/bin/env node

/**
 * Translation Status Overview
 * Quick status check for all locale files
 */

const fs = require('fs');
const path = require('path');

function getTranslationStats() {
  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  const enPath = path.join(localesDir, 'en.json');

  try {
    const enContent = fs.readFileSync(enPath, 'utf8');
    const enTranslations = JSON.parse(enContent);

    // Count total keys in English
    function countKeys(obj) {
      let count = 0;
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          count += countKeys(obj[key]);
        } else {
          count++;
        }
      }
      return count;
    }

    const totalEnKeys = countKeys(enTranslations);

    console.log('📊 TRANSLATION STATUS OVERVIEW\n');
    console.log(`🇺🇸 English (en.json): ${totalEnKeys} keys (reference)\n`);

    // Check other languages
    const localeFiles = fs.readdirSync(localesDir)
      .filter(file => file.endsWith('.json') && file !== 'en.json')
      .sort();

    localeFiles.forEach(file => {
      const filePath = path.join(localesDir, file);
      const langCode = file.replace('.json', '');

      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(content);
        const keyCount = countKeys(translations);
        const coverage = Math.round((keyCount / totalEnKeys) * 100);

        const status = coverage === 100 ? '✅' : coverage >= 95 ? '⚠️ ' : '❌';
        const flag = getLanguageFlag(langCode);

        console.log(`${flag} ${langCode.toUpperCase()}: ${status} ${keyCount}/${totalEnKeys} keys (${coverage}%)`);
      } catch (error) {
        console.log(`❌ ${langCode.toUpperCase()}: Parse error`);
      }
    });

    console.log('\n💡 Quick Actions:');
    console.log('  node run-translation-tool.js verify-all     # Detailed verification');
    console.log('  node run-translation-tool.js analyze-issues # Hindi/Arabic issues');
    console.log('  node run-translation-tool.js find-unused    # Find unused keys');

  } catch (error) {
    console.error('❌ Error reading English translations:', error.message);
  }
}

function getLanguageFlag(langCode) {
  const flags = {
    'am': '🇪🇹', // Ethiopia (Amharic)
    'ar': '🇸🇦', // Saudi Arabia (Arabic)
    'es': '🇪🇸', // Spain (Spanish)
    'hi': '🇮🇳', // India (Hindi)
    'pt': '🇵🇹'  // Portugal (Portuguese)
  };
  return flags[langCode] || '🌍';
}

// Run if called directly
if (require.main === module) {
  getTranslationStats();
}

module.exports = { getTranslationStats };