// JavaScript for Open Roads Motors website

document.addEventListener('DOMContentLoaded', function() {
    // Set initial theme based on user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = savedTheme;
        updateThemeToggleIcon(savedTheme);
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('light-mode')) {
                document.body.className = 'dark-mode';
                localStorage.setItem('theme', 'dark-mode');
            } else {
                document.body.className = 'light-mode';
                localStorage.setItem('theme', 'light-mode');
            }
            updateThemeToggleIcon(document.body.className);
        });
    }

    // Update theme toggle icon based on current theme
    function updateThemeToggleIcon(theme) {
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            if (theme === 'dark-mode') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
        }
    }

    // Mobile navigation toggle
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Dropdown functionality on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (window.innerWidth < 992) {
        dropdowns.forEach(dropdown => {
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            
            if (dropdownToggle) {
                dropdownToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }
        });
    }

    // Search panel toggle
    const searchToggle = document.getElementById('search-toggle');
    const searchPanel = document.getElementById('advanced-search');
    
    if (searchToggle && searchPanel) {
        searchToggle.addEventListener('click', function() {
            searchPanel.classList.toggle('active');
        });
    }

    // Close search panel when clicking outside
    document.addEventListener('click', function(e) {
        if (searchPanel && searchPanel.classList.contains('active')) {
            if (!searchPanel.contains(e.target) && e.target !== searchToggle) {
                searchPanel.classList.remove('active');
            }
        }
    });

    // Search category switch
    const searchCategory = document.getElementById('search-category');
    const vehicleFields = document.getElementById('vehicle-fields');
    const realEstateFields = document.getElementById('real-estate-fields');
    
    if (searchCategory && vehicleFields && realEstateFields) {
        searchCategory.addEventListener('change', function() {
            if (this.value === 'vehicles') {
                vehicleFields.style.display = 'flex';
                realEstateFields.style.display = 'none';
            } else {
                vehicleFields.style.display = 'none';
                realEstateFields.style.display = 'flex';
            }
        });
    }

    // Hero slider functionality
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        
        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                goToSlide(currentSlide - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                goToSlide(currentSlide + 1);
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
        });
        
        // Auto slide
        setInterval(function() {
            if (!document.hidden) {
                goToSlide(currentSlide + 1);
            }
        }, 5000);
    }

    // Document-level event delegation for view and buy buttons
    // This allows the functionality to work for all cards including dynamically added ones
    document.addEventListener('click', function(e) {
        // Handle view button clicks
        if (e.target.closest('.btn-view')) {
            const viewButton = e.target.closest('.btn-view');
            const cardId = viewButton.getAttribute('data-target');
            handleViewButtonClick(cardId);
        }
        
        // Handle buy now button clicks
        if (e.target.closest('.btn-buy')) {
            const buyButton = e.target.closest('.btn-buy');
            const card = buyButton.closest('.card');
            if (card) {
                const itemId = card.getAttribute('data-id');
                const itemType = itemId.includes('vehicle') ? 'vehicle' : 'property';
                handleBuyNow(itemId, itemType);
            }
        }
    });

    // Gallery modal functionality
    const galleryModal = document.querySelector('.gallery-modal');
    let currentGalleryImage = 0;
    let galleryImages = [];
    let currentItemId = "";
    let currentItemType = "";
    
    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleViewButtonClick(cardId) {
        const card = document.querySelector(`.card[data-id="${cardId}"]`);
        
        if (card) {
            const images = card.querySelectorAll('.hidden-gallery img');
            
            // If no gallery images, check if there's at least a main image to show
            if (images.length === 0) {
                const mainImage = card.querySelector('.card-image img');
                if (mainImage) {
                    const galleryContainerDiv = document.createElement('div');
                    galleryContainerDiv.className = 'hidden-gallery';
                    galleryContainerDiv.appendChild(mainImage.cloneNode(true));
                    card.appendChild(galleryContainerDiv);
                    
                    // Now try again to get the image
                    handleViewButtonClick(cardId);
                    return;
                }
            }
            
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            const description = card.querySelector('.location') ? 
                card.querySelector('.location').textContent : '';
            
            // Ensure we have the right modal elements
            const galleryImage = galleryModal.querySelector('.gallery-image');
            const galleryTitle = galleryModal.querySelector('.gallery-title');
            const galleryPrice = galleryModal.querySelector('.gallery-price');
            const galleryDescription = galleryModal.querySelector('.gallery-description');
            const galleryThumbnails = galleryModal.querySelector('.gallery-thumbnails');
            
            if (!galleryImage || !galleryTitle || !galleryPrice || !galleryThumbnails) {
                console.error('Gallery modal is missing required elements');
                return;
            }
            
            // Store the current item details for Buy Now functionality
            currentItemId = cardId;
            currentItemType = cardId.includes('vehicle') ? 'vehicle' : 'property';
            
            galleryImages = Array.from(images);
            galleryTitle.textContent = title;
            galleryPrice.textContent = price;
            if (galleryDescription) {
                galleryDescription.textContent = description;
            }
            
            // Generate thumbnails
            galleryThumbnails.innerHTML = '';
            galleryImages.forEach((img, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'gallery-thumb';
                thumb.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
                
                thumb.addEventListener('click', function() {
                    showGalleryImage(index);
                });
                
                galleryThumbnails.appendChild(thumb);
            });
            
            showGalleryImage(0);
            galleryModal.classList.add('active');
            
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
            
            // Set focus to the modal for accessibility
            setTimeout(() => {
                const galleryClose = galleryModal.querySelector('.gallery-close');
                if (galleryClose) galleryClose.focus();
            }, 100);
        }
    }
    
    function showGalleryImage(index) {
        if (!galleryImages.length) return;
        
        currentGalleryImage = index;
        const galleryImage = galleryModal.querySelector('.gallery-image');
        
        // Add fade transition effect
        galleryImage.classList.add('fade');
        
        setTimeout(() => {
            // Update main image
            galleryImage.src = galleryImages[index].src;
            galleryImage.alt = galleryImages[index].alt;
            galleryImage.classList.remove('fade');
            
            // Update active thumbnail
            const thumbnails = galleryModal.querySelectorAll('.gallery-thumb');
            thumbnails.forEach((thumb, i) => {
                if (i === index) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
        }, 200);
    }
    
    // Touch/swipe support for gallery
    if (galleryModal) {
        const galleryMain = galleryModal.querySelector('.gallery-main');
        if (galleryMain) {
            galleryMain.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            galleryMain.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }
        
        // Setup other gallery controls
        const galleryClose = galleryModal.querySelector('.gallery-close');
        const galleryPrev = galleryModal.querySelector('.gallery-arrow.prev');
        const galleryNext = galleryModal.querySelector('.gallery-arrow.next');
        const buyNowBtn = galleryModal.querySelector('.gallery-btn.primary');
        const contactSellerBtn = galleryModal.querySelector('.gallery-btn.secondary');
        
        // Buy Now button in gallery
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function() {
                // Close gallery modal before opening checkout
                closeGalleryModal();
                handleBuyNow(currentItemId, currentItemType);
            });
        }
        
        // Contact Seller button in gallery
        if (contactSellerBtn) {
            contactSellerBtn.addEventListener('click', function() {
                window.location.href = `contact.html?item=${currentItemId}&type=${currentItemType}`;
            });
        }
        
        // Previous image
        if (galleryPrev) {
            galleryPrev.addEventListener('click', function() {
                if (!galleryImages.length) return;
                const newIndex = currentGalleryImage - 1 < 0 ? galleryImages.length - 1 : currentGalleryImage - 1;
                showGalleryImage(newIndex);
            });
        }
        
        // Next image
        if (galleryNext) {
            galleryNext.addEventListener('click', function() {
                if (!galleryImages.length) return;
                const newIndex = currentGalleryImage + 1 >= galleryImages.length ? 0 : currentGalleryImage + 1;
                showGalleryImage(newIndex);
            });
        }
        
        // Close gallery
        if (galleryClose) {
            galleryClose.addEventListener('click', function() {
                closeGalleryModal();
            });
        }
        
        // Close gallery when clicking outside the content
        galleryModal.addEventListener('click', function(e) {
            if (e.target === galleryModal) {
                closeGalleryModal();
            }
        });
    }
    
    // Keyboard navigation for gallery
    document.addEventListener('keydown', function(e) {
        if (!galleryModal || !galleryModal.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeGalleryModal();
                break;
            case 'ArrowLeft':
                if (!galleryImages.length) return;
                const prevIndex = currentGalleryImage - 1 < 0 ? galleryImages.length - 1 : currentGalleryImage - 1;
                showGalleryImage(prevIndex);
                break;
            case 'ArrowRight':
                if (!galleryImages.length) return;
                const nextIndex = currentGalleryImage + 1 >= galleryImages.length ? 0 : currentGalleryImage + 1;
                showGalleryImage(nextIndex);
                break;
        }
    });
    
    function closeGalleryModal() {
        if (!galleryModal) return;
        galleryModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Return focus to the button that opened the modal
        const button = document.querySelector(`.btn-view[data-target="${currentItemId}"]`);
        if (button) button.focus();
    }
    
    function handleSwipe() {
        if (!galleryImages.length) return;
        
        // Minimum swipe distance threshold (pixels)
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next image
            const newIndex = currentGalleryImage + 1 >= galleryImages.length ? 0 : currentGalleryImage + 1;
            showGalleryImage(newIndex);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous image
            const newIndex = currentGalleryImage - 1 < 0 ? galleryImages.length - 1 : currentGalleryImage - 1;
            showGalleryImage(newIndex);
        }
    }

    // Handle Buy Now process
    function handleBuyNow(itemId, itemType) {
        // Create overlay for the checkout process
        const overlay = document.createElement('div');
        overlay.className = 'checkout-overlay';
        
        const checkoutModal = document.createElement('div');
        checkoutModal.className = 'checkout-modal';
        checkoutModal.setAttribute('role', 'dialog');
        checkoutModal.setAttribute('aria-labelledby', 'checkout-title');
        
        // Get item details
        const item = document.querySelector(`.card[data-id="${itemId}"]`);
        const itemTitle = item ? item.querySelector('h3').textContent : 'Item';
        const itemPrice = item ? item.querySelector('.price').textContent : '';
        const itemImage = item && item.querySelector('.card-image img') ? 
            item.querySelector('.card-image img').src : '';
        
        // Create checkout content with image
        checkoutModal.innerHTML = `
            <div class="checkout-header">
                <h2 id="checkout-title">Complete Your Purchase</h2>
                <button class="checkout-close" aria-label="Close checkout"><i class="fas fa-times"></i></button>
            </div>
            <div class="checkout-content">
                <div class="checkout-item">
                    <div class="checkout-item-detail">
                        ${itemImage ? `<img src="${itemImage}" alt="${itemTitle}" class="checkout-item-image">` : ''}
                        <div>
                            <h3>${itemTitle}</h3>
                            <p class="checkout-price">${itemPrice}</p>
                        </div>
                    </div>
                </div>
                <form id="checkout-form">
                    <div class="form-group">
                        <label for="checkout-name">Full Name</label>
                        <input type="text" id="checkout-name" required>
                    </div>
                    <div class="form-group">
                        <label for="checkout-email">Email</label>
                        <input type="email" id="checkout-email" required>
                    </div>
                    <div class="form-group">
                        <label for="checkout-phone">Phone</label>
                        <input type="tel" id="checkout-phone" required>
                    </div>
                    <div class="form-group">
                        <label for="checkout-payment">Payment Method</label>
                        <select id="checkout-payment" required>
                            <option value="">Select Payment Method</option>
                            <option value="mpesa">M-Pesa</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="card">Credit/Debit Card</option>
                            <option value="financing">Financing/Mortgage</option>
                        </select>
                    </div>
                    <div class="checkout-buttons">
                        <button type="button" class="btn-secondary checkout-cancel">Cancel</button>
                        <button type="submit" class="btn-primary">Proceed to Payment</button>
                    </div>
                </form>
            </div>
        `;
        
        overlay.appendChild(checkoutModal);
        document.body.appendChild(overlay);
        
        // Activate the modal
        setTimeout(() => {
            overlay.classList.add('active');
            // Set focus to the close button for accessibility
            checkoutModal.querySelector('.checkout-close').focus();
        }, 10);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Add event listeners to the checkout modal
        const closeBtn = checkoutModal.querySelector('.checkout-close');
        const cancelBtn = checkoutModal.querySelector('.checkout-cancel');
        const checkoutForm = checkoutModal.querySelector('#checkout-form');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeCheckoutModal();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                closeCheckoutModal();
            });
        }
        
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('checkout-name').value;
                const email = document.getElementById('checkout-email').value;
                const phone = document.getElementById('checkout-phone').value;
                const paymentMethod = document.getElementById('checkout-payment').value;
                
                // Validate the phone number format
                const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
                if (!phoneRegex.test(phone)) {
                    alert('Please enter a valid phone number (10-15 digits)');
                    return;
                }
                
                // Show processing message
                checkoutModal.innerHTML = `
                    <div class="checkout-success">
                        <i class="fas fa-spinner fa-spin"></i>
                        <h2>Processing Your Purchase</h2>
                        <p>Please wait while we process your request...</p>
                    </div>
                `;
                
                // Simulate processing
                setTimeout(function() {
                    // Show success message
                    checkoutModal.innerHTML = `
                        <div class="checkout-success">
                            <i class="fas fa-check-circle"></i>
                            <h2>Purchase Initiated!</h2>
                            <p>Thank you, ${name}! Our team will contact you shortly at ${phone} to complete your purchase.</p>
                            <button class="btn-primary close-success">Close</button>
                        </div>
                    `;
                    
                    const closeSuccessBtn = checkoutModal.querySelector('.close-success');
                    if (closeSuccessBtn) {
                        closeSuccessBtn.addEventListener('click', function() {
                            closeCheckoutModal();
                        });
                        
                        // Set focus for accessibility
                        closeSuccessBtn.focus();
                    }
                }, 2000);
            });
        }
        
        // Close checkout when clicking outside
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeCheckoutModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!overlay.parentNode) return; // Modal is closed
            
            if (e.key === 'Escape') {
                closeCheckoutModal();
            }
        });
        
        function closeCheckoutModal() {
            overlay.classList.remove('active');
            
            // Wait for animation to complete before removing from DOM
            setTimeout(() => {
                if (overlay.parentNode) {
                    document.body.removeChild(overlay);
                }
                document.body.style.overflow = 'auto';
            }, 300);
            
            // Return focus to element that opened the modal
            const button = document.querySelector(`.card[data-id="${itemId}"] .btn-buy`);
            if (button) button.focus();
        }
    }

    // Sticky header
    const header = document.querySelector('header');
    
    if (header) {
        const headerHeight = header.offsetHeight;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // FAB (Floating Action Button) functionality
    const fabButton = document.querySelector('.main-fab');
    const fabOptions = document.querySelector('.fab-options');
    
    if (fabButton && fabOptions) {
        fabButton.addEventListener('click', function() {
            fabOptions.classList.toggle('active');
            fabButton.classList.toggle('active');
        });
        
        // Close FAB options when clicking outside
        document.addEventListener('click', function(e) {
            if (!fabButton.contains(e.target) && !fabOptions.contains(e.target)) {
                fabOptions.classList.remove('active');
                fabButton.classList.remove('active');
            }
        });
    }
});