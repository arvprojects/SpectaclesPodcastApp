const express = require('express');
const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');

// Start an async IIFE to allow async/await with dynamic imports
(async () => {
  const fetch = (await import('node-fetch')).default;
  const open = (await import('open')).default;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function waitForUserInput(question) {
    return new Promise(resolve => rl.question(question, resolve));
  }

  const clientId = await waitForUserInput('Please enter your Spotify Client ID: ');
  const clientSecret = await waitForUserInput('Please enter your Spotify Client Secret: ');

  const app = express();
  const PORT = 3000;
  let redirectUri = '';
  let tokenExpiryTime = 0;

  app.get('/', (req, res) => {
    if (req.query.code) {
      const authCode = req.query.code;
      res.send('Authorization code received! You can close this window.');
      console.log(`Authorization code: ${authCode}`);
      rl.close();
      getSpotifyAccessToken(authCode);
    } else {
      res.send('Spotify Auth Server is running');
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });

  async function startNgrok() {
    console.log('Starting ngrok...');
    return new Promise((resolve, reject) => {
      exec('ngrok http 3000', (error, stdout, stderr) => {
        if (error) {
          reject(`ngrok error: ${stderr}`);
        }
      });

      setTimeout(() => {
        fetch('http://127.0.0.1:4040/api/tunnels')
          .then(res => res.json())
          .then(data => {
            const tunnel = data.tunnels.find(t => t.proto === 'https');
            if (tunnel) {
              redirectUri = tunnel.public_url;
              resolve(tunnel.public_url);
            } else {
              reject('No public URL found from ngrok');
            }
          })
          .catch(err => reject(err));
      }, 2000);
    });
  }

  async function getSpotifyAuthCode() {
    console.log(`Please set the following URL as your redirect URI in the Spotify Developer Portal:\n${redirectUri}`);
    await waitForUserInput('Press Enter after you have updated the Spotify redirect URI.');

    const scopes = 'user-read-playback-state user-modify-playback-state';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

    console.log(`Opening authorization URL in your browser:\n${authUrl}`);
    await open(authUrl);

    const authCode = await waitForUserInput('After authorizing, paste the authorization code here: ');
    return authCode.trim();
  }

  async function getSpotifyAccessToken(authCode) {
    const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${encodeURIComponent(redirectUri)}`
    });

    if (!response.ok) {
      throw new Error('Failed to get access token: ' + await response.text());
    }

    const data = await response.json();
    tokenExpiryTime = Date.now() + data.expires_in * 1000; // Set token expiry time
    saveTokens(data.access_token, data.refresh_token);
  }

  async function refreshAccessToken(refreshToken) {
    const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token: ' + await response.text());
    }

    const data = await response.json();
    tokenExpiryTime = Date.now() + data.expires_in * 1000; // Update token expiry time
    saveTokens(data.access_token, refreshToken); // Save the new access token
    return data.access_token;
  }

  function saveTokens(accessToken, refreshToken) {
    const filePath = '/Users/veerenpatel/SpectaclesPodcastApp/PodcastAR 1/Assets/spotifyAccessToken.js';
    const fileContent = `
      function getToken() {
        return '${accessToken}';
      }
      
      const refreshToken = '${refreshToken}';
      const tokenExpiryTime = ${tokenExpiryTime};
  
      module.exports = { getToken, refreshToken, tokenExpiryTime };
    `;
    fs.writeFileSync(filePath, fileContent);
    console.log(`Tokens saved to ${filePath}`);
  }

  async function getValidAccessToken() {
    const { authtoken, refreshToken, tokenExpiryTime } = require('/Users/veerenpatel/desktop/Snap/SpectaclesPodcastApp/PodcastAR 1/Assets/spotifyAccessToken.js');
    
    if (Date.now() >= tokenExpiryTime) {
      console.log('Access token expired, refreshing...');
      return await refreshAccessToken(refreshToken);
    } else {
      return authtoken;
    }
  }

  try {
    await startNgrok();
    const authCode = await getSpotifyAuthCode();
    await getSpotifyAccessToken(authCode);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
})();