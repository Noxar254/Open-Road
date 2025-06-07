// Script for handling Buy Now buttons in pagination pages
document.addEventListener('DOMContentLoaded', function() {
    // Add data-id attributes to cards if they don't have them
    document.querySelectorAll('.card').forEach((card, index) => {
        if (!card.hasAttribute('data-id')) {
            const vehicleName = card.querySelector('h3').textContent;
            const vehicleId = 'vehicle-' + (index + 1);
            card.setAttribute('data-id', vehicleId);
        }
    });
    
    // Add Buy Now button functionality
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const vehicleId = card.getAttribute('data-id');
            const vehicleName = card.querySelector('h3').textContent;
            const vehicleImage = card.querySelector('.card-image img').src;
            
            // Set modal title
            document.getElementById('purchase-modal-title').textContent = vehicleName + ' - Purchase Enquiry';
            
            // Set hidden form values
            document.getElementById('enquiry-vehicle-id').value = vehicleId;
            document.getElementById('enquiry-vehicle-name').value = vehicleName;
            
            // Set modal image
            document.getElementById('purchase-modal-image').src = vehicleImage;
            
            // Set vehicle specs based on vehicle ID
            setVehicleSpecs(vehicleId, card);
            
            // Show the modal
            document.getElementById('purchase-modal').classList.add('active');
        });
    });
      // Add View button functionality
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const vehicleId = card.getAttribute('data-id');
            const vehicleName = card.querySelector('h3').textContent;
            const vehicleImage = card.querySelector('.card-image img').src;
            
            // Set modal title
            document.getElementById('purchase-modal-title').textContent = vehicleName + ' - Vehicle Details';
            
            // Set hidden form values
            document.getElementById('enquiry-vehicle-id').value = vehicleId;
            document.getElementById('enquiry-vehicle-name').value = vehicleName;
            
            // Set modal image
            document.getElementById('purchase-modal-image').src = vehicleImage;
            
            // Set vehicle specs based on vehicle ID
            setVehicleSpecs(vehicleId, card);
            
            // Show the modal
            document.getElementById('purchase-modal').classList.add('active');
        });
    });

    // Function to set vehicle specifications based on vehicle ID
    function setVehicleSpecs(vehicleId, card) {
        // Get basic details from card
        const cardDetails = card.querySelectorAll('.card-details span');
        let year = '', mileage = '', fuel = '';
        
        cardDetails.forEach(detail => {
            const text = detail.textContent.trim();
            if (text.includes('2016') || text.includes('202')) {
                year = text;
            } else if (text.includes('km')) {
                mileage = text;
            } else if (text.includes('Petrol') || text.includes('Diesel') || text.includes('Hybrid') || text.includes('Turbo')) {
                fuel = text;
            }
        });
        
        if (vehicleId === 'kdq-vehicle') {
            // Mercedes Benz KDQ GLC 250 specifications
            document.getElementById('spec-engine').textContent = '2000cc Petrol-Turbocharged';
            document.getElementById('spec-transmission').textContent = '9-Speed Automatic';
            document.getElementById('spec-drive').textContent = 'All-Wheel Drive (4MATIC)';
            document.getElementById('spec-mileage').textContent = mileage || '95,000 km';
            document.getElementById('spec-horsepower').textContent = '211 hp';
            document.getElementById('spec-fuel').textContent = fuel || 'Petrol-Turbocharged';
            document.getElementById('spec-year').textContent = year || '2016';
            
            // Show KDQ premium features
            const kdqFeatures = document.getElementById('kdq-features');
            if (kdqFeatures) {
                kdqFeatures.style.display = 'block';
            }
            
            // Set default enquiry message for KDQ
            const defaultMessage = `I'm interested in the Mercedes Benz KDQ | GLC 250 | 2016 priced at KES 4.6M.

Key specifications I'm interested in:
- 2000cc Petrol-Turbocharged
- 9-Speed Automatic
- Double SunRoof
- Leather Interior
- Anti-Lock Braking System
- Blind Spot Monitoring
- Cruise Control (Intelligent/Active)
- Electronic Brake Force Distribution
- Hill Holder
- Engine Immobiliser
- Lane Keeping Assist
- Park Assist
- Speed Sensing Auto Door Lock
- Traction Control System
- Daytime Running Lights - LED

Please contact me with more information about this vehicle.`;
            
            document.getElementById('enquiry-message').value = defaultMessage;
        } else {
            // Default values for other vehicles
            document.getElementById('spec-engine').textContent = 'Information Available On Request';
            document.getElementById('spec-transmission').textContent = 'Information Available On Request';
            document.getElementById('spec-drive').textContent = 'Information Available On Request';
            document.getElementById('spec-mileage').textContent = mileage || 'Information Available On Request';
            document.getElementById('spec-horsepower').textContent = 'Information Available On Request';
            document.getElementById('spec-fuel').textContent = fuel || 'Information Available On Request';
            document.getElementById('spec-year').textContent = year || 'Information Available On Request';
            
            // Set default enquiry message
            const vehicleName = card.querySelector('h3').textContent;
            const defaultMessage = `I'm interested in the ${vehicleName}. Please contact me with more information.`;
            document.getElementById('enquiry-message').value = defaultMessage;
        }
    }

    // Gallery button functionality
    const galleryBuyBtn = document.querySelector('.gallery-btn.primary');
    if (galleryBuyBtn) {
        galleryBuyBtn.addEventListener('click', function() {
            // Close gallery modal
            document.querySelector('.gallery-modal').classList.remove('active');
            
            // Get current item details from gallery
            const title = document.querySelector('.gallery-title').textContent;
            const imageSrc = document.querySelector('.gallery-image').src;
            
            // Open vehicle modal
            document.getElementById('purchase-modal-title').textContent = title + ' - Purchase Enquiry';
            document.getElementById('enquiry-vehicle-id').value = title;
            document.getElementById('enquiry-vehicle-name').value = title;
            document.getElementById('purchase-modal-image').src = imageSrc;
            document.getElementById('purchase-modal').classList.add('active');
        });
    }
    
    // Close modals when clicking close button
    const purchaseModalClose = document.querySelector('.purchase-modal-close');
    if (purchaseModalClose) {
        purchaseModalClose.addEventListener('click', function() {
            document.getElementById('purchase-modal').classList.remove('active');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const purchaseModal = document.getElementById('purchase-modal');
        
        if (event.target === purchaseModal) {
            purchaseModal.classList.remove('active');
        }
    });
    
    // Note: Form submission is handled by FormHandler in firebase-form-handler.js
});
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const vehicleId = card.getAttribute('data-id');
            const vehicleName = card.querySelector('h3').textContent;
            const vehicleImage = card.querySelector('.card-image img').src;
            
            // Set modal title
            document.getElementById('purchase-modal-title').textContent = vehicleName + ' - Vehicle Details';
            
            // Set hidden form values
            document.getElementById('enquiry-vehicle-id').value = vehicleId;
            document.getElementById('enquiry-vehicle-name').value = vehicleName;
            
            // Set modal image
            document.getElementById('purchase-modal-image').src = vehicleImage;
            
            // Set vehicle specs based on vehicle ID
            setVehicleSpecs(vehicleId, card);
            
            // Show the modal
            document.getElementById('purchase-modal').classList.add('active');
        });
    });

    // Function to set vehicle specifications based on vehicle ID
    function setVehicleSpecs(vehicleId, card) {
        // Get basic details from card
        const cardDetails = card.querySelectorAll('.card-details span');
        let year = '', mileage = '', fuel = '';
        
        cardDetails.forEach(detail => {
            const text = detail.textContent.trim();
            if (text.includes('2016') || text.includes('202')) {
                year = text;
            } else if (text.includes('km')) {
                mileage = text;
            } else if (text.includes('Petrol') || text.includes('Diesel') || text.includes('Hybrid') || text.includes('Turbo')) {
                fuel = text;
            }
        });        if (vehicleId === 'kdq-vehicle') {
            // Mercedes Benz KDQ GLC 250 specifications
            document.getElementById('spec-engine').textContent = '2000cc Petrol-Turbocharged';
            document.getElementById('spec-transmission').textContent = '9-Speed Automatic';
            document.getElementById('spec-drive').textContent = 'All-Wheel Drive (4MATIC)';
            document.getElementById('spec-mileage').textContent = mileage || '95,000 km';
            document.getElementById('spec-horsepower').textContent = '211 hp';
            document.getElementById('spec-fuel').textContent = fuel || 'Petrol-Turbocharged';
            document.getElementById('spec-year').textContent = year || '2016';
              // Show KDQ premium features
            const kdqFeatures = document.getElementById('kdq-features');
            if (kdqFeatures) {
                kdqFeatures.style.display = 'block';
            }
              // Set default enquiry message for KDQ
            const defaultMessage = "I'm interested in the Mercedes Benz KDQ | GLC 250 | 2016 priced at KES 4.6M.\n\nKey specifications I'm interested in:\nâ€¢ 2000cc Petrol-Turbocharged\nâ€¢ 9-Speed Automatic\nâ€¢ Double SunRoof\nâ€¢ Leather Interior\nâ€¢ Anti-Lock Braking System\nâ€¢ Blind Spot Monitoring\nâ€¢ Cruise Control (Intelligent/Active)\nâ€¢ Electronic Brake Force Distribution\nâ€¢ Hill Holder\nâ€¢ Engine Immobiliser\nâ€¢ Lane Keeping Assist\nâ€¢ Park Assist\nâ€¢ Speed Sensing Auto Door Lock\nâ€¢ Traction Control System\nâ€¢ Daytime Running Lights - LED\n\nPlease contact me with more information about this vehicle.";
            
            document.getElementById('enquiry-message').value = defaultMessage;
        } else {
            // Default values for other vehicles
            document.getElementById('spec-engine').textContent = 'Information Available On Request';
            document.getElementById('spec-transmission').textContent = 'Information Available On Request';
            document.getElementById('spec-drive').textContent = 'Information Available On Request';
            document.getElementById('spec-mileage').textContent = mileage || 'Information Available On Request';
            document.getElementById('spec-horsepower').textContent = 'Information Available On Request';
            document.getElementById('spec-fuel').textContent = fuel || 'Information Available On Request';
            document.getElementById('spec-year').textContent = year || 'Information Available On Request';
            
            // Set default enquiry message
            const vehicleName = card.querySelector('h3').textContent;
            const defaultMessage = `I'm interested in the ${vehicleName}. Please contact me with more information.`;
            document.getElementById('enquiry-message').value = defaultMessage;
        }
    }

    // Gallery button functionality
    const galleryBuyBtn = document.querySelector('.gallery-btn.primary');
    if (galleryBuyBtn) {
        galleryBuyBtn.addEventListener('click', function() {
            // Close gallery modal
            document.querySelector('.gallery-modal').classList.remove('active');
            
            // Get current item details from gallery
            const title = document.querySelector('.gallery-title').textContent;
            const imageSrc = document.querySelector('.gallery-image').src;
              // Open vehicle modal
            document.getElementById('purchase-modal-title').textContent = title + ' - Purchase Enquiry';
            document.getElementById('enquiry-vehicle-id').value = title;
            document.getElementById('enquiry-vehicle-name').value = title;
            document.getElementById('purchase-modal-image').src = imageSrc;
            document.getElementById('purchase-modal').classList.add('active');
        });
    }    // Close modals when clicking close button
    const purchaseModalClose = document.querySelector('.purchase-modal-close');
    if (purchaseModalClose) {
        purchaseModalClose.addEventListener('click', function() {
            document.getElementById('purchase-modal').classList.remove('active');
        });
    }
      // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const purchaseModal = document.getElementById('purchase-modal');
        
        if (event.target === purchaseModal) {
            purchaseModal.classList.remove('active');
        }
    });
    
    // Note: Form submission is handled by FormHandler in firebase-form-handler.js
});
