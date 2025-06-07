/**
 * Google Apps Script Web App for Open Road Form Submissions
 * 
 * This script receives form data from the website and writes it to Google Sheets.
 * Deploy this as a web app with permissions for anyone to access.
 * 
 * Instructions:
 * 1. Open Google Apps Script (script.google.com)
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Set up your Google Sheet ID in the SHEET_ID variable
 * 5. Deploy as web app with execute permissions for "Anyone"
 * 6. Copy the web app URL and update it in google-sheets-handler.js
 */

// Configure your Google Sheet ID here
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your actual Google Sheet ID

// Sheet names for different form types
const SHEET_NAMES = {
  vehicleEnquiry: 'Vehicle Enquiries',
  propertyEnquiry: 'Property Enquiries',
  testDriveBooking: 'Test Drive Bookings',
  vehicleSell: 'Vehicle Listings',
  propertySell: 'Property Listings',
  importTracking: 'Import Tracking',
  generalContact: 'General Contact'
};

/**
 * Main function to handle POST requests from the website
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    const formType = data.formType;
    
    // Remove formType from data before writing to sheet
    delete data.formType;
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    // Route to appropriate handler based on form type
    switch (formType) {
      case 'vehicleEnquiry':
        return handleVehicleEnquiry(data);
      case 'propertyEnquiry':
        return handlePropertyEnquiry(data);
      case 'testDriveBooking':
        return handleTestDriveBooking(data);
      case 'vehicleSell':
        return handleVehicleSell(data);
      case 'propertySell':
        return handlePropertySell(data);
      case 'importTracking':
        return handleImportTracking(data);
      case 'generalContact':
        return handleGeneralContact(data);
      default:
        throw new Error('Unknown form type: ' + formType);
    }
  } catch (error) {
    console.error('Error processing form submission:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle vehicle enquiry submissions
 */
function handleVehicleEnquiry(data) {
  const headers = [
    'Timestamp', 'Customer Name', 'Email', 'Phone', 'Vehicle Make', 'Vehicle Model',
    'Vehicle Year', 'Vehicle Price', 'Financing Required', 'Down Payment',
    'Monthly Budget', 'Trade-in Vehicle', 'Additional Comments', 'Urgency Level'
  ];
  
  const rowData = [
    data.timestamp,
    data.customerName || '',
    data.email || '',
    data.phone || '',
    data.vehicleMake || '',
    data.vehicleModel || '',
    data.vehicleYear || '',
    data.vehiclePrice || '',
    data.financingRequired || 'No',
    data.downPayment || '',
    data.monthlyBudget || '',
    data.tradeInVehicle || '',
    data.additionalComments || '',
    data.urgencyLevel || 'Medium'
  ];
  
  return writeToSheet(SHEET_NAMES.vehicleEnquiry, headers, rowData);
}

/**
 * Handle property enquiry submissions
 */
function handlePropertyEnquiry(data) {
  const headers = [
    'Timestamp', 'Customer Name', 'Email', 'Phone', 'Property Type', 'Property Location',
    'Property Price', 'Bedrooms', 'Bathrooms', 'Square Footage', 'Financing Required',
    'Down Payment', 'Monthly Budget', 'Viewing Date Preference', 'Additional Comments'
  ];
  
  const rowData = [
    data.timestamp,
    data.customerName || '',
    data.email || '',
    data.phone || '',
    data.propertyType || '',
    data.propertyLocation || '',
    data.propertyPrice || '',
    data.bedrooms || '',
    data.bathrooms || '',
    data.squareFootage || '',
    data.financingRequired || 'No',
    data.downPayment || '',
    data.monthlyBudget || '',
    data.viewingDatePreference || '',
    data.additionalComments || ''
  ];
  
  return writeToSheet(SHEET_NAMES.propertyEnquiry, headers, rowData);
}

/**
 * Handle test drive booking submissions
 */
function handleTestDriveBooking(data) {
  const headers = [
    'Timestamp', 'Customer Name', 'Email', 'Phone', 'Vehicle Make', 'Vehicle Model',
    'Preferred Date', 'Preferred Time', 'Driver License Number', 'Additional Comments'
  ];
  
  const rowData = [
    data.timestamp,
    data.customerName || '',
    data.email || '',
    data.phone || '',
    data.vehicleMake || '',
    data.vehicleModel || '',
    data.preferredDate || '',
    data.preferredTime || '',
    data.driverLicenseNumber || '',
    data.additionalComments || ''
  ];
  
  return writeToSheet(SHEET_NAMES.testDriveBooking, headers, rowData);
}

/**
 * Handle vehicle sell form submissions
 */
function handleVehicleSell(data) {
  const headers = [
    'Timestamp', 'Owner Name', 'Email', 'Phone', 'Vehicle Make', 'Vehicle Model',
    'Vehicle Year', 'Mileage', 'Condition', 'Asking Price', 'Vehicle Description',
    'Vehicle History', 'Additional Comments'
  ];
  
  const rowData = [
    data.timestamp,
    data.ownerName || '',
    data.email || '',
    data.phone || '',
    data.vehicleMake || '',
    data.vehicleModel || '',
    data.vehicleYear || '',
    data.mileage || '',
    data.condition || '',
    data.askingPrice || '',
    data.vehicleDescription || '',
    data.vehicleHistory || '',
    data.additionalComments || ''
  ];
  
  return writeToSheet(SHEET_NAMES.vehicleSell, headers, rowData);
}

/**
 * Handle property sell form submissions
 */
function handlePropertySell(data) {
  const headers = [
    'Timestamp', 'Owner Name', 'Email', 'Phone', 'Property Type', 'Property Location',
    'Property Size', 'Bedrooms', 'Bathrooms', 'Asking Price', 'Property Description',
    'Property Features', 'Additional Comments'
  ];
  
  const rowData = [
    data.timestamp,
    data.ownerName || '',
    data.email || '',
    data.phone || '',
    data.propertyType || '',
    data.propertyLocation || '',
    data.propertySize || '',
    data.bedrooms || '',
    data.bathrooms || '',
    data.askingPrice || '',
    data.propertyDescription || '',
    data.propertyFeatures || '',
    data.additionalComments || ''
  ];
  
  return writeToSheet(SHEET_NAMES.propertySell, headers, rowData);
}

/**
 * Handle import tracking form submissions
 */
function handleImportTracking(data) {
  const headers = [
    'Timestamp', 'Customer Name', 'Email', 'Phone', 'Import Type', 'Item Description',
    'Country of Origin', 'Estimated Value', 'Tracking Number', 'Additional Comments'
  ];
  
  const rowData = [
    data.timestamp,
    data.customerName || '',
    data.email || '',
    data.phone || '',
    data.importType || '',
    data.itemDescription || '',
    data.countryOfOrigin || '',
    data.estimatedValue || '',
    data.trackingNumber || '',
    data.additionalComments || ''
  ];
  
  return writeToSheet(SHEET_NAMES.importTracking, headers, rowData);
}

/**
 * Handle general contact form submissions
 */
function handleGeneralContact(data) {
  const headers = [
    'Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message'
  ];
  
  const rowData = [
    data.timestamp,
    data.name || '',
    data.email || '',
    data.phone || '',
    data.subject || '',
    data.message || ''
  ];
  
  return writeToSheet(SHEET_NAMES.generalContact, headers, rowData);
}

/**
 * Write data to Google Sheet
 */
function writeToSheet(sheetName, headers, rowData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      // Add headers
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      // Format headers
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#f0f0f0');
    }
    
    // Check if headers exist, if not add them
    const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (existingHeaders.join('') === '') {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#f0f0f0');
    }
    
    // Add the new row
    sheet.appendRow(rowData);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data successfully saved to Google Sheets'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error writing to sheet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Failed to save data to Google Sheets: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Open Road Form Handler is running. Use POST requests to submit form data.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Test function to verify the script is working
 */
function testScript() {
  const testData = {
    formType: 'vehicleEnquiry',
    customerName: 'Test Customer',
    email: 'test@example.com',
    phone: '+254700000000',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    vehicleYear: '2020',
    vehiclePrice: '2500000',
    financingRequired: 'Yes',
    additionalComments: 'Test submission'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  return doPost(mockEvent);
}
