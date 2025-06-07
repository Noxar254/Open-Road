// Simple Firebase diagnostic script
console.log("=== Firebase Diagnostic Script ===");

// Check if Firebase is loaded
console.log("Firebase object available:", typeof firebase !== 'undefined');

if (typeof firebase !== 'undefined') {
    console.log("Firebase apps:", firebase.apps?.length || 0);
    
    // Try to initialize if not already done
    if (firebase.apps.length === 0) {
        console.log("No Firebase apps found, attempting to initialize...");
        try {
            const firebaseConfig = {
                apiKey: "AIzaSyDjxz6hzgqeLkNtQFnSTbDkro4dsj2j-Tc",
                authDomain: "open-road-market.firebaseapp.com",
                projectId: "open-road-market",
                storageBucket: "open-road-market.firebasestorage.app",
                messagingSenderId: "6509034099",
                appId: "1:6509034099:web:bf09794b823f4187ffc806",
                measurementId: "G-WWBRN92Y32"
            };
            
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully");
        } catch (error) {
            console.error("Error initializing Firebase:", error);
        }
    } else {
        console.log("Firebase already initialized");
    }
    
    // Check Firestore
    try {
        const db = firebase.firestore();
        console.log("Firestore instance created successfully");
    } catch (error) {
        console.error("Error creating Firestore instance:", error);
    }
} else {
    console.error("Firebase SDK not loaded");
}

// Check for form elements
console.log("Vehicle form found:", !!document.getElementById('vehicle-enquiry-form'));
console.log("Property form found:", !!document.getElementById('property-enquiry-form'));
console.log("Purchase modal found:", !!document.getElementById('purchase-modal'));
console.log("Property modal found:", !!document.getElementById('property-modal'));

// Check for Buy Now buttons
const buyButtons = document.querySelectorAll('.btn-buy');
console.log("Buy Now buttons found:", buyButtons.length);

// Check for FormHandler
console.log("FormHandler available:", typeof FormHandler !== 'undefined');

console.log("=== End Diagnostic ===");
