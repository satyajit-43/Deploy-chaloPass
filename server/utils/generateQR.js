const { v4: uuidv4 } = require('uuid');

module.exports = async (email) => {
  // In production, you might generate actual QR code data
  return `${uuidv4()}`;
};