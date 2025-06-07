// Google Sheets Integration Handler
// This file handles sending form data to Google Sheets via Google Apps Script

const GoogleSheetsHandler = {
    // Google Apps Script Web App URL - Replace with your actual deployed URL
    scriptUrl: 'https://script.google.com/macros/s/AKfycbxpxLvUjUy7xmz5i_5H-VCnNsAafUMTsKGaTEBraqZBwvKrrVuJ61znufD3nCegEJKY/exec',
    
    // Initialize the handler
    init: function() {
        console.log('Google Sheets Handler initialized');
        
        // Set up the script URL from environment or config
        this.setScriptUrl();
    },
    
    // Set the Google Apps Script URL (can be configured via environment variable or config)
    setScriptUrl: function() {
        // You can set this via a config file or environment variable
        // For now, it will need to be manually updated after deploying the Apps Script
        
        // Check if there's a config object with the script URL
        if (window.GOOGLE_SHEETS_CONFIG && window.GOOGLE_SHEETS_CONFIG.scriptUrl) {
            this.scriptUrl = window.GOOGLE_SHEETS_CONFIG.scriptUrl;
        }
        
        console.log('Google Sheets Script URL:', this.scriptUrl);
    },
      // Generic method to send data to Google Sheets
    sendToSheets: function(data, formType) {
        return new Promise((resolve, reject) => {
            // Prepare the payload in the format expected by Apps Script
            const payload = {
                formType: formType,
                ...data
            };
            
            console.log('Sending to Google Sheets:', payload);
            
            // Send data to Google Apps Script
            fetch(this.scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                console.log('Google Sheets response received:', response);
                // Note: With Apps Script, we can't read response due to CORS
                // But if no error is thrown, it means the request was sent successfully
                resolve({ success: true, message: 'Data sent to Google Sheets' });
            })
            .catch(error => {
                console.error('Error sending to Google Sheets:', error);
                reject(error);
            });
        });
    },
      // Send vehicle enquiry data
    sendVehicleEnquiry: function(formData) {
        const sheetData = {
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            vehicleMake: formData.vehicleMake || '',
            vehicleModel: formData.vehicleModel || '',
            vehicleYear: formData.vehicleYear || '',
            vehiclePrice: formData.vehiclePrice || '',
            financingRequired: formData.financing || 'Not specified',
            testDriveInterest: formData.testDrive || 'Not specified',
            additionalComments: formData.message || '',
            vehicleId: formData.vehicleId || '',
            urgencyLevel: 'Medium'
        };
        
        return this.sendToSheets(sheetData, 'vehicleEnquiry');
    },
      // Send property enquiry data
    sendPropertyEnquiry: function(formData) {
        const sheetData = {
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            propertyType: formData.propertyType || '',
            propertyLocation: formData.propertyLocation || '',
            propertyPrice: formData.propertyPrice || '',
            bedrooms: formData.bedrooms || '',
            bathrooms: formData.bathrooms || '',
            financingRequired: formData.financing || 'Not specified',
            visitRequest: formData.visitRequest || 'Not specified',
            additionalComments: formData.message || '',
            propertyId: formData.propertyId || ''
        };
        
        return this.sendToSheets(sheetData, 'propertyEnquiry');
    },
      // Send test drive booking data
    sendTestDriveBooking: function(formData) {
        const sheetData = {
            customerName: formData['customer-name'] || formData.name,
            email: formData['customer-email'] || formData.email,
            phone: formData['customer-phone'] || formData.phone,
            vehicleMake: formData.vehicleMake || '',
            vehicleModel: formData.vehicleModel || '',
            vehicleYear: formData.vehicleYear || '',
            preferredDate: formData['preferred-date'] || '',
            preferredTime: formData['preferred-time'] || '',
            driverLicenseNumber: formData['driving-license'] || formData['id-number'] || '',
            additionalComments: formData.comments || formData.message || ''
        };
        
        return this.sendToSheets(sheetData, 'testDriveBooking');
    },
      // Send import tracking request
    sendImportTracking: function(formData) {
        const sheetData = {
            customerName: formData.name || '',
            email: formData['customer-email-tracking'] || formData.email || '',
            phone: formData.phone || '',
            trackingNumber: formData['tracking-number'] || '',
            importType: formData.importType || '',
            itemDescription: formData.description || '',
            additionalComments: formData.message || ''
        };
        
        return this.sendToSheets(sheetData, 'importTracking');
    },
      // Send vehicle sell listing data
    sendVehicleSell: function(formData) {
        const sheetData = {
            ownerName: formData.sellerName || formData.name || '',
            email: formData.sellerEmail || formData.email || '',
            phone: formData.sellerPhone || formData.phone || '',
            vehicleMake: formData.vehicleMake || '',
            vehicleModel: formData.vehicleModel || '',
            vehicleYear: formData.vehicleYear || '',
            mileage: formData.mileage || '',
            condition: formData.condition || '',
            askingPrice: formData.price || '',
            vehicleDescription: formData.description || '',
            additionalComments: formData.message || ''
        };
        
        return this.sendToSheets(sheetData, 'vehicleSell');
    },
    
    // Send property sell listing data
    sendPropertySell: function(formData) {
        const sheetData = {
            ownerName: formData.sellerName || formData.name || '',
            email: formData.sellerEmail || formData.email || '',
            phone: formData.sellerPhone || formData.phone || '',
            propertyType: formData.propertyType || '',
            propertyLocation: formData.location || '',
            propertySize: formData.area || '',
            bedrooms: formData.bedrooms || '',
            bathrooms: formData.bathrooms || '',
            askingPrice: formData.price || '',
            propertyDescription: formData.description || '',
            additionalComments: formData.message || ''
        };
        
        return this.sendToSheets(sheetData, 'propertySell');
    },

    // Send vehicle listing data (legacy method)
    sendVehicleListing: function(formData) {
        // Route to the new method
        return this.sendVehicleSell(formData);
    },
    
    // Send property listing data (legacy method)
    sendPropertyListing: function(formData) {
        // Route to the new method
        return this.sendPropertySell(formData);
    },
    
    // Send newsletter subscription
    sendNewsletterSubscription: function(email) {
        const sheetData = {
            type: 'Newsletter Subscription',
            email: email,
            page: document.title,
            url: window.location.href
        };
        
        return this.sendToSheets(sheetData, 'Newsletter_Subscriptions');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    GoogleSheetsHandler.init();
});

// Export for use in other modules
window.GoogleSheetsHandler = GoogleSheetsHandler;
