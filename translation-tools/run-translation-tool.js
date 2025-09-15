#!/usr/bin/env node

/**
 * Translation Tools Runner
 * Quick access to all translation debugging tools
 */

const { execSync } = require('child_process');
const path = require('path');

const tools = {
  'find-unused': {
    script: 'find-unused-translations.js',
    description: 'Find unused translation keys in the codebase'
  },
  'verify': {
    script: 'verify-translations.js',
    description: 'Verify translation completeness'
  },
  'verify-all': {
    script: 'verify-translations.js --all',
    description: 'Verify all locale files completeness'
  },
  'analyze-issues': {
    script: 'analyze-locale-issues.js',
    description: 'Detailed analysis of Hindi/Arabic issues'
  },
  'remove-unused': {
    script: 'remove-unused-translations.js',
    description: 'Remove unused translations (⚠️  backup first!)'
  },
  'list': {
    script: null,
    description: 'List all available tools'
  }
};

function showHelp() {
  console.log('🚀 Translation Tools Runner\n');
  console.log('Usage: node run-translation-tool.js <command>\n');
  console.log('Available commands:');
  Object.entries(tools).forEach(([cmd, info]) => {
    console.log(`  ${cmd.padEnd(15)} - ${info.description}`);
  });
  console.log('\nExamples:');
  console.log('  node run-translation-tool.js find-unused');
  console.log('  node run-translation-tool.js verify-all');
  console.log('  node run-translation-tool.js analyze-issues');
  console.log('\nFor detailed help, see translation-tools/README.md');
}

function runTool(command) {
  const tool = tools[command];
  if (!tool) {
    console.error(`❌ Unknown command: ${command}`);
    showHelp();
    return;
  }

  if (command === 'list') {
    showHelp();
    return;
  }

  const scriptPath = path.join(__dirname, tool.script);
  console.log(`🔧 Running: ${tool.description}`);
  console.log(`📄 Script: ${tool.script}\n`);

  try {
    execSync(`node ${scriptPath}`, { stdio: 'inherit', cwd: path.dirname(__dirname) });
  } catch (error) {
    console.error(`❌ Error running ${tool.script}:`, error.message);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  showHelp();
} else {
  runTool(command);
}