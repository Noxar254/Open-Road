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
            
            // Set vehicle specs from card data if available
            const cardDetails = card.querySelectorAll('.card-details span');
            cardDetails.forEach(detail => {
                const text = detail.textContent.trim();
                if (text.includes('202')) { // Year
                    document.getElementById('spec-year').textContent = text;
                } else if (text.includes('km')) { // Mileage
                    document.getElementById('spec-mileage').textContent = text;
                } else if (text.includes('Petrol') || text.includes('Diesel') || text.includes('Hybrid')) { // Fuel
                    document.getElementById('spec-fuel').textContent = text;
                }
            });
            
            // Show the modal
            document.getElementById('purchase-modal').style.display = 'flex';
        });
    });

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
            document.getElementById('purchase-modal').style.display = 'flex';
        });
    }

    // Close modals when clicking close button
    const purchaseModalClose = document.querySelector('.purchase-modal-close');
    if (purchaseModalClose) {
        purchaseModalClose.addEventListener('click', function() {
            document.getElementById('purchase-modal').style.display = 'none';
        });
    }
      // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const purchaseModal = document.getElementById('purchase-modal');
        
        if (event.target === purchaseModal) {
            purchaseModal.style.display = 'none';
        }
    });
    
    // Note: Form submission is handled by FormHandler in firebase-form-handler.js
});
