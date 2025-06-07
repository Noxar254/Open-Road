/**
 * Open Road Market - Google Apps Script Web App
 * Complete Server-Side Form Handler for Google Sheets Integration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace all code with this script
 * 4. Save the project (name it "Open Road Form Handler")
 * 5. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the web app URL and update it in your website's google-sheets-handler.js
 * 
 * This script will automatically create Google Sheets and organize form submissions
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

// Leave this empty to auto-create a new spreadsheet, or put your Sheet ID here
const SHEET_ID = ''; // Optional: Replace with your Google Sheet ID if you want to use existing sheet

// Sheet names for different form types
const SHEET_NAMES = {
  vehicleEnquiry: 'Vehicle Enquiries',
  propertyEnquiry: 'Property Enquiries', 
  testDriveBooking: 'Test Drive Bookings',
  vehicleSell: 'Vehicle Sell Listings',
  propertySell: 'Property Sell Listings',
  importTracking: 'Import Tracking',
  generalContact: 'General Contact Forms'
};

// =============================================================================
// MAIN HANDLER FUNCTIONS
// =============================================================================

/**
 * Main POST request handler - Entry point for all form submissions
 */
function doPost(e) {
  try {
    // Log incoming request for debugging
    console.log('Received POST request:', e.postData.contents);
    
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    const formType = data.formType;
    
    // Remove formType from data before writing to sheet
    delete data.formType;
    
    // Add timestamp to all submissions
    data.timestamp = new Date();
    data.submissionDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    data.submissionTime = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'HH:mm:ss');
    
    // Route to appropriate handler based on form type
    let result;
    switch (formType) {
      case 'vehicleEnquiry':
        result = handleVehicleEnquiry(data);
        break;
      case 'propertyEnquiry':
        result = handlePropertyEnquiry(data);
        break;
      case 'testDriveBooking':
        result = handleTestDriveBooking(data);
        break;
      case 'vehicleSell':
        result = handleVehicleSell(data);
        break;
      case 'propertySell':
        result = handlePropertySell(data);
        break;
      case 'importTracking':
        result = handleImportTracking(data);
        break;
      case 'generalContact':
        result = handleGeneralContact(data);
        break;
      default:
        throw new Error('Unknown form type: ' + formType);
    }
    
    console.log('Form submission processed successfully:', formType);
    return result;
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing and verification)
 */
function doGet(e) {
  const html = `
    <html>
      <head><title>Open Road Market Form Handler</title></head>
      <body>
        <h1>Open Road Market - Form Handler Status</h1>
        <p><strong>Status:</strong> ✅ Active and Running</p>
        <p><strong>Last Updated:</strong> ${new Date().toISOString()}</p>
        <p><strong>Purpose:</strong> Receives form submissions from website and saves to Google Sheets</p>
        <p><strong>Supported Form Types:</strong></p>
        <ul>
          <li>Vehicle Enquiries</li>
          <li>Property Enquiries</li>
          <li>Test Drive Bookings</li>
          <li>Vehicle Sell Listings</li>
          <li>Property Sell Listings</li>
          <li>Import Tracking</li>
          <li>General Contact Forms</li>
        </ul>
        <p><em>This service accepts POST requests with JSON data.</em></p>
      </body>
    </html>
  `;
  
  return HtmlService.createHtmlOutput(html);
}

// =============================================================================
// FORM TYPE HANDLERS
// =============================================================================

/**
 * Handle vehicle enquiry form submissions
 */
function handleVehicleEnquiry(data) {
  const headers = [
    'Submission Date', 'Submission Time', 'Customer Name', 'Email', 'Phone', 
    'Vehicle Make', 'Vehicle Model', 'Vehicle Year', 'Vehicle Price', 
    'Financing Required', 'Down Payment', 'Monthly Budget', 'Trade-in Vehicle', 
    'Test Drive Interest', 'Additional Comments', 'Urgency Level', 'Vehicle ID'
  ];
  
  const rowData = [
    data.submissionDate || '',
    data.submissionTime || '',
    data.customerName || data.name || '',
    data.email || '',
    data.phone || '',
    data.vehicleMake || extractFromMessage(data.message, 'make') || '',
    data.vehicleModel || extractFromMessage(data.message, 'model') || '',
    data.vehicleYear || extractFromMessage(data.message, 'year') || '',
    data.vehiclePrice || extractFromMessage(data.message, 'price') || '',
    data.financingRequired || data.financing || 'Not specified',
    data.downPayment || '',
    data.monthlyBudget || '',
    data.tradeInVehicle || '',
    data.testDriveInterest || data.testDrive || 'Not specified',
    data.additionalComments || data.message || '',
    data.urgencyLevel || 'Medium',
    data.vehicleId || ''
  ];
  
  return writeToSheet(SHEET_NAMES.vehicleEnquiry, headers, rowData);
}

/**
 * Handle property enquiry form submissions
 */
function handlePropertyEnquiry(data) {
  const headers = [
    'Submission Date', 'Submission Time', 'Customer Name', 'Email', 'Phone',
    'Property Type', 'Property Location', 'Property Price', 'Bedrooms', 'Bathrooms',
    'Square Footage', 'Financing Required', 'Down Payment', 'Monthly Budget',
    'Viewing Date Preference', 'Visit Request', 'Additional Comments', 'Property ID'
  ];
  
  const rowData = [
    data.submissionDate || '',
    data.submissionTime || '',
    data.customerName || data.name || '',
    data.email || '',
    data.phone || '',
    data.propertyType || extractFromMessage(data.message, 'type') || '',
    data.propertyLocation || extractFromMessage(data.message, 'location') || '',
    data.propertyPrice || extractFromMessage(data.message, 'price') || '',
    data.bedrooms || extractFromMessage(data.message, 'bedroom') || '',
    data.bathrooms || extractFromMessage(data.message, 'bathroom') || '',
    data.squareFootage || data.propertySize || '',
    data.financingRequired || data.financing || 'Not specified',
    data.downPayment || '',
    data.monthlyBudget || '',
    data.viewingDatePreference || '',
    data.visitRequest || 'Not specified',
    data.additionalComments || data.message || '',
    data.propertyId || ''
  ];
  
  return writeToSheet(SHEET_NAMES.propertyEnquiry, headers, rowData);
}

/**
 * Handle test drive booking form submissions
 */
function handleTestDriveBooking(data) {
  const headers = [
    'Submission Date', 'Submission Time', 'Customer Name', 'Email', 'Phone',
    'Vehicle Make', 'Vehicle Model', 'Vehicle Year', 'Preferred Date', 'Preferred Time',
    'Driver License Number', 'Emergency Contact', 'Additional Comments'
  ];
  
  const rowData = [
    data.submissionDate || '',
    data.submissionTime || '',
    data.customerName || data.name || '',
    data.email || '',
    data.phone || '',
    data.vehicleMake || '',
    data.vehicleModel || '',
    data.vehicleYear || '',
    data.preferredDate || '',
    data.preferredTime || '',
    data.driverLicenseNumber || data.licenseNumber || '',
    data.emergencyContact || '',
    data.additionalComments || data.message || ''
  ];
  
  return writeToSheet(SHEET_NAMES.testDriveBooking, headers, rowData);
}

/**
 * Handle vehicle sell form submissions
 */
function handleVehicleSell(data) {
  const headers = [
    'Submission Date', 'Submission Time', 'Owner Name', 'Email', 'Phone',
    'Vehicle Make', 'Vehicle Model', 'Vehicle Year', 'Mileage', 'Condition',
    'Asking Price', 'Vehicle Description', 'Vehicle History', 'Service Records',
    'Additional Comments', 'Photos Uploaded'
  ];
  
  const rowData = [
    data.submissionDate || '',
    data.submissionTime || '',
    data.ownerName || data.name || '',
    data.email || '',
    data.phone || '',
    data.vehicleMake || '',
    data.vehicleModel || '',
    data.vehicleYear || '',
    data.mileage || '',
    data.condition || '',
    data.askingPrice || '',
    data.vehicleDescription || data.description || '',
    data.vehicleHistory || '',
    data.serviceRecords || '',
    data.additionalComments || data.message || '',
    data.photosUploaded || 'No'
  ];
  
  return writeToSheet(SHEET_NAMES.vehicleSell, headers, rowData);
}

/**
 * Handle property sell form submissions
 */
function handlePropertySell(data) {
  const headers = [
    'Submission Date', 'Submission Time', 'Owner Name', 'Email', 'Phone',
    'Property Type', 'Property Location', 'Property Size', 'Bedrooms', 'Bathrooms',
    'Asking Price', 'Property Description', 'Property Features', 'Year Built',
    'Additional Comments', 'Photos Uploaded'
  ];
  
  const rowData = [
    data.submissionDate || '',
    data.submissionTime || '',
    data.ownerName || data.name || '',
    data.email || '',
    data.phone || '',
    data.propertyType || '',
    data.propertyLocation || '',
    data.propertySize || '',
    data.bedrooms || '',
    data.bathrooms || '',
    data.askingPrice || '',
    data.propertyDescription || data.description || '',
    data.propertyFeatures || '',
    data.yearBuilt || '',
    data.additionalComments || data.message || '',
    data.photosUploaded || 'No'
  ];
  
  return writeToSheet(SHEET_NAMES.propertySell, headers, rowData);
}

/**
 * Handle import tracking form submissions
 */
function handleImportTracking(data) {
  const headers = [
    'Submission Date', 'Submission Time', 'Customer Name', 'Email', 'Phone',
    'Import Type', 'Item Description', 'Country of Origin', 'Estimated Value',
    'Tracking Number', 'Shipping Company', 'Expected Arrival', 'Additional Comments'
  ];
  
  const rowData = [
    data.submissionDate || '',
    data.submissionTime || '',
    data.customerName || data.name || '',
    data.email || '',
    data.phone || '',
    data.importType || '',
    data.itemDescription || '',
    data.countryOfOrigin || '',
    data.estimatedValue || '',
    data.trackingNumber || '',
    data.shippingCompany || '',
    data.expectedArrival || '',
    data.additionalComments || data.message || ''
  ];
  
  return writeToSheet(SHEET_NAMES.importTracking, headers, rowData);
}

/**
 * Handle general contact form submissions
 */
function handleGeneralContact(data) {
  const headers = [
    'Submission Date', 'Submission Time', 'Name', 'Email', 'Phone',
    'Subject', 'Message', 'Inquiry Type', 'Follow-up Required'
  ];
  
  const rowData = [
    data.submissionDate || '',
    data.submissionTime || '',
    data.name || '',
    data.email || '',
    data.phone || '',
    data.subject || '',
    data.message || '',
    data.inquiryType || 'General',
    data.followUpRequired || 'Yes'
  ];
  
  return writeToSheet(SHEET_NAMES.generalContact, headers, rowData);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Write data to Google Sheet (creates sheet if it doesn't exist)
 */
function writeToSheet(sheetName, headers, rowData) {
  try {
    let spreadsheet;
    
    // Get or create spreadsheet
    if (SHEET_ID && SHEET_ID !== '') {
      try {
        spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      } catch (error) {
        console.log('Could not open specified sheet, creating new one');
        spreadsheet = createNewSpreadsheet();
      }
    } else {
      spreadsheet = getOrCreateSpreadsheet();
    }
    
    // Get or create the specific sheet
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      setupSheetHeaders(sheet, headers);
    } else {
      // Verify headers exist
      const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
      if (existingHeaders.every(header => header === '')) {
        setupSheetHeaders(sheet, headers);
      }
    }
    
    // Add the new row
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, headers.length);
    
    // Add conditional formatting for better visibility
    formatSheet(sheet, headers.length);
    
    console.log(`Data successfully written to sheet: ${sheetName}`);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: `Data successfully saved to ${sheetName}`,
        sheetUrl: spreadsheet.getUrl(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error writing to sheet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Failed to save data to Google Sheets: ' + error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get existing spreadsheet or create new one
 */
function getOrCreateSpreadsheet() {
  const files = DriveApp.getFilesByName('Open Road Market - Form Submissions');
  
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  } else {
    return createNewSpreadsheet();
  }
}

/**
 * Create a new spreadsheet
 */
function createNewSpreadsheet() {
  const spreadsheet = SpreadsheetApp.create('Open Road Market - Form Submissions');
  
  // Create a welcome sheet with instructions first
  const welcomeSheet = spreadsheet.insertSheet('README');
  welcomeSheet.getRange('A1').setValue('Open Road Market - Form Submissions');
  welcomeSheet.getRange('A2').setValue('This spreadsheet automatically collects form submissions from your website.');
  
  // Now delete the default sheet (after creating the new one)
  const defaultSheet = spreadsheet.getSheetByName('Sheet1');
  if (defaultSheet) {
    spreadsheet.deleteSheet(defaultSheet);
  }  
  welcomeSheet.getRange('A3').setValue('Each form type gets its own sheet tab.');
  welcomeSheet.getRange('A4').setValue('Created: ' + new Date().toISOString());
  
  welcomeSheet.getRange('A1:A4').setFontWeight('bold');
  welcomeSheet.autoResizeColumns(1, 1);
  
  console.log('Created new spreadsheet: Open Road Market - Form Submissions');
  return spreadsheet;
}

/**
 * Set up sheet headers with formatting
 */
function setupSheetHeaders(sheet, headers) {
  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setBorder(true, true, true, true, true, true);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Apply formatting to sheet for better readability
 */
function formatSheet(sheet, numColumns) {
  try {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      // Alternate row colors
      const dataRange = sheet.getRange(2, 1, lastRow - 1, numColumns);
      
      // Apply banded rows
      dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
      
      // Set borders
      dataRange.setBorder(false, false, false, false, true, false);
    }
  } catch (error) {
    console.log('Could not apply formatting:', error);
  }
}

/**
 * Extract information from message text (helper function)
 */
function extractFromMessage(message, keyword) {
  if (!message || typeof message !== 'string') return '';
  
  const lowerMessage = message.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  // Simple extraction patterns
  const patterns = {
    'make': /(?:make|brand)[:\s]*([\w\s]+)/i,
    'model': /(?:model)[:\s]*([\w\s]+)/i,
    'year': /(?:year)[:\s]*(\d{4})/i,
    'price': /(?:price|cost)[:\s]*(?:kes|ksh)?\s*([\d,]+)/i,
    'type': /(?:type|category)[:\s]*([\w\s]+)/i,
    'location': /(?:location|area)[:\s]*([\w\s,]+)/i,
    'bedroom': /(\d+)\s*(?:bed|bedroom)/i,
    'bathroom': /(\d+)\s*(?:bath|bathroom)/i
  };
  
  const pattern = patterns[lowerKeyword];
  if (pattern) {
    const match = message.match(pattern);
    return match ? match[1].trim() : '';
  }
  
  return '';
}

// =============================================================================
// TEST FUNCTIONS
// =============================================================================

/**
 * Test function for vehicle enquiry
 */
function testVehicleEnquiry() {
  const testData = {
    formType: 'vehicleEnquiry',
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '+254700123456',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    vehicleYear: '2020',
    vehiclePrice: 'KES 2,500,000',
    financing: 'interested',
    testDrive: 'yes',
    message: 'I am interested in this Toyota Camry 2020'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  return doPost(mockEvent);
}

/**
 * Test function for property enquiry
 */
function testPropertyEnquiry() {
  const testData = {
    formType: 'propertyEnquiry',
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+254700987654',
    propertyType: 'House',
    propertyLocation: 'Nairobi',
    propertyPrice: 'KES 45,000,000',
    bedrooms: '4',
    bathrooms: '3',
    financing: 'interested',
    visitRequest: 'yes',
    message: 'I would like to view this 4-bedroom house in Nairobi'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  return doPost(mockEvent);
}

/**
 * Test all form types
 */
function testAllForms() {
  console.log('Testing Vehicle Enquiry...');
  testVehicleEnquiry();
  
  console.log('Testing Property Enquiry...');
  testPropertyEnquiry();
  
  console.log('All tests completed!');
}

// =============================================================================
// ADMIN FUNCTIONS
// =============================================================================

/**
 * Get spreadsheet URL for admin purposes
 */
function getSpreadsheetUrl() {
  const spreadsheet = getOrCreateSpreadsheet();
  console.log('Spreadsheet URL:', spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

/**
 * Get submission statistics
 */
function getSubmissionStats() {
  try {
    const spreadsheet = getOrCreateSpreadsheet();
    const stats = {};
    
    Object.values(SHEET_NAMES).forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet) {
        const lastRow = sheet.getLastRow();
        stats[sheetName] = lastRow > 1 ? lastRow - 1 : 0; // Subtract header row
      } else {
        stats[sheetName] = 0;
      }
    });
    
    console.log('Submission Statistics:', stats);
    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    return null;
  }
}
