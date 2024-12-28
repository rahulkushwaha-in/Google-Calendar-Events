const { google } = require('googleapis');

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BACKEND_URL}/auth/google/callback`
);

const getCalendarService = async (accessToken, refreshToken) => {
  try {
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
  } catch (error) {
    console.error('Google Calendar Auth Error:', error);
    throw new Error('Failed to authenticate with Google Calendar');
  }
};

module.exports = { oauth2Client, getCalendarService };