# Google Sheets Integration Setup Guide

## Overview
This document provides complete setup instructions for the Google Sheets integration feature that sends enquiry form data from all modal forms across the website to Google Sheets via Google Apps Script.

## Files Created/Modified

### 1. Created Files
- **`js/google-sheets-handler.js`** - Client-side handler for sending data to Google Sheets
- **`google-apps-script.js`** - Server-side Google Apps Script code (deploy as web app)
- **`GOOGLE_SHEETS_INTEGRATION_SETUP.md`** - This setup guide

### 2. Modified Files
- **`js/firebase-form-handler.js`** - Enhanced with Google Sheets integration for all form handlers
- **`index.html`** - Added Google Sheets handler script tag
- **`vehicles.html`** - Added Google Sheets handler script tag
- **`properties.html`** - Added Google Sheets handler script tag
- **`property-pagination.html`** - Added Google Sheets handler script tag
- **`pagination.html`** - Added Google Sheets handler script tag
- **`booking.html`** - Added Firebase and Google Sheets handler script tags
- **`sell.html`** - Added Google Sheets handler script tag

## Integrated Modal Forms

All the following modal enquiry forms now send data to both Firebase and Google Sheets:

### 1. Vehicle Purchase Enquiry Modals
- **Location**: `index.html`, `vehicles.html`, `pagination.html`
- **Form ID**: `vehicle-enquiry-form`
- **Data Sent**: Customer details + vehicle information (make, model, year, price)

### 2. Property Purchase Enquiry Modals
- **Location**: `index.html`, `properties.html`, `property-pagination.html`
- **Form ID**: `property-enquiry-form`
- **Data Sent**: Customer details + property information (type, location, bedrooms, price)

### 3. Test Drive Booking Form
- **Location**: `booking.html`
- **Form ID**: `test-drive-form`
- **Data Sent**: Customer details + vehicle details + preferred date/time

### 4. Vehicle Sell Form
- **Location**: `sell.html`
- **Form ID**: `vehicle-sell-form`
- **Data Sent**: Seller details + vehicle information + condition/description

### 5. Property Sell Form
- **Location**: `sell.html`
- **Form ID**: `property-sell-form`
- **Data Sent**: Seller details + property information + features/description

### 6. Import Tracking Form
- **Location**: `booking.html`
- **Form ID**: `import-tracking-form`
- **Data Sent**: Customer details + import tracking information

### 7. Gallery "Buy Now" and "Contact Seller" Buttons
- **Location**: All pages with galleries
- **Integration**: Uses existing modal forms for enquiries

## Setup Instructions

### Step 1: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with the content from `google-apps-script.js`
4. Save the project with a meaningful name (e.g., "Open Road Market Form Handler")

### Step 2: Deploy as Web App

1. In Google Apps Script, click **Deploy** → **New deployment**
2. Choose type: **Web app**
3. Set the following configuration:
   - **Execute as**: Me (your account)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Important**: Copy the web app URL (you'll need this for Step 3)

### Step 3: Configure the Web App URL

1. Open `js/google-sheets-handler.js`
2. Find this line:
   ```javascript
   const WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'` with your actual web app URL from Step 2

### Step 4: Configure Google Sheet ID (Optional)

If you want to use a specific Google Sheet:

1. Create a new Google Sheet or use an existing one
2. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
3. In `google-apps-script.js`, find this line:
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your actual Sheet ID
   ```
4. Replace with your actual Sheet ID

**Note**: If you leave this as default, the script will automatically create new sheets for each form type.

### Step 5: Test the Integration

1. Visit any page with modal forms (e.g., `index.html`, `vehicles.html`)
2. Open a modal enquiry form
3. Fill out and submit the form
4. Check your Google Sheets - data should appear automatically
5. Verify both Firebase and Google Sheets receive the data

## How It Works

### Data Flow
1. User submits a form on the website
2. **Primary**: Data is sent to Firebase (existing functionality)
3. **Secondary**: Data is simultaneously sent to Google Sheets via Google Apps Script
4. Google Apps Script receives the data and writes it to the appropriate sheet

### Error Handling
- Google Sheets integration is non-blocking (uses `Promise.allSettled()`)
- If Google Sheets fails, Firebase submission still succeeds
- Console logging for debugging issues
- User experience is not affected by Google Sheets failures

### Sheet Structure
Each form type gets its own sheet with appropriate headers:

- **Vehicle Enquiries**: Customer info + Vehicle details
- **Property Enquiries**: Customer info + Property details  
- **Test Drive Bookings**: Customer info + Vehicle + Date/Time preferences
- **Vehicle Sell**: Seller info + Vehicle details + Condition
- **Property Sell**: Seller info + Property details + Features
- **Import Tracking**: Customer info + Import details

## Security Considerations

- Google Apps Script runs with your permissions
- Web app is set to "Anyone" access but only accepts POST requests
- No sensitive authentication tokens are exposed in client-side code
- Data validation is performed server-side in Google Apps Script

## Troubleshooting

### Common Issues

1. **Forms not sending to Google Sheets**
   - Check if the web app URL is correctly configured
   - Verify the Google Apps Script is deployed and accessible
   - Check browser console for error messages

2. **Google Apps Script errors**
   - Ensure you have Google Sheets API access
   - Check Apps Script execution transcript for detailed errors
   - Verify sheet permissions if using a custom sheet ID

3. **Data not appearing in sheets**
   - Check if sheets are being created automatically
   - Verify the form data structure matches expected format
   - Look for execution errors in Google Apps Script logs

### Debug Mode
Enable debug logging by setting `DEBUG_MODE = true` in `google-sheets-handler.js`

## Maintenance

- Monitor Google Apps Script execution quotas
- Regularly check for failed submissions in Apps Script logs
- Consider archiving old data if sheets become too large
- Update form handlers if new modal forms are added to the website

## Support

For technical issues:
1. Check browser console logs
2. Review Google Apps Script execution transcript
3. Verify all configuration steps were completed correctly
4. Test with a simple form submission to isolate issues
