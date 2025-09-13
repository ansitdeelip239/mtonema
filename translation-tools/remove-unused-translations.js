// Auto-generated script to remove unused translation keys
// Review carefully before running!

const fs = require('fs');
const path = require('path');

const keysToRemove = [
  "common.actions.add",
  "common.actions.sort",
  "common.actions.refresh",
  "common.actions.retry",
  "common.actions.close",
  "common.actions.confirm",
  "common.actions.yes",
  "common.actions.no",
  "common.states.searching",
  "common.states.empty",
  "common.states.refreshToLoad",
  "errors.validation",
  "errors.unauthorized",
  "errors.generic",
  "validation.required",
  "validation.invalidEmail",
  "validation.minLength",
  "time.timeFormat",
  "greetings.welcome",
  "searchProperties.search.loading",
  "auth.signIn.account",
  "auth.signIn.toAccess",
  "auth.signIn.prompt",
  "auth.email.enterEmailMessage",
  "auth.mainScreen.headerTitle",
  "auth.mainScreen.partnerLogin",
  "auth.mainScreen.partnerSignup",
  "followUp.loadingFollowUp",
  "followUp.someday.empty",
  "language.choosePreferred",
  "language.current",
  "plurals.client.zero",
  "plurals.client.one",
  "plurals.client.other",
  "plurals.followUp.zero",
  "plurals.followUp.one",
  "plurals.followUp.other",
  "clientAssignment.usersSelected_plural",
  "clientAssignment.assignUsers_plural",
  "partnerFilter.toast.filterAppliedMessage_plural",
  "contentTemplate.header.templatesFound_plural",
  "contentScreen.headers.messageTemplates",
  "listings.messages.fetchFailed",
  "billing.planSwitcher.perMonth"
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
const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const localeFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

localeFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Processing ${file}...`);
  removeKeysFromTranslation(filePath, keysToRemove);
});

console.log('Done! Please review the changes and test your application.');
