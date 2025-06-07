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
    });    // Function to set vehicle specifications based on vehicle ID
    function setVehicleSpecs(vehicleId, card) {
        console.log('setVehicleSpecs called with vehicleId:', vehicleId);
        console.log('card element:', card);
        
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
            // Mercedes Benz KDQ GLC 250 | 2016 specifications
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
            
            // Hide premium features for other vehicles
            const allFeatureSections = document.querySelectorAll('[id$="-features"]');
            allFeatureSections.forEach(section => {
                if (section.id !== 'kdq-features') {
                    section.style.display = 'none';
                }
            });
            
            // Set comprehensive enquiry message for KDQ with all specifications
            const defaultMessage = `I'm interested in the Mercedes Benz KDQ | GLC 250 | 2016 priced at KES 4.6M.

Complete Vehicle Specifications:
• Engine: 2000cc Petrol-Turbocharged
• Transmission: 9-Speed Automatic
• Drive: All-Wheel Drive (4MATIC)
• Horsepower: 211 hp
• Mileage: 95,000 km

Premium Features & Safety Systems:
• Double SunRoof
• Leather Interior
• Anti-Lock Braking System
• Adjustable Speed Limiter
• Blind Spot Monitoring
• Cruise Control (Intelligent/Active)
• Electronic Brake Force Distribution
• Hill Holder
• Engine Immobiliser
• Lane Keeping Assist
• Park Assist
• Speed Sensing Auto Door Lock
• Traction Control System
• Daytime Running Lights - LED

Please provide:
1. Complete service history and maintenance records
2. Available financing options and terms
3. Test drive availability and scheduling
4. Final negotiated pricing
5. Vehicle inspection report

Thank you for your time and I look forward to hearing from you.`;
              document.getElementById('enquiry-message').value = defaultMessage;        } else {
            // Get vehicle name to identify specific vehicle
            const vehicleName = card.querySelector('h3').textContent;
            console.log('Processing vehicle name:', vehicleName);
            
            // Set specifications based on vehicle name
            if (vehicleName.includes('MAZDA DEMIO')) {
                document.getElementById('spec-engine').textContent = '1300cc Petrol';
                document.getElementById('spec-transmission').textContent = 'Automatic Transmission';
                document.getElementById('spec-drive').textContent = 'Front-Wheel Drive';
                document.getElementById('spec-horsepower').textContent = '90 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol';
                
                // Set enhanced enquiry message for MAZDA DEMIO
                const demioMessage = `I'm interested in the MAZDA DEMIO | 2013 priced at KES 660,000.

Vehicle Specifications:
• Engine: 1300cc Petrol
• Transmission: Automatic Transmission
• Drive: Front-Wheel Drive
• Year of Manufacture: 2013
• Condition: Low Mileage
• Additional Features: New Tyres, Ready Documents

This vehicle appears to be in excellent condition with low mileage and recent maintenance. Please provide:
1. Complete service history and maintenance records
2. Current mileage reading
3. Test drive availability
4. Final negotiated pricing
5. Document verification and transfer process

Thank you for your time and I look forward to hearing from you.`;
                
                document.getElementById('enquiry-message').value = demioMessage;
            } else if (vehicleName.includes('Range Rover Sport')) {
                document.getElementById('spec-engine').textContent = '3000cc V6 Diesel-Turbo';
                document.getElementById('spec-transmission').textContent = '8-Speed Automatic';
                document.getElementById('spec-drive').textContent = 'All-Wheel Drive';
                document.getElementById('spec-horsepower').textContent = '350 hp';
                document.getElementById('spec-fuel').textContent = 'Diesel-Turbo';
            } else if (vehicleName.includes('Audi Q8')) {
                document.getElementById('spec-engine').textContent = '3000cc V6 TFSI Hybrid';
                document.getElementById('spec-transmission').textContent = '8-Speed Tiptronic';
                document.getElementById('spec-drive').textContent = 'Quattro AWD';
                document.getElementById('spec-horsepower').textContent = '340 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Hybrid';
            } else if (vehicleName.includes('BMW 5 Series')) {
                document.getElementById('spec-engine').textContent = '2000cc 4-Cylinder Turbo';
                document.getElementById('spec-transmission').textContent = '8-Speed Steptronic';
                document.getElementById('spec-drive').textContent = 'Rear-Wheel Drive';
                document.getElementById('spec-horsepower').textContent = '248 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Turbo';
            } else if (vehicleName.includes('BMW X5 xDrive40i')) {
                document.getElementById('spec-engine').textContent = '3000cc 6-Cylinder Turbo';
                document.getElementById('spec-transmission').textContent = '8-Speed Steptronic';
                document.getElementById('spec-drive').textContent = 'xDrive AWD';
                document.getElementById('spec-horsepower').textContent = '335 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Turbo';
            } else if (vehicleName.includes('Audi A7 Sportback')) {
                document.getElementById('spec-engine').textContent = '3000cc V6 TFSI';
                document.getElementById('spec-transmission').textContent = '7-Speed S tronic';
                document.getElementById('spec-drive').textContent = 'Quattro AWD';
                document.getElementById('spec-horsepower').textContent = '340 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Turbo';
            } else if (vehicleName.includes('Mercedes-Benz C300')) {
                document.getElementById('spec-engine').textContent = '2000cc 4-Cylinder Turbo';
                document.getElementById('spec-transmission').textContent = '9-Speed G-TRONIC';
                document.getElementById('spec-drive').textContent = 'Rear-Wheel Drive';
                document.getElementById('spec-horsepower').textContent = '255 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Turbo';
            } else if (vehicleName.includes('Toyota Hilux Double Cab')) {
                document.getElementById('spec-engine').textContent = '2800cc 4-Cylinder Diesel-Turbo';
                document.getElementById('spec-transmission').textContent = '6-Speed Automatic';
                document.getElementById('spec-drive').textContent = '4WD';
                document.getElementById('spec-horsepower').textContent = '201 hp';
                document.getElementById('spec-fuel').textContent = 'Diesel-Turbo';
            } else if (vehicleName.includes('Toyota Land Cruiser 300')) {
                document.getElementById('spec-engine').textContent = '3300cc V6 Diesel-Turbo';
                document.getElementById('spec-transmission').textContent = '10-Speed Automatic';
                document.getElementById('spec-drive').textContent = 'Full-Time 4WD';
                document.getElementById('spec-horsepower').textContent = '309 hp';
                document.getElementById('spec-fuel').textContent = 'Diesel-Turbo';
            } else if (vehicleName.includes('BMW 7 Series 740i')) {
                document.getElementById('spec-engine').textContent = '3000cc 6-Cylinder Turbo';
                document.getElementById('spec-transmission').textContent = '8-Speed Steptronic';
                document.getElementById('spec-drive').textContent = 'Rear-Wheel Drive';
                document.getElementById('spec-horsepower').textContent = '335 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Turbo';
            } else if (vehicleName.includes('Range Rover Velar P400')) {
                document.getElementById('spec-engine').textContent = '3000cc V6 Supercharged Hybrid';
                document.getElementById('spec-transmission').textContent = '8-Speed Automatic';
                document.getElementById('spec-drive').textContent = 'All-Wheel Drive';
                document.getElementById('spec-horsepower').textContent = '400 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Hybrid';
            } else if (vehicleName.includes('Toyota Camry Hybrid')) {
                document.getElementById('spec-engine').textContent = '2500cc 4-Cylinder Hybrid';
                document.getElementById('spec-transmission').textContent = 'CVT Automatic';
                document.getElementById('spec-drive').textContent = 'Front-Wheel Drive';
                document.getElementById('spec-horsepower').textContent = '208 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Hybrid';
            } else if (vehicleName.includes('BMW S1000RR')) {
                document.getElementById('spec-engine').textContent = '999cc 4-Cylinder';
                document.getElementById('spec-transmission').textContent = '6-Speed Manual';
                document.getElementById('spec-drive').textContent = 'Chain Drive';
                document.getElementById('spec-horsepower').textContent = '207 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol';
            } else if (vehicleName.includes('Audi A4 Premium Plus')) {
                document.getElementById('spec-engine').textContent = '2000cc 4-Cylinder TFSI';
                document.getElementById('spec-transmission').textContent = '7-Speed S tronic';
                document.getElementById('spec-drive').textContent = 'Quattro AWD';
                document.getElementById('spec-horsepower').textContent = '248 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Turbo';
            } else if (vehicleName.includes('Toyota Prado TX-L')) {
                document.getElementById('spec-engine').textContent = '2800cc 4-Cylinder Diesel-Turbo';
                document.getElementById('spec-transmission').textContent = '6-Speed Automatic';
                document.getElementById('spec-drive').textContent = '4WD';
                document.getElementById('spec-horsepower').textContent = '201 hp';
                document.getElementById('spec-fuel').textContent = 'Diesel-Turbo';
            } else if (vehicleName.includes('Porsche 911 Carrera')) {
                document.getElementById('spec-engine').textContent = '3000cc 6-Cylinder Turbo';
                document.getElementById('spec-transmission').textContent = '8-Speed PDK';
                document.getElementById('spec-drive').textContent = 'Rear-Wheel Drive';
                document.getElementById('spec-horsepower').textContent = '379 hp';
                document.getElementById('spec-fuel').textContent = 'Petrol-Turbo';
            } else {
                // Fallback for any unmatched vehicles
                document.getElementById('spec-engine').textContent = '2000cc 4-Cylinder';
                document.getElementById('spec-transmission').textContent = '6-Speed Automatic';
                document.getElementById('spec-drive').textContent = 'Front-Wheel Drive';
                document.getElementById('spec-horsepower').textContent = '150 hp';
                document.getElementById('spec-fuel').textContent = fuel || 'Petrol';
            }
            
            // Set common specifications that are always available
            document.getElementById('spec-mileage').textContent = mileage || 'Low Mileage';
            document.getElementById('spec-year').textContent = year || 'Recent Model';
            
            // Hide all premium feature sections for other vehicles
            const allFeatureSections = document.querySelectorAll('[id$="-features"]');
            allFeatureSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Set enhanced enquiry message with specifications
            const engine = document.getElementById('spec-engine').textContent;
            const transmission = document.getElementById('spec-transmission').textContent;
            const horsepower = document.getElementById('spec-horsepower').textContent;
            
            const defaultMessage = `I'm interested in the ${vehicleName}.

Key specifications:
• Engine: ${engine}
• Transmission: ${transmission}
• Power: ${horsepower}
• Mileage: ${mileage || 'As shown'}
• Year: ${year || 'As shown'}

Please contact me with more information about this vehicle including:
- Service history
- Financing options
- Test drive availability
- Final pricing

Looking forward to hearing from you.`;
            
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
