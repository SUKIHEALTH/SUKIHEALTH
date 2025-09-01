const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
 
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/token.json');
 
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.error('❌ Error loading credentials.json:', err);
  authorize(JSON.parse(content));
});
 
function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
 
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });
 
  console.log('\n🔗 Authorize this app by visiting this URL:\n', authUrl);
 
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
 
  rl.question('\n📥 Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('❌ Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
 
      fs.writeFile(TOKEN_PATH, JSON.stringify(token, null, 2), (err) => {
        if (err) return console.error('❌ Error saving token.json', err);
        console.log('✅ Token stored to', TOKEN_PATH);
      });
    });
  });
}