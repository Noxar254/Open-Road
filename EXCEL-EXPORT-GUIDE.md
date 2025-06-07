# Exporting Enquiry Data to Excel

This guide explains how to export your Open Road Market form submission data to Excel.

## Option 1: Using the Export Script (Recommended)

The project includes a script that exports all enquiries from Firebase Firestore to CSV files (which can be opened directly in Excel).

### Prerequisites:

1. Node.js installed on your computer
2. Firebase service account key (JSON file)

### Setup:

1. Download your service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file in the project directory

2. Install required packages:
   ```
   npm install firebase-admin json2csv
   ```

3. Edit the `firestore-to-excel.js` file:
   - Update the path to your service account key file

### Export Data:

1. Run the export script:
   - Double-click the `export-to-excel.bat` file
   OR
   - Run `node firestore-to-excel.js` in your terminal

2. The script will create CSV files in an "exports" folder:
   - `vehicle_enquiries_[DATE].csv` - Vehicle enquiries
   - `property_enquiries_[DATE].csv` - Property enquiries

3. Open these files in Excel or any spreadsheet program

## Option 2: Manual Export from Firebase

You can also export data directly from the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database
4. Click on the "enquiries" collection
5. Click the three dots menu (⋮) at the top
6. Select "Export collection"
7. This will download a JSON file
8. Use an online tool like [https://www.convertcsv.com/json-to-csv.htm](https://www.convertcsv.com/json-to-csv.htm) to convert to CSV/Excel

## Option 3: Google Sheets Integration

For automatic syncing with Google Sheets:

1. Deploy the `firebase-export-function.js` as a Cloud Function in Firebase
2. Create a Google Sheet with two tabs: "Vehicle Enquiries" and "Property Enquiries"
3. Share the sheet with your service account email
4. Update the `spreadsheetId` in the function with your Google Sheet ID
5. The function will run daily and append new enquiries to your sheet
