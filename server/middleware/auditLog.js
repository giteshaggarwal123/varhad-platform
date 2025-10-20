const fs = require('fs');
const path = require('path');

/**
 * Audit Logging Middleware
 * Logs sensitive operations for security auditing and compliance
 */

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Sensitive operations that should be audited
const sensitiveOperations = [
  'POST /api/auth/login',
  'POST /api/auth/register',
  'POST /api/clients',
  'PUT /api/clients',
  'DELETE /api/clients',
  'POST /api/prep',
  'POST /api/hiv-tests',
  'DELETE /api/inventory',
  'POST /api/backup',
  'POST /api/users'
];

/**
 * Log audit entry to file
 */
const logAuditEntry = (entry) => {
  const logFile = path.join(logsDir, `audit-${new Date().toISOString().split('T')[0]}.log`);
  const logEntry = JSON.stringify({
    ...entry,
    timestamp: new Date().toISOString()
  }) + '\n';

  fs.appendFileSync(logFile, logEntry, 'utf8');
};

/**
 * Audit logging middleware
 */
const auditLog = (req, res, next) => {
  const operation = `${req.method} ${req.baseUrl}${req.path}`;

  // Check if this is a sensitive operation
  const isSensitive = sensitiveOperations.some(op =>
    operation.includes(op.split(' ')[1])
  );

  if (isSensitive) {
    // Capture original res.json to log response
    const originalJson = res.json;

    res.json = function(data) {
      // Log the audit entry
      logAuditEntry({
        operation,
        method: req.method,
        path: req.path,
        user: req.user ? {
          id: req.user._id,
          username: req.user.username,
          role: req.user.role
        } : 'unauthenticated',
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        success: data.success,
        // Don't log sensitive request body data
        bodyFields: Object.keys(req.body || {}),
        query: req.query
      });

      // Call original json method
      return originalJson.call(this, data);
    };
  }

  next();
};

/**
 * Get audit logs for a specific date
 */
const getAuditLogs = (date) => {
  const logFile = path.join(logsDir, `audit-${date}.log`);

  if (!fs.existsSync(logFile)) {
    return [];
  }

  const logs = fs.readFileSync(logFile, 'utf8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));

  return logs;
};

/**
 * Clean old audit logs (retention policy)
 */
const cleanOldLogs = (retentionDays = 90) => {
  const files = fs.readdirSync(logsDir);
  const now = Date.now();

  files.forEach(file => {
    if (file.startsWith('audit-')) {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

      if (fileAge > retentionDays) {
        fs.unlinkSync(filePath);
        console.log(`[AUDIT] Deleted old log file: ${file}`.yellow);
      }
    }
  });
};

module.exports = {
  auditLog,
  getAuditLogs,
  cleanOldLogs
};
