// Firebase Cloud Function to export data to Google Sheets
// This file should be deployed as a Cloud Function in Firebase

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');

admin.initializeApp();

// This function runs daily to export data to Google Sheets
exports.exportEnquiriesToSheets = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  try {
    // Set up Google Sheets API with service account
    const auth = new google.auth.GoogleAuth({
      keyFile: './service-account.json', // Your service account key file
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheet ID
    
    // Get enquiries from Firestore (last 24 hours)
    const snapshot = await admin.firestore().collection('enquiries')
      .where('timestamp', '>', new Date(Date.now() - 24 * 60 * 60 * 1000))
      .get();
    
    if (snapshot.empty) {
      console.log('No new enquiries to export');
      return null;
    }
    
    // Prepare data for sheets
    const vehicleEnquiries = [];
    const propertyEnquiries = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Format date
      const timestamp = data.timestamp ? new Date(data.timestamp.toDate()).toISOString() : new Date().toISOString();
      
      if (data.type === 'vehicle') {
        vehicleEnquiries.push([
          timestamp,
          data.vehicleId || '',
          data.vehicleName || '',
          data.name || '',
          data.email || '',
          data.phone || '',
          data.message || '',
          data.financing || '',
          data.testDrive || ''
        ]);
      } else if (data.type === 'property') {
        propertyEnquiries.push([
          timestamp,
          data.propertyId || '',
          data.propertyName || '',
          data.name || '',
          data.email || '',
          data.phone || '',
          data.message || '',
          data.financing || '',
          data.visitRequest || ''
        ]);
      }
    });
    
    // Update vehicle sheet
    if (vehicleEnquiries.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Vehicle Enquiries',
        valueInputOption: 'RAW',
        resource: {
          values: vehicleEnquiries
        }
      });
      console.log(`Exported ${vehicleEnquiries.length} vehicle enquiries`);
    }
    
    // Update property sheet
    if (propertyEnquiries.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Property Enquiries',
        valueInputOption: 'RAW',
        resource: {
          values: propertyEnquiries
        }
      });
      console.log(`Exported ${propertyEnquiries.length} property enquiries`);
    }
    
    return null;
  } catch (error) {
    console.error('Error exporting to sheets:', error);
    return null;
  }
});

// This function can be triggered manually via HTTP request
exports.manualExportToSheets = functions.https.onRequest(async (req, res) => {
  try {
    // Check authorization (add your own auth mechanism)
    const authHeader = req.get('Authorization');
    if (!authHeader || authHeader !== 'Bearer YOUR_SECRET_KEY') {
      res.status(403).send('Unauthorized');
      return;
    }
    
    // Set up Google Sheets API
    const auth = new google.auth.GoogleAuth({
      keyFile: './service-account.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';
    
    // Get date range from query params or use defaults
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    
    // Get enquiries from Firestore within date range
    const snapshot = await admin.firestore().collection('enquiries')
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate)
      .get();
    
    if (snapshot.empty) {
      res.status(200).send('No enquiries found in the specified date range');
      return;
    }
    
    // Prepare data for sheets
    const vehicleEnquiries = [];
    const propertyEnquiries = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Format date
      const timestamp = data.timestamp ? new Date(data.timestamp.toDate()).toISOString() : new Date().toISOString();
      
      if (data.type === 'vehicle') {
        vehicleEnquiries.push([
          timestamp,
          data.vehicleId || '',
          data.vehicleName || '',
          data.name || '',
          data.email || '',
          data.phone || '',
          data.message || '',
          data.financing || '',
          data.testDrive || ''
        ]);
      } else if (data.type === 'property') {
        propertyEnquiries.push([
          timestamp,
          data.propertyId || '',
          data.propertyName || '',
          data.name || '',
          data.email || '',
          data.phone || '',
          data.message || '',
          data.financing || '',
          data.visitRequest || ''
        ]);
      }
    });
    
    // Update Google Sheets
    let exportCount = 0;
    
    if (vehicleEnquiries.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Vehicle Enquiries',
        valueInputOption: 'RAW',
        resource: {
          values: vehicleEnquiries
        }
      });
      exportCount += vehicleEnquiries.length;
    }
    
    if (propertyEnquiries.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Property Enquiries',
        valueInputOption: 'RAW',
        resource: {
          values: propertyEnquiries
        }
      });
      exportCount += propertyEnquiries.length;
    }
    
    res.status(200).send(`Successfully exported ${exportCount} enquiries to Google Sheets`);
  } catch (error) {
    console.error('Error exporting to sheets:', error);
    res.status(500).send(`Error exporting to sheets: ${error.message}`);
  }
});
