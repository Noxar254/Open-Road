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

    // Initialize Google Maps
    initializeMap();
    
    // Mobile menu functionality - improved to work across all pages
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    // First try with the standard navigation dropdown
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle the navigation with active class
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active')) {
                // Check if click is outside nav and not on the toggle
                const clickedOnNav = nav.contains(e.target);
                const clickedOnMenuToggle = menuToggle.contains(e.target);
                
                if (!clickedOnNav && !clickedOnMenuToggle && e.target !== menuToggle) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    }

    // For pages using the separate mobile menu implementation
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle mobile menu with active class
            mobileMenu.classList.add('active');
            menuToggle.classList.add('active');
            document.body.classList.add('menu-open');
        });
    }

    // Handle close button for mobile menu
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('active')) {
                const clickedOnMobileMenu = mobileMenu.contains(e.target);
                const clickedOnMenuToggle = menuToggle && menuToggle.contains(e.target);
                
                if (!clickedOnMobileMenu && !clickedOnMenuToggle && e.target !== menuToggle) {
                    mobileMenu.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    }

    // Dropdown functionality for mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = this.closest('.dropdown');
                
                // Close all other dropdowns
                const allDropdowns = document.querySelectorAll('.dropdown.active');
                allDropdowns.forEach(item => {
                    if (item !== dropdown) {
                        item.classList.remove('active');
                    }
                });
                
                // Toggle the current dropdown
                dropdown.classList.toggle('active');
            }
        });
    });

    // Handle window resize events to ensure dropdowns work correctly after resize
    window.addEventListener('resize', function() {
        // If window width changes between mobile/desktop breakpoints
        const dropdowns = document.querySelectorAll('.dropdown');
        
        // Remove active class from all dropdowns when resizing
        if (window.innerWidth >= 992) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

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

    // Handle search form submission
    const searchForm = document.getElementById('search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the search category (vehicles or real-estate)
            const searchCategoryValue = document.getElementById('search-category').value;
            let targetPage = '';
            let searchParams = new URLSearchParams();
            
            if (searchCategoryValue === 'vehicles') {
                targetPage = 'vehicles.html';
                
                // Get vehicle search parameters
                const vehicleType = document.getElementById('vehicle-type').value;
                const vehicleMake = document.getElementById('vehicle-make').value;
                const minPrice = document.getElementById('min-price').value;
                const maxPrice = document.getElementById('max-price').value;
                const year = document.getElementById('year').value;
                
                // Add parameters to URL if they have values
                if (vehicleType) searchParams.append('type', vehicleType);
                if (vehicleMake) searchParams.append('make', vehicleMake);
                if (minPrice) searchParams.append('minPrice', minPrice);
                if (maxPrice) searchParams.append('maxPrice', maxPrice);
                if (year) searchParams.append('year', year);
                
            } else if (searchCategoryValue === 'real-estate') {
                targetPage = 'properties.html';
                
                // Get real estate search parameters
                const propertyType = document.getElementById('property-type').value;
                const location = document.getElementById('location').value;
                const propertyMinPrice = document.getElementById('property-min-price').value;
                const propertyMaxPrice = document.getElementById('property-max-price').value;
                const bedrooms = document.getElementById('bedrooms').value;
                
                // Add parameters to URL if they have values
                if (propertyType) searchParams.append('type', propertyType);
                if (location) searchParams.append('location', location);
                if (propertyMinPrice) searchParams.append('minPrice', propertyMinPrice);
                if (propertyMaxPrice) searchParams.append('maxPrice', propertyMaxPrice);
                if (bedrooms) searchParams.append('bedrooms', bedrooms);
            }
            
            // Construct the final URL with search parameters
            const searchParamsString = searchParams.toString();
            const targetURL = searchParamsString ? `${targetPage}?${searchParamsString}` : targetPage;
            
            // Redirect to the search results page
            window.location.href = targetURL;
        });
    }

    // Process URL parameters on page load to pre-fill filters
    function processURLParameters() {
        // Check if we're on a search results page (vehicles.html or properties.html)
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'vehicles.html' || currentPage === 'properties.html') {
            const urlParams = new URLSearchParams(window.location.search);
            
            // If we're on the vehicles page
            if (currentPage === 'vehicles.html') {
                // Pre-fill the filters from URL parameters
                if (urlParams.has('type')) {
                    const typeSelector = document.getElementById('vehicle-type');
                    if (typeSelector) typeSelector.value = urlParams.get('type');
                }
                
                if (urlParams.has('make')) {
                    const makeSelector = document.getElementById('vehicle-make');
                    if (makeSelector) makeSelector.value = urlParams.get('make');
                }
                
                if (urlParams.has('minPrice')) {
                    const minPriceInput = document.getElementById('min-price');
                    if (minPriceInput) minPriceInput.value = urlParams.get('minPrice');
                }
                
                if (urlParams.has('maxPrice')) {
                    const maxPriceInput = document.getElementById('max-price');
                    if (maxPriceInput) maxPriceInput.value = urlParams.get('maxPrice');
                }
                
                if (urlParams.has('year')) {
                    const yearSelector = document.getElementById('year');
                    if (yearSelector) yearSelector.value = urlParams.get('year');
                }
                
                // Set the search category to vehicles
                const searchCategory = document.getElementById('search-category');
                if (searchCategory) searchCategory.value = 'vehicles';
                
                // Make sure vehicle fields are visible
                const vehicleFields = document.getElementById('vehicle-fields');
                const realEstateFields = document.getElementById('real-estate-fields');
                if (vehicleFields && realEstateFields) {
                    vehicleFields.style.display = 'flex';
                    realEstateFields.style.display = 'none';
                }
            }
            
            // If we're on the properties page
            else if (currentPage === 'properties.html') {
                // Pre-fill the filters from URL parameters
                if (urlParams.has('type')) {
                    const typeSelector = document.getElementById('property-type');
                    if (typeSelector) typeSelector.value = urlParams.get('type');
                }
                
                if (urlParams.has('location')) {
                    const locationSelector = document.getElementById('location');
                    if (locationSelector) locationSelector.value = urlParams.get('location');
                }
                
                if (urlParams.has('minPrice')) {
                    const minPriceInput = document.getElementById('property-min-price');
                    if (minPriceInput) minPriceInput.value = urlParams.get('minPrice');
                }
                
                if (urlParams.has('maxPrice')) {
                    const maxPriceInput = document.getElementById('property-max-price');
                    if (maxPriceInput) maxPriceInput.value = urlParams.get('maxPrice');
                }
                
                if (urlParams.has('bedrooms')) {
                    const bedroomsSelector = document.getElementById('bedrooms');
                    if (bedroomsSelector) bedroomsSelector.value = urlParams.get('bedrooms');
                }
                
                // Set the search category to real-estate
                const searchCategory = document.getElementById('search-category');
                if (searchCategory) searchCategory.value = 'real-estate';
                
                // Make sure real estate fields are visible
                const vehicleFields = document.getElementById('vehicle-fields');
                const realEstateFields = document.getElementById('real-estate-fields');
                if (vehicleFields && realEstateFields) {
                    vehicleFields.style.display = 'none';
                    realEstateFields.style.display = 'flex';
                }            }
            
            // Note: Search panel will only show when user clicks the search toggle button
            // The form fields are pre-filled from URL parameters but panel remains hidden
        }
    }
    
    // Call the function to process URL parameters on page load
    processURLParameters();

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
            console.log('View button clicked for:', cardId); // Debug log
            
            // Get direct reference to the gallery modal
            const galleryModal = document.querySelector('.gallery-modal');
            
            if (!galleryModal) {
                console.error('Gallery modal not found in the DOM');
                return;
            }
            
            // First handle the view button click
            handleViewButtonClick(cardId);
            
            // Double-check that the modal is open after a small delay
            setTimeout(() => {
                if (!galleryModal.classList.contains('active')) {
                    console.log('Forcing modal to open');
                    galleryModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent body scrolling
                }
            }, 50);
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
            
            // Get the gallery modal
            const galleryModal = document.querySelector('.gallery-modal');
            
            if (!galleryModal) {
                console.error('Gallery modal not found in the DOM');
                return;
            }
            
            // Get gallery elements - updated to match index.html structure
            const galleryTitle = galleryModal.querySelector('.gallery-title');
            const galleryImage = galleryModal.querySelector('.gallery-image');
            const galleryPrice = galleryModal.querySelector('.gallery-price');
            const galleryDesc = galleryModal.querySelector('.gallery-description');
            const galleryThumbnails = galleryModal.querySelector('.gallery-thumbnails');
            
            if (!galleryImage || !galleryTitle || !galleryPrice || !galleryThumbnails) {
                console.error('Gallery modal is missing required elements');
                return;
            }
            
            // Store the current item details for Buy Now functionality
            currentItemId = cardId;
            currentItemType = cardId.includes('vehicle') ? 'vehicle' : 'property';
            
            // Set gallery content
            galleryTitle.textContent = title;
            galleryPrice.textContent = price;
            if (galleryDesc) {
                galleryDesc.textContent = description;
            }
            
            // Clear thumbnails
            galleryThumbnails.innerHTML = '';
            
            // Save gallery images
            galleryImages = Array.from(images);
            
            // Create thumbnails
            galleryImages.forEach((img, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'gallery-thumb';
                thumb.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
                
                thumb.addEventListener('click', function() {
                    showGalleryImage(index);
                });
                
                galleryThumbnails.appendChild(thumb);
            });
            
            // Show first image
            showGalleryImage(0);
            
            // Open the modal
            galleryModal.classList.add('active');
            
            // Prevent body scrolling
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
    }    // Handle Buy Now process
    function handleBuyNow(itemId, itemType) {
        if (itemType === 'vehicle') {
            openPurchaseModal(itemId);
        } else {
            // For properties, let the firebase-form-handler.js handle the property modal
            // This prevents dual modal opens
            return;
        }
    }

    // Purchase Modal functionality for vehicles
    const purchaseModal = document.getElementById('purchase-modal');
    
    // Function to open the purchase modal with vehicle specs
    function openPurchaseModal(vehicleId) {
        if (!purchaseModal) return;
        
        const vehicle = document.querySelector(`.card[data-id="${vehicleId}"]`);
        if (!vehicle) return;
        
        // Get vehicle details
        const vehicleName = vehicle.querySelector('h3').textContent;
        const vehicleImage = vehicle.querySelector('.card-image img').src;
        const vehicleYear = vehicle.querySelector('.card-details span:nth-child(1)').textContent.trim().replace('<i class="fas fa-calendar-alt"></i> ', '');
        const vehicleMileage = vehicle.querySelector('.card-details span:nth-child(2)').textContent.trim().replace('<i class="fas fa-tachometer-alt"></i> ', '');
        const vehicleFuel = vehicle.querySelector('.card-details span:nth-child(3)').textContent.trim().replace('<i class="fas fa-gas-pump"></i> ', '');
        
        // Set modal title
        document.getElementById('purchase-modal-title').textContent = `Purchase Enquiry - ${vehicleName}`;
        
        // Set vehicle image
        document.getElementById('purchase-modal-image').src = vehicleImage;
        document.getElementById('purchase-modal-image').alt = vehicleName;
        
        // Set the form hidden fields
        document.getElementById('enquiry-vehicle-id').value = vehicleId;
        document.getElementById('enquiry-vehicle-name').value = vehicleName;        // Set vehicle specs based on vehicle type
        if (vehicleId === 'kdq-vehicle') { // Mercedes Benz KDQ GLC 250
            document.getElementById('spec-engine').textContent = '2000cc Petrol-Turbocharged';
            document.getElementById('spec-transmission').textContent = '9-Speed Automatic';
            document.getElementById('spec-drive').textContent = 'All-Wheel Drive (4MATIC)';
            document.getElementById('spec-mileage').textContent = '95,000 km';
            document.getElementById('spec-horsepower').textContent = '211 hp';
            document.getElementById('spec-fuel').textContent = 'Petrol-Turbocharged';
            document.getElementById('spec-year').textContent = '2016';
            
            // Show KDQ premium features
            const kdqFeatures = document.getElementById('kdq-features');
            if (kdqFeatures) {
                kdqFeatures.style.display = 'block';
            }
        } else if (vehicleId === 'kcy-vehicle') { // Mazda Demio KCY
            document.getElementById('spec-engine').textContent = '1300cc Petrol';
            document.getElementById('spec-transmission').textContent = 'Automatic Transmission';
            document.getElementById('spec-drive').textContent = 'Front-Wheel Drive';
            document.getElementById('spec-mileage').textContent = 'Low Mileage';
            document.getElementById('spec-horsepower').textContent = '90 hp';
            document.getElementById('spec-fuel').textContent = 'Petrol';
            document.getElementById('spec-year').textContent = '2013';
            
            // Hide premium features for regular vehicles
            const kdqFeatures = document.getElementById('kdq-features');
            if (kdqFeatures) {
                kdqFeatures.style.display = 'none';
            }
        } else if (vehicleId.includes('vehicle-1')) { // Toyota TX PRADO
            document.getElementById('spec-engine').textContent = '2.7L Petrol';
            document.getElementById('spec-transmission').textContent = '6-Speed Automatic';
            document.getElementById('spec-drive').textContent = '4x4';
            document.getElementById('spec-mileage').textContent = vehicleMileage;
            document.getElementById('spec-horsepower').textContent = '160 hp';
            document.getElementById('spec-fuel').textContent = vehicleFuel;
            document.getElementById('spec-year').textContent = vehicleYear;        } else if (vehicleId.includes('vehicle-2')) { // Chrysler SUV
            document.getElementById('spec-engine').textContent = '3.5L V6';
            document.getElementById('spec-transmission').textContent = '6-Speed Manual (STI)';
            document.getElementById('spec-drive').textContent = '4x4';
            document.getElementById('spec-mileage').textContent = vehicleMileage;
            document.getElementById('spec-horsepower').textContent = 'V8 HEMI: 340-425 hp (SRT8)';
            document.getElementById('spec-fuel').textContent = vehicleFuel;
            document.getElementById('spec-year').textContent = vehicleYear;        } else if (vehicleId.includes('vehicle-3')) { // Mitsubishi Canter
            document.getElementById('spec-engine').textContent = '4D33 – 4.2L Diesel';
            document.getElementById('spec-transmission').textContent = '5-speed manual';
            document.getElementById('spec-drive').textContent = 'Rear-Wheel Drive';
            document.getElementById('spec-mileage').textContent = '290,100 km';
            document.getElementById('spec-horsepower').textContent = '120–180 hp';
            document.getElementById('spec-fuel').textContent = '4D34 – 3.9L Diesel';
            document.getElementById('spec-year').textContent = '2006';        } else if (vehicleId.includes('vehicle-4')) { // Mercedes Benz
            document.getElementById('spec-engine').textContent = '1.6L Engine';
            document.getElementById('spec-transmission').textContent = '7-speed dual-clutch automatic transmission';
            document.getElementById('spec-drive').textContent = 'Rear-Wheel Drive';
            document.getElementById('spec-mileage').textContent = vehicleMileage;
            document.getElementById('spec-horsepower').textContent = '120 hp';
            document.getElementById('spec-fuel').textContent = vehicleFuel;
            document.getElementById('spec-year').textContent = vehicleYear;        } else if (vehicleId.includes('vehicle-5')) { // 2019 Porsche Cayenne
            document.getElementById('spec-engine').textContent = '3.0L V6 Turbocharged Petrol Engine';
            document.getElementById('spec-transmission').textContent = '8-Speed Tiptronic S Automatic';
            document.getElementById('spec-drive').textContent = 'All-Wheel Drive (AWD)';
            document.getElementById('spec-mileage').textContent = vehicleMileage;
            document.getElementById('spec-horsepower').textContent = '335 hp';
            document.getElementById('spec-fuel').textContent = vehicleFuel;
            document.getElementById('spec-year').textContent = vehicleYear;        } else if (vehicleId.includes('vehicle-6')) { // 2006 Toyota Land Cruiser Prado TX J120
            document.getElementById('spec-engine').textContent = '2700cc Petrol Engine';
            document.getElementById('spec-transmission').textContent = 'Automatic Transmission';
            document.getElementById('spec-drive').textContent = '4WD System';
            document.getElementById('spec-mileage').textContent = vehicleMileage;
            document.getElementById('spec-horsepower').textContent = '163 hp';
            document.getElementById('spec-fuel').textContent = vehicleFuel;
            document.getElementById('spec-year').textContent = vehicleYear;
        } else {
            // Default values for other vehicles
            document.getElementById('spec-engine').textContent = 'Information Available On Request';
            document.getElementById('spec-transmission').textContent = 'Information Available On Request';
            document.getElementById('spec-drive').textContent = 'Information Available On Request';
            document.getElementById('spec-mileage').textContent = vehicleMileage;
            document.getElementById('spec-horsepower').textContent = 'Information Available On Request';
            document.getElementById('spec-fuel').textContent = vehicleFuel;
            document.getElementById('spec-year').textContent = vehicleYear;
        }
        
        // Open the modal
        purchaseModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Set default message text
        const defaultMessage = `I'm interested in the ${vehicleName}. Please contact me with more information.`;
        document.getElementById('enquiry-message').value = defaultMessage;
    }
    
    // Setup event listeners for purchase modal
    if (purchaseModal) {
        const closeButton = purchaseModal.querySelector('.purchase-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', closePurchaseModal);
        }
        
        // Close modal when clicking outside content
        purchaseModal.addEventListener('click', function(e) {
            if (e.target === purchaseModal) {
                closePurchaseModal();
            }
        });
        
        // Handle form submission
        const enquiryForm = document.getElementById('vehicle-enquiry-form');
        if (enquiryForm) {
            enquiryForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('enquiry-name').value;
                const phone = document.getElementById('enquiry-phone').value;
                
                // Show success message
                purchaseModal.querySelector('.purchase-modal-body').innerHTML = `
                    <div class="enquiry-success" style="text-align: center; padding: 50px 20px;">
                        <i class="fas fa-check-circle" style="font-size: 60px; color: #4CAF50; margin-bottom: 20px;"></i>
                        <h2>Enquiry Sent Successfully!</h2>
                        <p>Thank you, ${name}! Our sales team will contact you shortly at ${phone} to discuss your vehicle of interest.</p>
                        <button class="form-submit-btn" style="max-width: 200px; margin: 20px auto 0;" onclick="closePurchaseModal()">Close</button>
                    </div>
                `;
            });
        }
        
        // Handle keydown event (Escape key)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && purchaseModal.classList.contains('active')) {
                closePurchaseModal();
            }
        });
    }
    
    // Function to close the purchase modal
    function closePurchaseModal() {
        if (!purchaseModal) return;
        
        purchaseModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
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

// Google Maps integration for location section
function initializeMap() {
    const mapContainer = document.getElementById('location-map');
    
    if (!mapContainer) return; // Only initialize if the map container exists
    
    // Location coordinates - Embakasi Fedha Stage, Nairobi
    const businessLocation = { lat: -1.3145, lng: 36.9023 };
    
    // Create a script element to load the Google Maps API with the correct settings
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDJouy5uUTdlGCEooD0sE4NU00Vab_JWUM&libraries=places&callback=createMap&v=weekly&channel=GMAPS_VERSION_99`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    // Global function to create the map (will be called by the API once loaded)
    window.createMap = function() {
        // Create the map
        const map = new google.maps.Map(mapContainer, {
            center: businessLocation,
            zoom: 16,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#444444"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{"color": "#f2f2f2"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100}, {"lightness": 45}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{"visibility": "simplified"}]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#c4c4c4"}, {"visibility": "on"}]
                }
            ]
        });
        
        // Add a marker for the business location
        const marker = new google.maps.Marker({
            position: businessLocation,
            map: map,
            title: 'Open Road Market',
            animation: google.maps.Animation.DROP,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#1a1a1a',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        });
        
        // Create an info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; max-width: 200px;">
                    <h3 style="margin: 0 0 8px; font-size: 16px; color: #1a1a1a;">Open Road Market</h3>
                    <p style="margin: 0 0 5px; font-size: 14px;">Embakasi Fedha Stage, Nairobi, Kenya</p>
                    <p style="margin: 0; font-size: 14px;">+254 721264140</p>
                </div>
            `
        });
        
        // Open info window when marker is clicked
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
        
        // Create a directions service and renderer
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true, // We will use our own markers
            polylineOptions: {
                strokeColor: '#1a1a1a',
                strokeWeight: 5,
                strokeOpacity: 0.7
            }
        });
        
        // Setup directions button functionality
        const directionsButton = document.querySelector('.btn-directions');
        if (directionsButton) {
            directionsButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Try to get the user's current location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            const userLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            
                            // Calculate route
                            calculateRoute(userLocation, businessLocation);
                        },
                        function(error) {
                            // If user denies location or there's an error, open Google Maps direction in a new tab
                            window.open(directionsButton.href, '_blank');
                        }
                    );
                } else {
                    // Geolocation not supported, open Google Maps direction in a new tab
                    window.open(directionsButton.href, '_blank');
                }
            });
        }
        
        // Function to calculate and display route
        function calculateRoute(origin, destination) {
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                },
                function(response, status) {
                    if (status === 'OK') {
                        // Display the route on the map
                        directionsRenderer.setDirections(response);
                        
                        // Add user location marker
                        new google.maps.Marker({
                            position: origin,
                            map: map,
                            title: 'Your Location',
                            animation: google.maps.Animation.DROP,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: '#4285F4',
                                fillOpacity: 1,
                                strokeColor: '#ffffff',
                                strokeWeight: 2
                            }
                        });
                        
                        // Show the destination marker again (it's hidden by directionsRenderer)
                        marker.setMap(map);
                    } else {
                        // If route calculation fails, open Google Maps direction in a new tab
                        const directionsButton = document.querySelector('.btn-directions');
                        if (directionsButton) {
                            window.open(directionsButton.href, '_blank');
                        }
                    }
                }
            );
        }
        
        // Add visual route animation
        function animateRoute() {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 750);
        }
        
        // Bounce the marker initially to draw attention
        setTimeout(animateRoute, 1000);
        
        // Make the map responsive to theme changes
        document.addEventListener('themeChanged', function(e) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            if (isDarkMode) {
                map.setOptions({
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "geometry",
                            stylers: [{ color: "#263c3f" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#6b9a76" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [{ color: "#38414e" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#212a37" }],
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#9ca5b3" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry",
                            stylers: [{ color: "#746855" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#1f2835" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#f3d19c" }],
                        },
                        {
                            featureType: "transit",
                            elementType: "geometry",
                            stylers: [{ color: "#2f3948" }],
                        },
                        {
                            featureType: "transit.station",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [{ color: "#17263c" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#515c6d" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.stroke",
                            stylers: [{ color: "#17263c" }],
                        },
                    ]
                });
            } else {
                map.setOptions({
                    styles: [
                        {
                            "featureType": "administrative",
                            "elementType": "labels.text.fill",
                            "stylers": [{"color": "#444444"}]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "all",
                            "stylers": [{"color": "#f2f2f2"}]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "all",
                            "stylers": [{"visibility": "off"}]
                        },
                        {
                            "featureType": "road",
                            "elementType": "all",
                            "stylers": [{"saturation": -100}, {"lightness": 45}]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "all",
                            "stylers": [{"visibility": "simplified"}]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "labels.icon",
                            "stylers": [{"visibility": "off"}]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "all",
                            "stylers": [{"visibility": "off"}]
                        },
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": [{"color": "#c4c4c4"}, {"visibility": "on"}]
                        }
                    ]
                });
            }
        });
    };
}

// Dispatch theme change event when theme is toggled
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const originalClickHandler = themeToggle.onclick;
        themeToggle.onclick = function(e) {
            if (originalClickHandler) {
                originalClickHandler.call(this, e);
            }
            // Dispatch theme change event
            const themeChangedEvent = new Event('themeChanged');
            document.dispatchEvent(themeChangedEvent);
        };
    }
});