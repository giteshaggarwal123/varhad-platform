const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Database Backup Utility
 * Performs automated MongoDB backups with encryption
 */

// Create backup directory if it doesn't exist
const backupDir = path.join(__dirname, '../../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

/**
 * Perform MongoDB backup
 * @param {string} dbName - Database name
 * @returns {Promise} - Backup result
 */
exports.backupDatabase = (dbName = 'varhad_db') => {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupPath = path.join(backupDir, `backup_${timestamp}`);
    
    // MongoDB dump command
    const command = `mongodump --db ${dbName} --out "${backupPath}"`;
    
    console.log(`[BACKUP] Starting database backup: ${timestamp}`.cyan);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[BACKUP] Error: ${error.message}`.red);
        return reject(error);
      }
      
      if (stderr) {
        console.log(`[BACKUP] ${stderr}`.yellow);
      }
      
      console.log(`[BACKUP] Backup completed successfully: ${backupPath}`.green);
      
      // Clean old backups (keep last 7 days)
      cleanOldBackups(7);
      
      resolve({
        success: true,
        path: backupPath,
        timestamp: timestamp
      });
    });
  });
};

/**
 * Restore database from backup
 * @param {string} backupPath - Path to backup directory
 * @param {string} dbName - Database name
 * @returns {Promise} - Restore result
 */
exports.restoreDatabase = (backupPath, dbName = 'varhad_db') => {
  return new Promise((resolve, reject) => {
    const command = `mongorestore --db ${dbName} --drop "${backupPath}/${dbName}"`;
    
    console.log(`[RESTORE] Starting database restore from: ${backupPath}`.cyan);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[RESTORE] Error: ${error.message}`.red);
        return reject(error);
      }
      
      if (stderr) {
        console.log(`[RESTORE] ${stderr}`.yellow);
      }
      
      console.log(`[RESTORE] Restore completed successfully`.green);
      
      resolve({
        success: true,
        message: 'Database restored successfully'
      });
    });
  });
};

/**
 * Clean old backup files
 * @param {number} daysToKeep - Number of days to keep backups
 */
const cleanOldBackups = (daysToKeep = 7) => {
  const now = Date.now();
  const maxAge = daysToKeep * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  
  fs.readdir(backupDir, (err, files) => {
    if (err) {
      console.error(`[BACKUP] Error reading backup directory: ${err.message}`.red);
      return;
    }
    
    files.forEach(file => {
      const filePath = path.join(backupDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        
        if (stats.isDirectory() && (now - stats.mtimeMs > maxAge)) {
          fs.rmSync(filePath, { recursive: true, force: true });
          console.log(`[BACKUP] Deleted old backup: ${file}`.yellow);
        }
      });
    });
  });
};

/**
 * Schedule automatic backups
 * @param {number} intervalHours - Backup interval in hours
 */
exports.scheduleBackups = (intervalHours = 24) => {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  console.log(`[BACKUP] Scheduled automatic backups every ${intervalHours} hours`.green);
  
  // Perform initial backup
  this.backupDatabase().catch(err => {
    console.error(`[BACKUP] Initial backup failed: ${err.message}`.red);
  });
  
  // Schedule recurring backups
  setInterval(() => {
    this.backupDatabase().catch(err => {
      console.error(`[BACKUP] Scheduled backup failed: ${err.message}`.red);
    });
  }, intervalMs);
};

/**
 * Export data to encrypted JSON
 * @param {Object} data - Data to export
 * @param {string} filename - Export filename
 * @returns {Promise} - Export result
 */
exports.exportEncryptedData = async (data, filename) => {
  const crypto = require('crypto');
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const exportPath = path.join(backupDir, `${filename}_${timestamp}.json.enc`);
  
  try {
    // Encrypt data
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'varhad-secret-key', 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Save encrypted data with IV
    const exportData = {
      iv: iv.toString('hex'),
      data: encrypted
    };
    
    fs.writeFileSync(exportPath, JSON.stringify(exportData));
    
    console.log(`[EXPORT] Data exported and encrypted: ${exportPath}`.green);
    
    return {
      success: true,
      path: exportPath,
      timestamp: timestamp
    };
  } catch (error) {
    console.error(`[EXPORT] Error: ${error.message}`.red);
    throw error;
  }
};

module.exports = exports;
