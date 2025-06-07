# Open Road Market - Firebase Form Integration

This project integrates Firebase Firestore with the Open Road Market website to collect and store form submissions from vehicle and property enquiry forms.

## Features Added

1. **Firebase Integration**: All form submissions are now stored in Firestore database
2. **Enquiry Forms**: Both vehicle and property modals now have complete enquiry forms
3. **Success Notifications**: Users receive visual feedback when forms are submitted
4. **Excel Export**: Tools to export form submissions to CSV/Excel files
5. **Security**: Secure storage of customer data in Firebase

## How It Works

1. When a user clicks "Buy Now" on a vehicle or property card, the appropriate modal opens
2. The user fills out the enquiry form with their details
3. On submission, the data is securely stored in Firebase Firestore
4. The website owner can access this data in the Firebase console or export it to Excel

## Files Modified/Added

### Modified:
- `js/firebase-form-handler.js` - Updated with proper Firebase configuration
- `css/firebase-styles.css` - Styles for form notifications and modals

### Added:
- `firestore-to-excel.js` - Tool to export Firestore data to CSV/Excel
- `export-to-excel.bat` - Windows batch file to run the export tool
- `EXCEL-EXPORT-GUIDE.md` - Documentation on exporting data to Excel
- `firebase-export-function.js` - Cloud Function for automatic export to Google Sheets

## Setup Instructions

1. The Firebase configuration is already set up with your provided details
2. To view form submissions:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your "Open Road Market" project
   - Go to Firestore Database
   - Look for the "enquiries" collection

3. To export data to Excel:
   - See the `EXCEL-EXPORT-GUIDE.md` file for detailed instructions

## Further Customization

You can customize the following aspects:
- Form fields in the modal HTML
- Notification styles in firebase-styles.css
- Data structure in firebase-form-handler.js
- Export format in firestore-to-excel.js
