const axios = require('axios');

const API_KEY = 'AIzaSyCdYBZhwOmX4doQpBu9fn7poEoy0QoMbgA';

exports.checkUrlSafety = async (url) => {
  try {
    const res = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
      {
        client: { clientId: 'qr-checker', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      }
    );
    return !res.data.matches;
  } catch (err) {
    return false;
  }
};
