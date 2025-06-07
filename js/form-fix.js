// Fix dropdown options in vehicle and property forms
document.addEventListener('DOMContentLoaded', function() {
    // Fix vehicle form dropdown options
    const vehicleFinancingSelect = document.getElementById('enquiry-financing');
    const vehicleTestDriveSelect = document.getElementById('enquiry-test-drive');
    
    // Only populate if they're empty
    if (vehicleFinancingSelect && vehicleFinancingSelect.options.length === 0) {
        const financingOptions = [
            { value: 'not-interested', text: 'Not Interested' },
            { value: 'interested', text: 'Interested' },
            { value: 'pre-approved', text: 'Already Pre-Approved' }
        ];
        
        financingOptions.forEach(option => {
            vehicleFinancingSelect.add(new Option(option.text, option.value));
        });
    }
    
    if (vehicleTestDriveSelect && vehicleTestDriveSelect.options.length === 0) {
        const testDriveOptions = [
            { value: 'yes', text: 'Yes, I\'d like to schedule a test drive' },
            { value: 'no', text: 'No, not at this time' }
        ];
        
        testDriveOptions.forEach(option => {
            vehicleTestDriveSelect.add(new Option(option.text, option.value));
        });
    }
    
    // Fix property form dropdown options
    const propertyFinancingSelect = document.getElementById('property-enquiry-financing');
    const propertyVisitSelect = document.getElementById('property-enquiry-visit');
    
    if (propertyFinancingSelect && propertyFinancingSelect.options.length === 0) {
        const financingOptions = [
            { value: 'not-interested', text: 'Not Interested' },
            { value: 'interested', text: 'Interested' },
            { value: 'pre-approved', text: 'Already Pre-Approved' }
        ];
        
        financingOptions.forEach(option => {
            propertyFinancingSelect.add(new Option(option.text, option.value));
        });
    }
    
    if (propertyVisitSelect && propertyVisitSelect.options.length === 0) {
        const visitOptions = [
            { value: 'yes', text: 'Yes, I\'d like to schedule a visit' },
            { value: 'no', text: 'No, not at this time' }
        ];
        
        visitOptions.forEach(option => {
            propertyVisitSelect.add(new Option(option.text, option.value));
        });
    }
    
    // Add debug logging for form submission
    const vehicleForm = document.getElementById('vehicle-enquiry-form');
    const propertyForm = document.getElementById('property-enquiry-form');
    
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', function() {
            console.log('Vehicle form submitted - elements:', this.elements);
        }, true);
    }
    
    if (propertyForm) {
        propertyForm.addEventListener('submit', function() {
            console.log('Property form submitted - elements:', this.elements);
        }, true);
    }
});

// Fix Firebase form submission errors
const originalFormHandlerHandlePropertyEnquiry = FormHandler.handlePropertyEnquiry;
FormHandler.handlePropertyEnquiry = function(event) {
    try {
        console.log('Property form submission handler called');
        
        // Call the original handler
        originalFormHandlerHandlePropertyEnquiry.call(this, event);
    } catch (error) {
        console.error('Error in property form submission:', error);
        this.showNotification('Error in form submission: ' + error.message, 'error');
    }
};

// Fix property spec rows that may be empty
document.querySelectorAll('#property-modal .spec-row').forEach(row => {
    const valueSpan = row.querySelector('.spec-value');
    if (valueSpan && (valueSpan.textContent.trim() === '' || valueSpan.textContent.trim() === '-')) {
        // Add a default value if empty
        valueSpan.textContent = 'Information not available';
    }
});

console.log('Form fixes loaded successfully');
