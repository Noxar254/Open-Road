// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjxz6hzgqeLkNtQFnSTbDkro4dsj2j-Tc",
  authDomain: "open-road-market.firebaseapp.com",
  projectId: "open-road-market",
  storageBucket: "open-road-market.firebasestorage.app",
  messagingSenderId: "6509034099",
  appId: "1:6509034099:web:bf09794b823f4187ffc806",
  measurementId: "G-WWBRN92Y32"
};

// Initialize Firebase with error handling
let db;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Handles all form submissions to Firebase
const FormHandler = {
  // Track submission status to prevent duplicates
  isSubmitting: false,
  // Initialize form event listeners
  init: function() {
    // Vehicle enquiry form
    const vehicleEnquiryForm = document.getElementById('vehicle-enquiry-form');
    if (vehicleEnquiryForm) {
      vehicleEnquiryForm.addEventListener('submit', this.handleVehicleEnquiry.bind(this));
    }
    
    // Property enquiry form
    const propertyEnquiryForm = document.getElementById('property-enquiry-form');
    if (propertyEnquiryForm) {
      propertyEnquiryForm.addEventListener('submit', this.handlePropertyEnquiry.bind(this));
    }

    // Sell forms
    const vehicleSellForm = document.getElementById('vehicle-sell-form');
    if (vehicleSellForm) {
      vehicleSellForm.addEventListener('submit', this.handleVehicleSellForm.bind(this));
    }    const propertySellForm = document.getElementById('property-sell-form');
    if (propertySellForm) {
      propertySellForm.addEventListener('submit', this.handlePropertySellForm.bind(this));
    }

    // Test drive booking form
    const testDriveForm = document.getElementById('test-drive-form');
    if (testDriveForm) {
      testDriveForm.addEventListener('submit', this.handleTestDriveBooking.bind(this));
    }

    // Import tracking form
    const trackingForm = document.getElementById('tracking-form');
    if (trackingForm) {
      trackingForm.addEventListener('submit', this.handleImportTracking.bind(this));
    }

    // Gallery modal buy now button
    const galleryBuyBtn = document.querySelector('.gallery-btn.primary');
    if (galleryBuyBtn) {
      galleryBuyBtn.addEventListener('click', this.handleGalleryBuyNow.bind(this));
    }

    // Set up card buttons
    this.setupCardButtons();
  },

  // Setup Buy Now buttons on cards
  setupCardButtons: function() {
    // Vehicle buy now buttons
    document.querySelectorAll('.card[data-id^="vehicle-"] .btn-buy').forEach(button => {
      button.addEventListener('click', function() {
        const card = this.closest('.card');
        const vehicleId = card.dataset.id;
        const vehicleName = card.querySelector('h3').textContent;
        const vehicleImage = card.querySelector('.card-image img').src;
        
        // Set modal title
        document.getElementById('purchase-modal-title').textContent = vehicleName + ' - Purchase Enquiry';
        
        // Set hidden form values
        document.getElementById('enquiry-vehicle-id').value = vehicleId;
        document.getElementById('enquiry-vehicle-name').value = vehicleName;
        
        // Set modal image
        document.getElementById('purchase-modal-image').src = vehicleImage;
        
        // Set vehicle specs (you might want to enhance this with actual data)
        document.getElementById('spec-year').textContent = card.querySelector('.fa-calendar-alt').parentNode.textContent.trim();
        document.getElementById('spec-mileage').textContent = card.querySelector('.fa-tachometer-alt').parentNode.textContent.trim();
        document.getElementById('spec-fuel').textContent = card.querySelector('.fa-gas-pump').parentNode.textContent.trim();
        
        // Show the modal
        document.getElementById('purchase-modal').style.display = 'flex';
      });
    });
      // Property buy now buttons
    document.querySelectorAll('.card[data-id^="property-"] .btn-buy').forEach(button => {
      button.addEventListener('click', function() {
        const card = this.closest('.card');
        const propertyId = card.dataset.id;
        const propertyName = card.querySelector('h3').textContent;
        const propertyImage = card.querySelector('.card-image img').src;
        const propertyLocation = card.querySelector('.location').textContent;
        const propertyPrice = card.querySelector('.price').textContent;
        
        // Set modal title
        document.getElementById('property-modal-title').textContent = propertyName + ' - Purchase Enquiry';
        
        // Set hidden form values
        document.getElementById('enquiry-property-id').value = propertyId;
        document.getElementById('enquiry-property-name').value = propertyName;
        
        // Set modal image
        document.getElementById('property-modal-image').src = propertyImage;
        
        // Set property details from card data
        document.getElementById('spec-property-location').textContent = propertyLocation;
        
        // Determine property type based on the property name and details
        let propertyType = 'Property';
        if (propertyName.toLowerCase().includes('apartment') || propertyName.toLowerCase().includes('block')) {
          propertyType = 'Apartment Complex';
        } else if (propertyName.toLowerCase().includes('house') || propertyName.toLowerCase().includes('bedroom')) {
          propertyType = 'Residential House';
        } else if (propertyName.toLowerCase().includes('rental') || propertyName.toLowerCase().includes('unit')) {
          propertyType = 'Investment Property';
        } else if (propertyName.toLowerCase().includes('commercial')) {
          propertyType = 'Commercial Property';
        }
        document.getElementById('spec-property-type').textContent = propertyType;
        
        // Extract and set other details if available
        const detailsContainer = card.querySelector('.card-details');
        if (detailsContainer) {
          // Reset spec values
          document.getElementById('spec-property-size').textContent = '-';
          document.getElementById('spec-property-bedrooms').textContent = '-';
          document.getElementById('spec-property-bathrooms').textContent = '-';
          document.getElementById('spec-property-year').textContent = '-';
          
          // Try to extract common property details
          const details = detailsContainer.querySelectorAll('span');
          details.forEach(detail => {
            const text = detail.textContent.trim();
            
            // Extract bedrooms
            if (text.includes('beds') || text.includes('BR') || text.includes('bedroom')) {
              document.getElementById('spec-property-bedrooms').textContent = text;
            } 
            // Extract size/plot information
            else if (text.includes('Acre') || text.includes('Plot') || text.includes('×') || text.includes('sq')) {
              document.getElementById('spec-property-size').textContent = text;
            }
            // Extract units for investment properties
            else if (text.includes('Units') || text.includes('Unit')) {
              document.getElementById('spec-property-size').textContent = text;
            }
            // Extract parking information
            else if (text.includes('Parking')) {
              document.getElementById('spec-property-bathrooms').textContent = text; // Use bathrooms field for parking
            }
          });
        }
        
        // Set estimated property year based on property type and location
        if (propertyName.toLowerCase().includes('prime') || propertyName.toLowerCase().includes('modern')) {
          document.getElementById('spec-property-year').textContent = '2015-2020';
        } else {
          document.getElementById('spec-property-year').textContent = '2010-2018';
        }
        
        // Show the property modal
        document.getElementById('property-modal').style.display = 'flex';
      });
    });
  },

  // Handle gallery buy now button
  handleGalleryBuyNow: function() {
    // Close gallery modal
    document.querySelector('.gallery-modal').classList.remove('active');
    
    // Get current item details from gallery
    const title = document.querySelector('.gallery-title').textContent;
    const imageSrc = document.querySelector('.gallery-image').src;
    
    // Determine if it's a vehicle or property
    if (title.includes('vehicle-')) {
      // Open vehicle modal
      document.getElementById('purchase-modal-title').textContent = title + ' - Purchase Enquiry';
      document.getElementById('enquiry-vehicle-id').value = title;
      document.getElementById('enquiry-vehicle-name').value = title;
      document.getElementById('purchase-modal-image').src = imageSrc;
      document.getElementById('purchase-modal').style.display = 'flex';
    } else {
      // Open property modal      document.getElementById('property-modal-title').textContent = title + ' - Purchase Enquiry';
      document.getElementById('enquiry-property-id').value = title;
      document.getElementById('enquiry-property-name').value = title;
      document.getElementById('property-modal-image').src = imageSrc;
      
      // Show modal and prevent body scroll
      const propertyModal = document.getElementById('property-modal');
      propertyModal.style.display = 'flex';
      propertyModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },  // Handle vehicle enquiry form submission
  handleVehicleEnquiry: function(event) {
    event.preventDefault();
    
    try {
      console.log("Vehicle form submission started");
      
      // Prevent double submission
      if (this.isSubmitting) {
        console.log("Preventing duplicate submission");
        return;
      }
      this.isSubmitting = true;
      
      // Show loading indicator
      const submitBtn = event.target.querySelector('.form-submit-btn');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Get form data
      const form = event.target;
      
      // Validate form elements exist
      if (!form.elements.vehicleId || !form.elements.vehicleName) {
        throw new Error("Missing required form fields");
      }
      
      const formData = {
        type: 'vehicle',
        vehicleId: form.elements.vehicleId.value,
        vehicleName: form.elements.vehicleName.value,
        name: form.elements.name.value,
        email: form.elements.email.value,
        phone: form.elements.phone.value,
        message: form.elements.message.value,
        financing: form.elements.financing.value,
        testDrive: form.elements.testDrive.value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      console.log("Submitting vehicle enquiry:", formData);
        // Save to Firestore and Google Sheets
      const promises = [
        firebase.firestore().collection('enquiries').add(formData)
      ];
      
      // Also send to Google Sheets if available
      if (typeof GoogleSheetsHandler !== 'undefined') {
        const sheetsData = {
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          vehicleMake: this.extractVehicleDetail(formData.vehicleName, 'make'),
          vehicleModel: this.extractVehicleDetail(formData.vehicleName, 'model'),
          vehicleYear: this.extractVehicleDetail(formData.vehicleName, 'year'),
          vehiclePrice: this.extractVehicleDetail(formData.vehicleName, 'price'),
          financingRequired: formData.financing === 'yes' ? 'Yes' : 'No',
          additionalComments: formData.message,
          urgencyLevel: formData.testDrive === 'yes' ? 'High' : 'Medium'
        };
        promises.push(GoogleSheetsHandler.sendVehicleEnquiry(sheetsData));
      }
      
      Promise.allSettled(promises)
        .then((results) => {
          const firebaseResult = results[0];
          const sheetsResult = results[1];
          
          if (firebaseResult.status === 'fulfilled') {
            // Show success message
            this.showNotification('Thank you! Your vehicle enquiry has been submitted successfully.');
            
            // Reset form
            form.reset();
            
            // Close modal
            document.getElementById('purchase-modal').style.display = 'none';
          } else {
            throw new Error('Firebase submission failed');
          }
          
          // Log Google Sheets result (non-blocking)
          if (sheetsResult && sheetsResult.status === 'rejected') {
            console.warn('Google Sheets submission failed:', sheetsResult.reason);
          }
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          this.showNotification('There was an error submitting your enquiry. Please try again later.', 'error');
        })
        .finally(() => {
          // Restore button state
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          this.isSubmitting = false;
        });
    } catch (error) {
      console.error("Error in vehicle form handler:", error);
      this.showNotification('Error: ' + error.message, 'error');
      this.isSubmitting = false;
    }
  },  // Handle property enquiry form submission
  handlePropertyEnquiry: function(event) {
    event.preventDefault();
    
    try {
      console.log("Property form submission started");
      console.log("Form elements:", event.target.elements);
      
      // Prevent double submission
      if (this.isSubmitting) {
        console.log("Preventing duplicate submission");
        return;
      }
      this.isSubmitting = true;
      
      // Show loading indicator
      const submitBtn = event.target.querySelector('.form-submit-btn');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Get form data
      const form = event.target;
        // Validate form elements exist
      if (!form.elements.propertyId || !form.elements.propertyName) {
        throw new Error("Missing required form fields");
      }
      
      // Determine which field to use for visit request (different names in different forms)
      let visitRequestValue = '';
      if (form.elements.visitRequest) {
        visitRequestValue = form.elements.visitRequest.value;
      } else if (form.elements.viewing) {
        visitRequestValue = form.elements.viewing.value;
      } else if (form.elements.visit) {
        visitRequestValue = form.elements.visit.value;
      }
      
      const formData = {
        type: 'property',
        propertyId: form.elements.propertyId.value,
        propertyName: form.elements.propertyName.value,
        name: form.elements.name.value,
        email: form.elements.email.value,
        phone: form.elements.phone.value,
        message: form.elements.message.value,
        financing: form.elements.financing.value,
        visitRequest: visitRequestValue,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      console.log("Submitting property enquiry:", formData);
        // Save to Firestore and Google Sheets
      const promises = [
        firebase.firestore().collection('enquiries').add(formData)
      ];
      
      // Also send to Google Sheets if available
      if (typeof GoogleSheetsHandler !== 'undefined') {
        const sheetsData = {
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          propertyType: this.extractPropertyDetail(formData.propertyName, 'type'),
          propertyLocation: this.extractPropertyDetail(formData.propertyName, 'location'),
          propertyPrice: this.extractPropertyDetail(formData.propertyName, 'price'),
          financingRequired: formData.financing === 'yes' ? 'Yes' : 'No',
          viewingDatePreference: formData.visitRequest,
          additionalComments: formData.message
        };
        promises.push(GoogleSheetsHandler.sendPropertyEnquiry(sheetsData));
      }
      
      Promise.allSettled(promises)
        .then((results) => {
          const firebaseResult = results[0];
          const sheetsResult = results[1];
          
          if (firebaseResult.status === 'fulfilled') {
            // Show success message
            this.showNotification('Thank you! Your property enquiry has been submitted successfully.');
              // Reset form
            form.reset();
            
            // Close modal
            const propertyModal = document.getElementById('property-modal');
            const purchaseModal = document.getElementById('purchase-modal');
            
            if (propertyModal && propertyModal.style.display === 'flex') {
              propertyModal.style.display = 'none';
            }
            
            if (purchaseModal && purchaseModal.style.display === 'flex') {
              purchaseModal.style.display = 'none';
            }
          } else {
            throw new Error('Firebase submission failed');
          }
          
          // Log Google Sheets result (non-blocking)
          if (sheetsResult && sheetsResult.status === 'rejected') {
            console.warn('Google Sheets submission failed:', sheetsResult.reason);
          }
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          this.showNotification('There was an error submitting your enquiry. Please try again later.', 'error');
        })
        .finally(() => {
          // Restore button state
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          this.isSubmitting = false;
        });
    } catch (error) {
      console.error("Error in property form handler:", error);
      this.showNotification('Error: ' + error.message, 'error');
      this.isSubmitting = false;
    }
  },
  // Handle vehicle sell form submission
  handleVehicleSellForm: function(event) {
    event.preventDefault();
    
    try {
      console.log("Vehicle sell form submission started");
      
      // Prevent double submission
      if (this.isSubmitting) {
        console.log("Preventing duplicate submission");
        return;
      }
      this.isSubmitting = true;
      
      // Show loading indicator
      const submitBtn = event.target.querySelector('.btn-submit');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      // Get form data
      const form = event.target;
        // Validate required fields
      const requiredFields = ['vehicle-make', 'vehicle-year', 'vehicle-price', 'vehicle-mileage', 'vehicle-description', 'seller-name', 'seller-phone', 'seller-email'];
      for (let fieldName of requiredFields) {
        const field = form.elements[fieldName];
        if (!field || !field.value.trim()) {
          throw new Error(`Please fill in the ${fieldName.replace('vehicle-', '').replace('seller-', '').replace('-', ' ')} field`);
        }
      }
      
      // Check terms acceptance
      const termsAccepted = form.elements['seller-terms'] ? form.elements['seller-terms'].checked : false;
      if (!termsAccepted) {
        throw new Error("Please accept the Terms and Conditions");
      }
      
      const formData = {
        type: 'vehicle',
        listingType: 'sell',
        vehicleMake: form.elements['vehicle-make'].value,
        vehicleYear: form.elements['vehicle-year'].value,
        price: parseFloat(form.elements['vehicle-price'].value),
        mileage: parseInt(form.elements['vehicle-mileage'].value),
        description: form.elements['vehicle-description'].value,
        sellerName: form.elements['seller-name'].value,
        sellerPhone: form.elements['seller-phone'].value,
        sellerEmail: form.elements['seller-email'].value,
        termsAccepted: termsAccepted,
        status: 'pending', // Pending review
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      console.log("Submitting vehicle listing:", formData);
        // Save to Firestore and Google Sheets
      const promises = [
        firebase.firestore().collection('listings').add(formData)
      ];
      
      // Also send to Google Sheets if available
      if (typeof GoogleSheetsHandler !== 'undefined') {
        const sheetsData = {
          ownerName: formData.sellerName,
          email: formData.sellerEmail,
          phone: formData.sellerPhone,
          vehicleMake: formData.vehicleMake,
          vehicleModel: form.elements['vehicle-model'] ? form.elements['vehicle-model'].value : '',
          vehicleYear: formData.vehicleYear.toString(),
          mileage: formData.mileage.toString(),
          condition: form.elements['vehicle-condition'] ? form.elements['vehicle-condition'].value : 'Good',
          askingPrice: formData.price.toString(),
          vehicleDescription: formData.description,
          additionalComments: ''
        };
        promises.push(GoogleSheetsHandler.sendVehicleSell(sheetsData));
      }
      
      Promise.allSettled(promises)
        .then((results) => {
          const firebaseResult = results[0];
          const sheetsResult = results[1];
          
          if (firebaseResult.status === 'fulfilled') {
            const docRef = firebaseResult.value;
            
            // Generate reference ID using the document ID
            const refId = 'VEH-' + docRef.id.substr(-6).toUpperCase();
            
            // Update document with reference ID
            return docRef.update({ referenceId: refId }).then(() => {
              // Show success message
              this.showNotification('Thank you! Your vehicle listing has been submitted successfully. Reference ID: ' + refId);
              
              // Reset form
              form.reset();
              
              // Clear file preview
              const vehiclePhotosPreview = document.getElementById('vehicle-photos-preview');
              if (vehiclePhotosPreview) {
                vehiclePhotosPreview.innerHTML = '';
              }
              
              // Hide vehicle form and show success message
              const vehicleFormContainer = document.getElementById('vehicle-form-container');
              const successMessage = document.getElementById('success-message');
              const referenceIdElement = document.getElementById('reference-id');
              
              if (vehicleFormContainer) vehicleFormContainer.classList.remove('active');
              if (successMessage) {
                successMessage.style.display = 'block';
                if (referenceIdElement) referenceIdElement.textContent = refId;
                successMessage.scrollIntoView({ behavior: 'smooth' });
              }
            });
          } else {
            throw new Error('Firebase submission failed');
          }
          
          // Log Google Sheets result (non-blocking)
          if (sheetsResult && sheetsResult.status === 'rejected') {
            console.warn('Google Sheets submission failed:', sheetsResult.reason);
          }
        })
        .catch(error => {
          console.error('Error submitting vehicle listing:', error);
          this.showNotification('There was an error submitting your listing. Please try again later.', 'error');
        })
        .finally(() => {
          // Restore button state
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          this.isSubmitting = false;
        });
    } catch (error) {
      console.error("Error in vehicle sell form handler:", error);
      this.showNotification('Error: ' + error.message, 'error');
      
      // Restore button state
      const submitBtn = event.target.querySelector('.btn-submit');
      if (submitBtn) {
        submitBtn.textContent = submitBtn.textContent.replace('Submitting...', 'Submit Vehicle Listing');
        submitBtn.disabled = false;
      }
      this.isSubmitting = false;
    }
  },

  // Handle property sell form submission  
  handlePropertySellForm: function(event) {
    event.preventDefault();
    
    try {
      console.log("Property sell form submission started");
      
      // Prevent double submission
      if (this.isSubmitting) {
        console.log("Preventing duplicate submission");
        return;
      }
      this.isSubmitting = true;
      
      // Show loading indicator
      const submitBtn = event.target.querySelector('.btn-submit');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      // Get form data
      const form = event.target;
        // Validate required fields
      const requiredFields = ['property-type', 'property-price', 'property-title', 'property-location', 'property-area', 'property-description', 'property-seller-name', 'property-seller-phone', 'property-seller-email'];
      for (let fieldName of requiredFields) {
        const field = form.elements[fieldName];
        if (!field || !field.value.trim()) {
          throw new Error(`Please fill in the ${fieldName.replace('property-', '').replace('seller-', '').replace('-', ' ')} field`);
        }
      }
      
      // Check terms acceptance
      const termsAccepted = form.elements['property-seller-terms'] ? form.elements['property-seller-terms'].checked : false;
      if (!termsAccepted) {
        throw new Error("Please accept the Terms and Conditions");
      }
      
      const formData = {
        type: 'property',
        listingType: 'sell',
        propertyType: form.elements['property-type'].value,
        title: form.elements['property-title'].value,
        price: parseFloat(form.elements['property-price'].value),
        location: form.elements['property-location'].value,
        area: parseInt(form.elements['property-area'].value),
        description: form.elements['property-description'].value,
        sellerName: form.elements['property-seller-name'].value,
        sellerPhone: form.elements['property-seller-phone'].value,
        sellerEmail: form.elements['property-seller-email'].value,
        termsAccepted: termsAccepted,
        status: 'pending', // Pending review
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      console.log("Submitting property listing:", formData);
        // Save to Firestore and Google Sheets
      const promises = [
        firebase.firestore().collection('listings').add(formData)
      ];
      
      // Also send to Google Sheets if available
      if (typeof GoogleSheetsHandler !== 'undefined') {
        const sheetsData = {
          ownerName: formData.sellerName,
          email: formData.sellerEmail,
          phone: formData.sellerPhone,
          propertyType: formData.propertyType,
          propertyLocation: formData.location,
          propertySize: formData.area.toString(),
          bedrooms: form.elements['property-bedrooms'] ? form.elements['property-bedrooms'].value : '',
          bathrooms: form.elements['property-bathrooms'] ? form.elements['property-bathrooms'].value : '',
          askingPrice: formData.price.toString(),
          propertyDescription: formData.description,
          propertyFeatures: form.elements['property-features'] ? form.elements['property-features'].value : '',
          additionalComments: ''
        };
        promises.push(GoogleSheetsHandler.sendPropertySell(sheetsData));
      }
      
      Promise.allSettled(promises)
        .then((results) => {
          const firebaseResult = results[0];
          const sheetsResult = results[1];
          
          if (firebaseResult.status === 'fulfilled') {
            const docRef = firebaseResult.value;
            
            // Generate reference ID using the document ID
            const refId = 'PROP-' + docRef.id.substr(-6).toUpperCase();
            
            // Update document with reference ID
            return docRef.update({ referenceId: refId }).then(() => {
              // Show success message
              this.showNotification('Thank you! Your property listing has been submitted successfully. Reference ID: ' + refId);
              
              // Reset form
              form.reset();
              
              // Clear file preview
              const propertyPhotosPreview = document.getElementById('property-photos-preview');
              if (propertyPhotosPreview) {
                propertyPhotosPreview.innerHTML = '';
              }
              
              // Hide property form and show success message
              const propertyFormContainer = document.getElementById('property-form-container');
              const successMessage = document.getElementById('success-message');
              const referenceIdElement = document.getElementById('reference-id');
              
              if (propertyFormContainer) propertyFormContainer.classList.remove('active');
              if (successMessage) {
                successMessage.style.display = 'block';
                if (referenceIdElement) referenceIdElement.textContent = refId;
                successMessage.scrollIntoView({ behavior: 'smooth' });
              }
            });
          } else {
            throw new Error('Firebase submission failed');
          }
          
          // Log Google Sheets result (non-blocking)
          if (sheetsResult && sheetsResult.status === 'rejected') {
            console.warn('Google Sheets submission failed:', sheetsResult.reason);
          }
        })
        .catch(error => {
          console.error('Error submitting property listing:', error);
          this.showNotification('There was an error submitting your listing. Please try again later.', 'error');
        })
        .finally(() => {
          // Restore button state
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          this.isSubmitting = false;
        });
    } catch (error) {
      console.error("Error in property sell form handler:", error);
      this.showNotification('Error: ' + error.message, 'error');
      
      // Restore button state
      const submitBtn = event.target.querySelector('.btn-submit');
      if (submitBtn) {
        submitBtn.textContent = submitBtn.textContent.replace('Submitting...', 'Submit Property Listing');
        submitBtn.disabled = false;
      }      this.isSubmitting = false;
    }
  },

  // Handle test drive booking form submission
  handleTestDriveBooking: function(event) {
    event.preventDefault();
    
    try {
      console.log("Test drive booking form submission started");
      
      // Prevent double submission
      if (this.isSubmitting) {
        console.log("Preventing duplicate submission");
        return;
      }
      this.isSubmitting = true;
      
      // Show loading indicator
      const submitBtn = event.target.querySelector('.form-submit');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Booking...';
      submitBtn.disabled = true;
      
      // Get form data
      const form = event.target;
      
      // Validate required fields
      const requiredFields = ['customer-name', 'customer-email', 'customer-phone', 'vehicle-interest', 'preferred-date', 'preferred-time', 'id-number', 'driving-license'];
      for (let fieldName of requiredFields) {
        const field = form.elements[fieldName];
        if (!field || !field.value.trim()) {
          throw new Error(`Please fill in the ${fieldName.replace('-', ' ')} field`);
        }
      }
      
      const formData = {
        type: 'testDriveBooking',
        customerName: form.elements['customer-name'].value,
        email: form.elements['customer-email'].value,
        phone: form.elements['customer-phone'].value,
        vehicleInterest: form.elements['vehicle-interest'].value,
        preferredDate: form.elements['preferred-date'].value,
        preferredTime: form.elements['preferred-time'].value,
        idNumber: form.elements['id-number'].value,
        drivingLicense: form.elements['driving-license'].value,
        comments: form.elements['comments'] ? form.elements['comments'].value : '',
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      console.log("Submitting test drive booking:", formData);
      
      // Save to Firestore and Google Sheets
      const promises = [
        firebase.firestore().collection('testDriveBookings').add(formData)
      ];
      
      // Also send to Google Sheets if available
      if (typeof GoogleSheetsHandler !== 'undefined') {
        const sheetsData = {
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          vehicleMake: this.extractVehicleDetail(formData.vehicleInterest, 'make'),
          vehicleModel: this.extractVehicleDetail(formData.vehicleInterest, 'model'),
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          driverLicenseNumber: formData.drivingLicense,
          additionalComments: formData.comments
        };
        promises.push(GoogleSheetsHandler.sendTestDriveBooking(sheetsData));
      }
      
      Promise.allSettled(promises)
        .then((results) => {
          const firebaseResult = results[0];
          const sheetsResult = results[1];
          
          if (firebaseResult.status === 'fulfilled') {
            // Show success modal instead of notification
            const successModal = document.getElementById('success-modal');
            if (successModal) {
              successModal.classList.add('active');
            } else {
              this.showNotification('Thank you! Your test drive has been booked successfully. We will contact you soon to confirm the appointment.');
            }
            
            // Reset form
            form.reset();
          } else {
            throw new Error('Firebase submission failed');
          }
          
          // Log Google Sheets result (non-blocking)
          if (sheetsResult && sheetsResult.status === 'rejected') {
            console.warn('Google Sheets submission failed:', sheetsResult.reason);
          }
        })
        .catch(error => {
          console.error('Error submitting test drive booking:', error);
          this.showNotification('There was an error booking your test drive. Please try again later.', 'error');
        })
        .finally(() => {
          // Restore button state
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          this.isSubmitting = false;
        });
    } catch (error) {
      console.error("Error in test drive booking form handler:", error);
      this.showNotification('Error: ' + error.message, 'error');
      
      // Restore button state
      const submitBtn = event.target.querySelector('.form-submit');
      if (submitBtn) {
        submitBtn.textContent = submitBtn.textContent.replace('Booking...', 'Book Test Drive');
        submitBtn.disabled = false;
      }
      this.isSubmitting = false;
    }
  },

  // Handle import tracking form submission
  handleImportTracking: function(event) {
    event.preventDefault();
    
    try {
      console.log("Import tracking form submission started");
      
      // Prevent double submission
      if (this.isSubmitting) {
        console.log("Preventing duplicate submission");
        return;
      }
      this.isSubmitting = true;
      
      // Show loading indicator
      const submitBtn = event.target.querySelector('.form-submit');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Tracking...';
      submitBtn.disabled = true;
      
      // Get form data
      const form = event.target;
      
      // Validate required fields
      const requiredFields = ['tracking-number', 'customer-email-tracking'];
      for (let fieldName of requiredFields) {
        const field = form.elements[fieldName];
        if (!field || !field.value.trim()) {
          throw new Error(`Please fill in the ${fieldName.replace('-', ' ').replace('tracking', 'tracking number').replace('customer', 'customer')} field`);
        }
      }
      
      const formData = {
        type: 'importTracking',
        trackingNumber: form.elements['tracking-number'].value,
        email: form.elements['customer-email-tracking'].value,
        requestTimestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      console.log("Submitting import tracking request:", formData);
      
      // Save to Firestore and Google Sheets
      const promises = [
        firebase.firestore().collection('importTrackingRequests').add(formData)
      ];
      
      // Also send to Google Sheets if available
      if (typeof GoogleSheetsHandler !== 'undefined') {
        const sheetsData = {
          customerName: '', // Not collected in tracking form
          email: formData.email,
          phone: '', // Not collected in tracking form
          importType: 'Vehicle Import',
          itemDescription: 'Vehicle import tracking request',
          countryOfOrigin: '',
          estimatedValue: '',
          trackingNumber: formData.trackingNumber,
          additionalComments: 'Import tracking request'
        };
        promises.push(GoogleSheetsHandler.sendImportTracking(sheetsData));
      }
      
      Promise.allSettled(promises)
        .then((results) => {
          const firebaseResult = results[0];
          const sheetsResult = results[1];
          
          if (firebaseResult.status === 'fulfilled') {
            // Show tracking result instead of notification
            const trackingResult = document.getElementById('tracking-result');
            if (trackingResult) {
              trackingResult.classList.add('active');
            } else {
              this.showNotification('Tracking request submitted successfully. We will send you an update via email.');
            }
          } else {
            throw new Error('Firebase submission failed');
          }
          
          // Log Google Sheets result (non-blocking)
          if (sheetsResult && sheetsResult.status === 'rejected') {
            console.warn('Google Sheets submission failed:', sheetsResult.reason);
          }
        })
        .catch(error => {
          console.error('Error submitting import tracking request:', error);
          this.showNotification('There was an error processing your tracking request. Please try again later.', 'error');
        })
        .finally(() => {
          // Restore button state
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          this.isSubmitting = false;
        });
    } catch (error) {
      console.error("Error in import tracking form handler:", error);
      this.showNotification('Error: ' + error.message, 'error');
      
      // Restore button state
      const submitBtn = event.target.querySelector('.form-submit');
      if (submitBtn) {
        submitBtn.textContent = submitBtn.textContent.replace('Tracking...', 'Track Import');
        submitBtn.disabled = false;
      }
      this.isSubmitting = false;
    }
  },

  // Show notification to user
  showNotification: function(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('form-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'form-notification';
      document.body.appendChild(notification);
      
      // Add styles if not already defined in CSS
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.right = '20px';
      notification.style.padding = '15px 20px';
      notification.style.borderRadius = '5px';
      notification.style.color = 'white';
      notification.style.fontWeight = 'bold';
      notification.style.zIndex = '10000';
      notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
      notification.style.transition = 'all 0.3s ease';
    }
    
    // Set type-specific styles
    if (type === 'success') {
      notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#e74c3c';
    } else if (type === 'warning') {
      notification.style.backgroundColor = '#f39c12';
    } else if (type === 'info') {
      notification.style.backgroundColor = '#3498db';
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
      // Hide after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
    }, 3000);
  },

  // Helper method to extract vehicle details from vehicle name
  extractVehicleDetail: function(vehicleName, detailType) {
    if (!vehicleName) return '';
    
    // Basic extraction logic - you can enhance this based on your data format
    const parts = vehicleName.split(' ');
    
    switch (detailType) {
      case 'make':
        return parts[0] || '';
      case 'model':
        return parts.slice(1, -1).join(' ') || '';
      case 'year':
        // Look for year pattern (4 digits)
        const yearMatch = vehicleName.match(/\b(19|20)\d{2}\b/);
        return yearMatch ? yearMatch[0] : '';
      case 'price':
        // Look for price pattern (numbers with currency)
        const priceMatch = vehicleName.match(/[\d,]+/);
        return priceMatch ? priceMatch[0] : '';
      default:
        return '';
    }
  },

  // Helper method to extract property details from property name
  extractPropertyDetail: function(propertyName, detailType) {
    if (!propertyName) return '';
    
    // Basic extraction logic - you can enhance this based on your data format
    switch (detailType) {
      case 'type':
        if (propertyName.toLowerCase().includes('apartment')) return 'Apartment';
        if (propertyName.toLowerCase().includes('house')) return 'House';
        if (propertyName.toLowerCase().includes('villa')) return 'Villa';
        if (propertyName.toLowerCase().includes('plot')) return 'Plot';
        if (propertyName.toLowerCase().includes('land')) return 'Land';
        return 'Property';
      case 'location':
        // Try to extract location from property name
        const locationMatch = propertyName.match(/in\s+([^,]+)/i);
        return locationMatch ? locationMatch[1].trim() : '';
      case 'price':
        // Look for price pattern
        const priceMatch = propertyName.match(/[\d,]+/);
        return priceMatch ? priceMatch[0] : '';
      default:
        return '';
    }
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded event triggered - Initializing FormHandler");
  
  // Wait a bit longer to ensure all elements are properly loaded
  setTimeout(function() {
    console.log("Starting FormHandler initialization...");
    
    // Initialize form handler
    FormHandler.init();
    console.log("FormHandler initialized");
    
    // Find form elements for debugging
    const vehicleForm = document.getElementById('vehicle-enquiry-form');
    const propertyForm = document.getElementById('property-enquiry-form');
    console.log("Vehicle form found:", !!vehicleForm);
    console.log("Property form found:", !!propertyForm);
    
    // Check if Buy Now buttons exist
    const buyButtons = document.querySelectorAll('.btn-buy');
    console.log("Buy Now buttons found:", buyButtons.length);
    
    // Verify Firebase initialization
    console.log("Firebase apps:", firebase.apps ? firebase.apps.length : 0);
    console.log("Database available:", !!db);
  }, 500); // Increased timeout to 500ms
    // Close modals when clicking close button
  const purchaseModalClose = document.querySelector('.purchase-modal-close');
  if (purchaseModalClose) {
    purchaseModalClose.addEventListener('click', function() {
      const purchaseModal = document.getElementById('purchase-modal');
      if (purchaseModal) {
        purchaseModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  const propertyModalClose = document.querySelector('.property-modal-close');
  if (propertyModalClose) {
    propertyModalClose.addEventListener('click', function() {
      const propertyModal = document.getElementById('property-modal');
      if (propertyModal) {
        propertyModal.style.display = 'none';
        propertyModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    const purchaseModal = document.getElementById('purchase-modal');
    const propertyModal = document.getElementById('property-modal');
    
    if (event.target === purchaseModal) {
      purchaseModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    
    if (event.target === propertyModal) {
      propertyModal.style.display = 'none';
      propertyModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
});
