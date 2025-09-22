// Auto-generated script to remove unused translation keys
// Review carefully before running!

const fs = require('fs');
const path = require('path');

const keysToRemove = [
  "navigation.drawer.chatWithUs",
  "seller.status.underConstruction"
];

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
      console.log(`Removed: ${key}`);
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
}

// Apply to all locale files
const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
const localeFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

localeFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Processing ${file}...`);
  removeKeysFromTranslation(filePath, keysToRemove);
});

console.log('Done! Please review the changes and test your application.');
