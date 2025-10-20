/**
 * Password Strength Validator
 * Enforces strong password requirements
 */

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
const validatePassword = (password) => {
  const errors = [];

  // Minimum length
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Maximum length (prevent DoS)
  if (password && password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }

  // Must contain uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Must contain lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Must contain number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Must contain special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  }

  // Check for common weak passwords
  const weakPasswords = [
    'password', 'password123', '12345678', 'qwerty123', 'admin123',
    'letmein', 'welcome', 'monkey', '1234567890', 'password1'
  ];

  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a stronger password');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculateStrength(password)
  };
};

/**
 * Calculate password strength score (0-100)
 */
const calculateStrength = (password) => {
  let score = 0;

  if (!password) return 0;

  // Length score (max 30 points)
  score += Math.min(30, password.length * 2);

  // Character variety (max 40 points)
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  // Complexity bonus (max 30 points)
  const hasMultipleUpper = (password.match(/[A-Z]/g) || []).length >= 2;
  const hasMultipleLower = (password.match(/[a-z]/g) || []).length >= 2;
  const hasMultipleDigits = (password.match(/\d/g) || []).length >= 2;
  const hasMultipleSpecial = (password.match(/[^A-Za-z0-9]/g) || []).length >= 2;

  if (hasMultipleUpper) score += 5;
  if (hasMultipleLower) score += 5;
  if (hasMultipleDigits) score += 5;
  if (hasMultipleSpecial) score += 5;

  // No repeating characters
  if (!/(.)\1{2,}/.test(password)) score += 10;

  return Math.min(100, score);
};

/**
 * Get password strength label
 */
const getStrengthLabel = (score) => {
  if (score < 40) return 'Weak';
  if (score < 60) return 'Fair';
  if (score < 80) return 'Good';
  return 'Strong';
};

module.exports = {
  validatePassword,
  calculateStrength,
  getStrengthLabel
};
