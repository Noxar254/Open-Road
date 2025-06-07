// Script for handling Buy Now buttons in property pagination pages
document.addEventListener('DOMContentLoaded', function() {
    // Add data-id attributes to property cards if they don't have them
    document.querySelectorAll('.card').forEach((card, index) => {
        if (!card.hasAttribute('data-id')) {
            const propertyName = card.querySelector('h3').textContent;
            const propertyId = 'property-' + (index + 1);
            card.setAttribute('data-id', propertyId);
        }
    });

    // Add Buy Now button functionality
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const propertyId = card.getAttribute('data-id');
            const propertyName = card.querySelector('h3').textContent;
            const propertyImage = card.querySelector('.card-image img').src;
            
            // Set modal title
            document.getElementById('purchase-modal-title').textContent = propertyName + ' - Purchase Enquiry';
            
            // Set hidden form values
            document.getElementById('enquiry-property-id').value = propertyId;
            document.getElementById('enquiry-property-name').value = propertyName;
            
            // Set modal image
            document.getElementById('purchase-modal-image').src = propertyImage;
            
            // Set property specs from card data if available
            const location = card.querySelector('.location');
            if (location) {
                document.getElementById('spec-property-location').textContent = location.textContent.trim();
            }
            
            const price = card.querySelector('.price');
            if (price) {
                document.getElementById('spec-property-price').textContent = price.textContent.trim();
            }
            
            const details = card.querySelectorAll('.property-details .detail');
            details.forEach(detail => {
                const text = detail.textContent.trim();
                if (text.includes('bed') || text.includes('Bed')) {
                    document.getElementById('spec-property-bedrooms').textContent = text;
                } else if (text.includes('bath') || text.includes('Bath')) {
                    document.getElementById('spec-property-bathrooms').textContent = text;
                } else if (text.includes('sqft') || text.includes('acres') || text.includes('sq')) {
                    document.getElementById('spec-property-area').textContent = text;
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
            
            // Open property modal
            document.getElementById('purchase-modal-title').textContent = title + ' - Purchase Enquiry';
            document.getElementById('enquiry-property-id').value = title;
            document.getElementById('enquiry-property-name').value = title;
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
