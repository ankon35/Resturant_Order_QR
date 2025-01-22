// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
// import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCw0nr36pavANVNzmmJJ-A-4ghotpMW0Ws",
//     authDomain: "resturant-qr-f1cc3.firebaseapp.com",
//     projectId: "resturant-qr-f1cc3",
//     storageBucket: "resturant-qr-f1cc3.firebasestorage.app",
//     messagingSenderId: "442207521958",
//     appId: "1:442207521958:web:49c885807801ae1798b867"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Function to fetch products from Firestore
// async function fetchProducts() {
//     const productsContainer = document.querySelector('.product-container');
//     const menuItemsCollection = collection(db, 'menuItems');
    
//     try {
//         const querySnapshot = await getDocs(menuItemsCollection);
//         querySnapshot.forEach((doc) => {
//             const product = doc.data();
//             const productCard = document.createElement('div');
//             productCard.classList.add('product-card');

//             // Determine the displayed price
//             const displayedPrice = product.additionalSizes.length > 0 
//                 ? product.additionalSizes[0].price // Display the price of the first size if available
//                 : product.price; // Otherwise, display the normal price

//             productCard.innerHTML = `
//                 <img src="${product.picture}" alt="${product.name}" class="product-image">
//                 <h2 class="product-name">${product.name}</h2>
//                 <p class="product-category">Category: ${product.category}</p>
//                 <p class="product-price">$${displayedPrice}</p>
//                 <button class="add-to-cart">Add to Cart</button>
//             `;

//             // Add event listener for the "Add to Cart" button
//             const addToCartButton = productCard.querySelector('.add-to-cart');
//             addToCartButton.addEventListener('click', () => {
//                 alert(`${product.name} has been added to your cart!`);
//                 addToCartButton.innerText = 'Already Added'; // Change button text
//                 addToCartButton.style.backgroundColor = 'lightcoral'; // Change button color to light red
//                 addToCartButton.disabled = true; // Optionally disable the button
//             });

//             productsContainer.appendChild(productCard);
//         });
//     } catch (error) {
//         console.error("Error fetching products: ", error);
//     }
// }

// // Call the function to fetch products
// fetchProducts();




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

// Function to fetch products from Firestore
async function fetchProducts() {
    const productsContainer = document.querySelector('.product-container');
    const menuItemsCollection = collection(db, 'menuItems');
    
    try {
        const querySnapshot = await getDocs(menuItemsCollection);
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Determine the displayed price
            const displayedPrice = product.additionalSizes.length > 0 
                ? product.additionalSizes[0].price // Display the price of the first size if available
                : product.price; // Otherwise, display the normal price

            productCard.innerHTML = `
                <img src="${product.picture}" alt="${product.name}" class="product-image">
                <h2 class="product-name">${product.name}</h2>
                <p class="product-category">Category: ${product.category}</p>
                <p class="product-price">$${displayedPrice}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;

            // Add event listener for the "Add to Cart" button
            const addToCartButton = productCard.querySelector('.add-to-cart');
            addToCartButton.addEventListener('click', () => {
                // Create a product object
                const productToAdd = {
                    name: product.name,
                    picture: product.picture,
                    price: displayedPrice,
                    quantity: 1,
                    category: product.category
                };

                // Get existing cart items from local storage
                let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                // Check if the product is already in the cart
                const existingProductIndex = cartItems.findIndex(item => item.name === productToAdd.name);
                if (existingProductIndex > -1) {
                    // If it exists, increase the quantity
                    cartItems[existingProductIndex].quantity++;
                } else {
                    // If it doesn't exist, add it to the cart
                    cartItems.push(productToAdd);
                }

                // Save the updated cart items back to local storage
                localStorage.setItem('cartItems', JSON.stringify(cartItems));

                alert(`${product.name} has been added to your cart!`);
                addToCartButton.innerText = 'Already Added'; // Change button text
                addToCartButton.style.backgroundColor = 'lightcoral'; // Change button color to light red
                addToCartButton.disabled = true; // Optionally disable the button
            });

            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error fetching products: ", error);
    }
}

// Call the function to fetch products
fetchProducts();


// Get references to the elements
const hamburgerIcon = document.getElementById('hamburger-icon');
const sideDrawer = document.getElementById('side-drawer');
const closeDrawerButton = document.getElementById('close-drawer');

// Function to open the side drawer
hamburgerIcon.addEventListener('click', () => {
    sideDrawer.classList.add('open'); // Add the 'open' class to show the drawer
});

// Function to close the side drawer
closeDrawerButton.addEventListener('click', () => {
    sideDrawer.classList.remove('open'); // Remove the 'open' class to hide the drawer
});

// Optional: Close the drawer when clicking outside of it
document.addEventListener('click', (event) => {
    if (!sideDrawer.contains(event.target) && !hamburgerIcon.contains(event.target)) {
        sideDrawer.classList.remove('open'); // Close the drawer if clicked outside
    }
});