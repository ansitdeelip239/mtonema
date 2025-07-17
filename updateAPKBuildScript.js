const https = require('https');
const { Buffer } = require('buffer');

// updateAPKBuildScript.js

const API_URL =
  'https://mtestatesapi-f0bthnfwbtbxcecu.southindia-01.azurewebsites.net/appsettings';
const AUTH_TOKEN =
  'e74e1523bfaf582757ca621fd6166361a1df604b3c6369383f313fba83baceac';

const apkLink = process.argv[2];

if (!apkLink) {
  console.error('Usage: node updateAPKBuildScript.js <APK_LINK>');
  process.exit(1);
}

const data = JSON.stringify({
  key: 'APKLink',
  value: apkLink,
});

const options = {
  method: 'PUT',
  headers: {
    accept: 'text/plain',
    Authorization: `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json-patch+json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = https.request(API_URL, options, res => {
  let body = '';
  res.on('data', chunk => (body += chunk));
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Response:', body);
  });
});

req.on('error', e => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
