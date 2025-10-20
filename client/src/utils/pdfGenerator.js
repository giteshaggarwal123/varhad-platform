// PDF Generation utility for PrEP Consent Forms

export const generateConsentPDF = (consentData) => {
  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>PrEP Consent Form - ${consentData.clientId}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #667eea; }
        .section { margin: 20px 0; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #2d3748; }
        .value { color: #4a5568; }
        .signature-box { border: 1px solid #cbd5e0; padding: 20px; margin-top: 30px; }
        .footer { margin-top: 40px; font-size: 12px; color: #718096; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">VARHAD PrEPARED</div>
        <h2>PrEP Initiation Consent Form</h2>
      </div>

      <div class="section">
        <h3>Client Information</h3>
        <div class="field">
          <span class="label">Client ID:</span>
          <span class="value">${consentData.clientId}</span>
        </div>
        <div class="field">
          <span class="label">Client Name:</span>
          <span class="value">${consentData.clientName}</span>
        </div>
        <div class="field">
          <span class="label">Date:</span>
          <span class="value">${consentData.date}</span>
        </div>
      </div>

      <div class="section">
        <h3>Consent Details</h3>
        <div class="field">
          <span class="label">Consent Type:</span>
          <span class="value">${consentData.consentType}</span>
        </div>
        <div class="field">
          <span class="label">Witnessed By:</span>
          <span class="value">${consentData.witnessedBy}</span>
        </div>
      </div>

      <div class="section">
        <h3>Consent Statement</h3>
        <p>I, ${consentData.clientName}, hereby consent to:</p>
        <ul>
          <li>Receive Pre-Exposure Prophylaxis (PrEP) medication</li>
          <li>Regular HIV testing and monitoring</li>
          <li>Follow-up appointments as scheduled</li>
          <li>Share my health information with authorized healthcare providers</li>
        </ul>
        <p>I have been counseled about the risks and benefits of PrEP and all my questions have been answered satisfactorily.</p>
      </div>

      <div class="signature-box">
        <div class="field">
          <span class="label">Client Signature:</span>
          <span class="value">_________________________</span>
        </div>
        <div class="field">
          <span class="label">Date:</span>
          <span class="value">${consentData.date}</span>
        </div>
        <br/>
        <div class="field">
          <span class="label">Witness Signature:</span>
          <span class="value">_________________________</span>
        </div>
        <div class="field">
          <span class="label">Witness Name:</span>
          <span class="value">${consentData.witnessedBy}</span>
        </div>
      </div>

      <div class="footer">
        <p>VARHAD - Voluntary Action for Rehabilitation & Development</p>
        <p>Document generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = function() {
    printWindow.print();
  };
};

export const viewConsentPDF = (consentData) => {
  // Same as generate but doesn't auto-print
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>PrEP Consent Form - ${consentData.clientId}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #667eea; }
        .section { margin: 20px 0; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #2d3748; }
        .value { color: #4a5568; }
        .signature-box { border: 1px solid #cbd5e0; padding: 20px; margin-top: 30px; background: #f7fafc; }
        .footer { margin-top: 40px; font-size: 12px; color: #718096; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        .print-btn { background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin: 20px auto; display: block; }
      </style>
    </head>
    <body>
      <button class="print-btn" onclick="window.print()">Print PDF</button>
      
      <div class="header">
        <div class="logo">VARHAD PrEPARED</div>
        <h2>PrEP Initiation Consent Form</h2>
      </div>

      <div class="section">
        <h3>Client Information</h3>
        <div class="field">
          <span class="label">Client ID:</span>
          <span class="value">${consentData.clientId}</span>
        </div>
        <div class="field">
          <span class="label">Client Name:</span>
          <span class="value">${consentData.clientName}</span>
        </div>
        <div class="field">
          <span class="label">Date:</span>
          <span class="value">${consentData.date}</span>
        </div>
      </div>

      <div class="section">
        <h3>Consent Details</h3>
        <div class="field">
          <span class="label">Consent Type:</span>
          <span class="value">${consentData.consentType}</span>
        </div>
        <div class="field">
          <span class="label">Witnessed By:</span>
          <span class="value">${consentData.witnessedBy}</span>
        </div>
      </div>

      <div class="section">
        <h3>Consent Statement</h3>
        <p>I, <strong>${consentData.clientName}</strong>, hereby consent to:</p>
        <ul>
          <li>Receive Pre-Exposure Prophylaxis (PrEP) medication</li>
          <li>Regular HIV testing and monitoring</li>
          <li>Follow-up appointments as scheduled</li>
          <li>Share my health information with authorized healthcare providers</li>
        </ul>
        <p>I have been counseled about the risks and benefits of PrEP and all my questions have been answered satisfactorily.</p>
      </div>

      <div class="signature-box">
        <div class="field">
          <span class="label">Client Signature:</span>
          <span class="value">_________________________</span>
        </div>
        <div class="field">
          <span class="label">Date:</span>
          <span class="value">${consentData.date}</span>
        </div>
        <br/>
        <div class="field">
          <span class="label">Witness Signature:</span>
          <span class="value">_________________________</span>
        </div>
        <div class="field">
          <span class="label">Witness Name:</span>
          <span class="value">${consentData.witnessedBy}</span>
        </div>
      </div>

      <div class="footer">
        <p><strong>VARHAD - Voluntary Action for Rehabilitation & Development</strong></p>
        <p>Document generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;

  const viewWindow = window.open('', '_blank');
  viewWindow.document.write(htmlContent);
  viewWindow.document.close();
};
