document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const searchToggle = document.getElementById('search-toggle');
    const searchPanel = document.getElementById('advanced-search');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('header');
    const searchCategorySelect = document.getElementById('search-category');
    const vehicleFields = document.getElementById('vehicle-fields');
    const realEstateFields = document.getElementById('real-estate-fields');
    
    // Hero Slider Elements
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.querySelector('.slider-arrow.prev');
    const nextArrow = document.querySelector('.slider-arrow.next');
    let currentSlide = 0;
    let slideInterval;
    
    // Initialize Hero Slider
    function startSlider() {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Attach Hero Slider Event Listeners
    if (slides.length > 0) {
        // Initialize the slider
        startSlider();
        
        // Next and previous buttons
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                clearInterval(slideInterval);
                nextSlide();
                startSlider();
            });
        }
        
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                clearInterval(slideInterval);
                prevSlide();
                startSlider();
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                currentSlide = index;
                showSlide(currentSlide);
                startSlider();
            });
        });
    }
    
    // Gallery Modal Elements
    const galleryModal = document.querySelector('.gallery-modal');
    const galleryTitle = document.querySelector('.gallery-title');
    const galleryClose = document.querySelector('.gallery-close');
    const galleryImage = document.querySelector('.gallery-image');
    const galleryThumbnails = document.querySelector('.gallery-thumbnails');
    const galleryPrevArrow = document.querySelector('.gallery-arrow.prev');
    const galleryNextArrow = document.querySelector('.gallery-arrow.next');
    const galleryPrice = document.querySelector('.gallery-price');
    const galleryDescription = document.querySelector('.gallery-description');
    const galleryBuyButton = document.querySelector('.gallery-btn.primary');
    
    // Gallery Modal Variables
    let currentGalleryImages = [];
    let currentImageIndex = 0;
    let currentItemData = {};

    // Gallery Modal Functions
    function openGallery(itemId) {
        const card = document.querySelector(`.card[data-id="${itemId}"]`);
        if (!card) return;
        
        // Get item data
        const title = card.querySelector('h3').textContent;
        const price = card.querySelector('.price').textContent;
        const location = card.querySelector('.location').textContent;
        const details = Array.from(card.querySelectorAll('.card-details span')).map(span => span.textContent.trim()).join(' | ');
        
        // Get gallery images
        const hiddenGallery = card.querySelector('.hidden-gallery');
        if (!hiddenGallery) return;
        
        const images = Array.from(hiddenGallery.querySelectorAll('img'));
        if (images.length === 0) return;
        
        // Set current gallery data
        currentItemData = {
            title,
            price,
            location,
            details
        };
        
        currentGalleryImages = images.map(img => ({
            src: img.src,
            alt: img.alt
        }));
        
        // Populate gallery
        galleryTitle.textContent = title;
        galleryPrice.textContent = price;
        galleryDescription.textContent = `${location} | ${details}`;
        
        // Clear thumbnails
        galleryThumbnails.innerHTML = '';
        
        // Add thumbnails
        currentGalleryImages.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.src;
            thumbnail.alt = image.alt;
            thumbnail.classList.add('gallery-thumbnail');
            if (index === 0) thumbnail.classList.add('active');
            
            thumbnail.addEventListener('click', () => {
                showGalleryImage(index);
            });
            
            galleryThumbnails.appendChild(thumbnail);
        });
        
        // Show first image
        currentImageIndex = 0;
        showGalleryImage(currentImageIndex);
        
        // Show modal
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeGallery() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showGalleryImage(index) {
        if (index < 0) index = currentGalleryImages.length - 1;
        if (index >= currentGalleryImages.length) index = 0;
        
        currentImageIndex = index;
        
        const image = currentGalleryImages[index];
        galleryImage.src = image.src;
        galleryImage.alt = image.alt;
        
        // Update thumbnails
        const thumbnails = galleryThumbnails.querySelectorAll('.gallery-thumbnail');
        thumbnails.forEach((thumbnail, i) => {
            if (i === index) {
                thumbnail.classList.add('active');
            } else {
                thumbnail.classList.remove('active');
            }
        });
    }
    
    function nextGalleryImage() {
        showGalleryImage(currentImageIndex + 1);
    }
    
    function prevGalleryImage() {
        showGalleryImage(currentImageIndex - 1);
    }
    
    // Attach gallery event listeners
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-target');
            if (itemId) {
                openGallery(itemId);
            }
        });
    });
    
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            if (card) {
                const itemId = card.getAttribute('data-id');
                if (itemId) {
                    openGallery(itemId);
                    // Auto-scroll to Buy button
                    setTimeout(() => {
                        const galleryActions = document.querySelector('.gallery-actions');
                        if (galleryActions) {
                            galleryActions.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 500);
                }
            }
        });
    });
    
    if (galleryClose) {
        galleryClose.addEventListener('click', closeGallery);
    }
    
    if (galleryPrevArrow) {
        galleryPrevArrow.addEventListener('click', prevGalleryImage);
    }
    
    if (galleryNextArrow) {
        galleryNextArrow.addEventListener('click', nextGalleryImage);
    }
    
    // Close gallery on Esc key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
            closeGallery();
        }
    });
    
    // Close gallery when clicking outside content
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeGallery();
        }
    });
    
    // Gallery Buy Now button
    if (galleryBuyButton) {
        galleryBuyButton.addEventListener('click', function() {
            alert(`Thank you for your interest in purchasing this item!\n\nItem: ${currentItemData.title}\nPrice: ${currentItemData.price}\n\nOur sales team will contact you shortly to complete the purchase process.`);
            closeGallery();
        });
    }
    
    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Theme Toggle Functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Search Panel Toggle
    searchToggle.addEventListener('click', function() {
        searchPanel.classList.toggle('active');
        
        // If search panel is active, add a click event to close it when clicking outside
        if (searchPanel.classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', closeSearchPanelOnClickOutside);
            }, 10);
        } else {
            document.removeEventListener('click', closeSearchPanelOnClickOutside);
        }
    });

    // Function to close search panel when clicking outside
    function closeSearchPanelOnClickOutside(e) {
        if (!searchPanel.contains(e.target) && e.target !== searchToggle) {
            searchPanel.classList.remove('active');
            document.removeEventListener('click', closeSearchPanelOnClickOutside);
        }
    }

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            if (menuToggle.classList.contains('active')) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Search Category Change
    searchCategorySelect.addEventListener('change', function() {
        if (this.value === 'vehicles') {
            vehicleFields.style.display = 'flex';
            realEstateFields.style.display = 'none';
        } else {
            vehicleFields.style.display = 'none';
            realEstateFields.style.display = 'flex';
        }
    });

    // Header Scroll Effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Card Animation on Scroll
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });

    // Form Submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the current search category
            const searchCategory = searchCategorySelect.value;
            
            // Build query parameters based on form fields
            let queryParams = new URLSearchParams();
            
            if (searchCategory === 'vehicles') {
                const vehicleType = document.getElementById('vehicle-type').value;
                const vehicleMake = document.getElementById('vehicle-make').value;
                const minPrice = document.getElementById('min-price').value;
                const maxPrice = document.getElementById('max-price').value;
                const year = document.getElementById('year').value;
                
                if (vehicleType) queryParams.append('type', vehicleType);
                if (vehicleMake) queryParams.append('make', vehicleMake);
                if (minPrice) queryParams.append('minPrice', minPrice);
                if (maxPrice) queryParams.append('maxPrice', maxPrice);
                if (year) queryParams.append('year', year);
                
                // Redirect to vehicles page with query parameters
                window.location.href = `vehicles.html?${queryParams.toString()}`;
            } else {
                const propertyType = document.getElementById('property-type').value;
                const location = document.getElementById('location').value;
                const propertyMinPrice = document.getElementById('property-min-price').value;
                const propertyMaxPrice = document.getElementById('property-max-price').value;
                const bedrooms = document.getElementById('bedrooms').value;
                
                if (propertyType) queryParams.append('type', propertyType);
                if (location) queryParams.append('location', location);
                if (propertyMinPrice) queryParams.append('minPrice', propertyMinPrice);
                if (propertyMaxPrice) queryParams.append('maxPrice', propertyMaxPrice);
                if (bedrooms) queryParams.append('bedrooms', bedrooms);
                
                // Redirect to properties page with query parameters
                window.location.href = `properties.html?${queryParams.toString()}`;
            }
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value) {
                // Here you would typically send the data to a server
                // For now, we'll just show a success message
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }

    // Initialize dropdowns for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // For touch devices
    if ('ontouchstart' in window) {
        dropdowns.forEach(dropdown => {
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Close dropdown when clicking outside
                setTimeout(() => {
                    document.addEventListener('click', function closeDropdown(e) {
                        if (!dropdown.contains(e.target)) {
                            dropdown.classList.remove('active');
                            document.removeEventListener('click', closeDropdown);
                        }
                    });
                }, 10);
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});