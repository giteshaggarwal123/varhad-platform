const crypto = require('crypto');

/**
 * Data Encryption Utility
 * Provides encryption/decryption for sensitive data
 */

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'varhad-prep-platform-secret-key-2025';

// Generate a consistent 32-byte key from the encryption key
const getKey = () => {
  return crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
};

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text with IV
 */
exports.encrypt = (text) => {
  if (!text) return text;
  
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV and encrypted data separated by ':'
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('[ENCRYPTION] Error encrypting data:', error.message);
    return text; // Return original if encryption fails
  }
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedText - Encrypted text with IV
 * @returns {string} - Decrypted text
 */
exports.decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  
  try {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(algorithm, getKey(), iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[ENCRYPTION] Error decrypting data:', error.message);
    return encryptedText; // Return original if decryption fails
  }
};

/**
 * Hash sensitive data (one-way)
 * @param {string} text - Text to hash
 * @returns {string} - Hashed text
 */
exports.hash = (text) => {
  if (!text) return text;
  
  try {
    return crypto.createHash('sha256').update(text).digest('hex');
  } catch (error) {
    console.error('[ENCRYPTION] Error hashing data:', error.message);
    return text;
  }
};

/**
 * Encrypt object fields
 * @param {Object} obj - Object with fields to encrypt
 * @param {Array} fields - Array of field names to encrypt
 * @returns {Object} - Object with encrypted fields
 */
exports.encryptFields = (obj, fields = []) => {
  if (!obj || !fields.length) return obj;
  
  const encrypted = { ...obj };
  
  fields.forEach(field => {
    if (encrypted[field]) {
      encrypted[field] = this.encrypt(encrypted[field].toString());
    }
  });
  
  return encrypted;
};

/**
 * Decrypt object fields
 * @param {Object} obj - Object with encrypted fields
 * @param {Array} fields - Array of field names to decrypt
 * @returns {Object} - Object with decrypted fields
 */
exports.decryptFields = (obj, fields = []) => {
  if (!obj || !fields.length) return obj;
  
  const decrypted = { ...obj };
  
  fields.forEach(field => {
    if (decrypted[field]) {
      decrypted[field] = this.decrypt(decrypted[field].toString());
    }
  });
  
  return decrypted;
};

/**
 * Generate secure random token
 * @param {number} length - Token length
 * @returns {string} - Random token
 */
exports.generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Mask sensitive data for display
 * @param {string} text - Text to mask
 * @param {number} visibleChars - Number of visible characters at start/end
 * @returns {string} - Masked text
 */
exports.maskData = (text, visibleChars = 2) => {
  if (!text || text.length <= visibleChars * 2) return text;
  
  const start = text.substring(0, visibleChars);
  const end = text.substring(text.length - visibleChars);
  const masked = '*'.repeat(text.length - (visibleChars * 2));
  
  return start + masked + end;
};

/**
 * Sanitize input to prevent injection attacks
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
exports.sanitizeInput = (input) => {
  if (!input) return input;
  
  // Remove potentially dangerous characters
  return input.toString()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

module.exports = exports;
