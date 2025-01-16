import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCw0nr36pavANVNzmmJJ-A-4ghotpMW0Ws",
    authDomain: "resturant-qr-f1cc3.firebaseapp.com",
    projectId: "resturant-qr-f1cc3",
    storageBucket: "resturant-qr-f1cc3.firebasestorage.app",
    messagingSenderId: "442207521958",
    appId: "1:442207521958:web:49c885807801ae1798b867"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch total products
async function fetchTotalProducts() {
    const productsCollection = collection(db, "menuItems");
    const productSnapshot = await getDocs(productsCollection);
    const totalProducts = productSnapshot.size; // Get the number of documents in the collection

    // Update the total products count in the HTML
    document.getElementById('totalProducts').textContent = totalProducts;
}

// Call the function to fetch total products when the page loads
window.onload = () => {
    fetchTotalProducts();
};