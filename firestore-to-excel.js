// Firestore Data Export Tool
// This script can be run locally to export data from Firestore to CSV/Excel

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

// Initialize Firebase Admin SDK with your service account credentials
// Download this file from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('./path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const enquiriesCollection = db.collection('enquiries');

// Function to fetch all enquiries
async function fetchEnquiries() {
  try {
    // Query to get all enquiries
    const snapshot = await enquiriesCollection.get();
    
    if (snapshot.empty) {
      console.log('No enquiries found in the database.');
      return { vehicleEnquiries: [], propertyEnquiries: [] };
    }
    
    const vehicleEnquiries = [];
    const propertyEnquiries = [];
    
    // Process each document
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Add document ID
      data.id = doc.id;
      
      // Convert Firestore Timestamp to Date
      if (data.timestamp) {
        data.timestamp = data.timestamp.toDate().toISOString();
      }
      
      // Sort into appropriate array
      if (data.type === 'vehicle') {
        vehicleEnquiries.push(data);
      } else if (data.type === 'property') {
        propertyEnquiries.push(data);
      }
    });
    
    console.log(`Found ${vehicleEnquiries.length} vehicle enquiries`);
    console.log(`Found ${propertyEnquiries.length} property enquiries`);
    
    return { vehicleEnquiries, propertyEnquiries };
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw error;
  }
}

// Function to convert data to CSV and save to file
function saveToCSV(data, filename) {
  try {
    // Define fields for CSV
    const fields = Object.keys(data[0] || {});
    
    // Create CSV parser
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    
    // Ensure output directory exists
    const outputDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    // Write CSV to file
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, csv);
    
    console.log(`CSV file saved successfully: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error saving to CSV:', error);
    throw error;
  }
}

// Main function
async function exportData() {
  try {
    console.log('Starting data export process...');
    
    // Fetch enquiries
    const { vehicleEnquiries, propertyEnquiries } = await fetchEnquiries();
    
    // Save to CSV if there's data
    if (vehicleEnquiries.length > 0) {
      const vehicleFilename = `vehicle_enquiries_${new Date().toISOString().split('T')[0]}.csv`;
      saveToCSV(vehicleEnquiries, vehicleFilename);
    }
    
    if (propertyEnquiries.length > 0) {
      const propertyFilename = `property_enquiries_${new Date().toISOString().split('T')[0]}.csv`;
      saveToCSV(propertyEnquiries, propertyFilename);
    }
    
    console.log('Export process completed successfully.');
    
    // Terminate the application
    process.exit(0);
  } catch (error) {
    console.error('Export process failed:', error);
    process.exit(1);
  }
}

// Run the export
exportData();
