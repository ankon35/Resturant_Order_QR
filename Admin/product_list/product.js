import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

// Global variable to hold all products
let allProducts = [];

// Function to fetch products and categories
async function fetchProducts() {
    const productContainer = document.querySelector('.product-container');
    const productsCollection = collection(db, "menuItems");
    const productSnapshot = await getDocs(productsCollection);
    allProducts = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Clear existing products
    productContainer.innerHTML = '';

    // Populate categories
    const categories = new Set();
    allProducts.forEach(product => {
        categories.add(product.category);
    });

    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Display all products initially
    displayProducts(allProducts);
}

// Function to display products
function displayProducts(products) {
    const productContainer = document.querySelector('.product-container');
    productContainer.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productImage = document.createElement('img');
        productImage.src = product.picture || "https://via.placeholder.com/150"; // Use a placeholder if no image
        productImage.alt = product.name;

        const productName = document.createElement('h3');
        productName.textContent = product.name;

        const productDescription = document.createElement('p');
        productDescription.textContent = product.description;

        const productCategory = document.createElement('p');
        productCategory.innerHTML = `Category: <span class="product-category">${product.category || 'N/A'}</span>`;

        const sizesContainer = document.createElement('div');
        sizesContainer.classList.add('additional-sizes');

        if (product.additionalSizes && product.additionalSizes.length > 0) {
            product.additionalSizes.forEach(sizeInfo => {
                const sizeElement = document.createElement('p');
                sizeElement.innerHTML = `Size: <span class="product-size">${sizeInfo.size}</span> <br> <br> Price: <span class="product-price">$${sizeInfo.price || 'N/A'}</span>`;
                sizesContainer.appendChild(sizeElement);
            });
        } else {
            // If additionalSizes is empty, display the main product price
            const mainPriceElement = document.createElement('p');
            mainPriceElement.innerHTML = `Price: <span class="product-price">${product.price || 'N/A'}</span>`;
            sizesContainer.appendChild(mainPriceElement);
        }

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';

        // Add delete functionality
        deleteButton.addEventListener('click', async () => {
            const confirmDelete = confirm("Are you sure you want to delete this product?");
            if (confirmDelete) {
                try {
                    // Delete from Firestore
                    await deleteDoc(doc(db, "menuItems", product.id));
                    // Remove the product card from the UI
                    productContainer.removeChild(productCard);
                    // Optionally, update the allProducts array
                    allProducts = allProducts.filter(p => p.id !== product.id);
                } catch (error) {
                    console.error("Error deleting product: ", error);
                    alert("There was an error deleting the product. Please try again.");
                }
            }
        });

        // Add edit functionality
        editButton.addEventListener('click', () => {
            // Create an edit form
            const editForm = document.createElement('form');
            editForm.classList.add('edit-form');

            // Display the current image
            const currentImage = document.createElement('img');
            currentImage.src = product.picture || "https://via.placeholder.com/150"; // Show current image
            currentImage.alt = "Current Product Image";
            currentImage.style.width = '150px'; // Set a width for the image
            currentImage.style.height = 'auto'; // Maintain aspect ratio
            editForm.appendChild(currentImage);

            // Create input fields for editing
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = product.name;
            nameInput.placeholder = 'Product Name';
            nameInput.style.width = '100%'; // Full width
            nameInput.style.padding = '10px'; // Padding for better appearance
            nameInput.style.margin = '5px 0'; // Margin for spacing
            nameInput.style.border = '1px solid #ccc'; // Border style
            nameInput.style.borderRadius = '4px'; // Rounded corners

            const descriptionInput = document.createElement('input');
            descriptionInput.type = 'text';
            descriptionInput.value = product.description;
            descriptionInput.placeholder = 'Product Description';
            descriptionInput.style.width = '100%'; // Full width
            descriptionInput.style.padding = '10px'; // Padding for better appearance
            descriptionInput.style.margin = '5px 0'; // Margin for spacing
            descriptionInput.style.border = '1px solid #ccc'; // Border style
            descriptionInput.style.borderRadius = '4px'; // Rounded corners

            const categoryInput = document.createElement('input');
            categoryInput.type = 'text';
            categoryInput.value = product.category;
            categoryInput.placeholder = 'Category';
            categoryInput.style.width = '100%'; // Full width
            categoryInput.style.padding = '10px'; // Padding for better appearance
            categoryInput.style.margin = '5px 0'; // Margin for spacing
            categoryInput.style.border = '1px solid #ccc'; // Border style
            categoryInput.style.borderRadius = '4px'; // Rounded corners

            const priceInput = document.createElement('input');
            priceInput.type = 'text';
            priceInput.value = product.price;
            priceInput.placeholder = 'Price';
            priceInput.style.width = '100%'; // Full width
            priceInput.style.padding = '10px'; // Padding for better appearance
            priceInput.style.margin = '5px 0'; // Margin for spacing
            priceInput.style.border = '1px solid #ccc'; // Border style
            priceInput.style.borderRadius = '4px'; // Rounded corners

            // Create a save button
            const saveButton = document.createElement('button');
            saveButton.type = 'submit';
            saveButton.textContent = 'Save';
            saveButton.style.backgroundColor = '#4CAF50'; // Green background
            saveButton.style.color = 'white'; // White text
            saveButton.style.padding = '10px 15px'; // Padding
            saveButton.style.border = 'none'; // No border
            saveButton.style.borderRadius = '4px'; // Rounded corners
            saveButton.style.cursor = 'pointer'; // Pointer cursor on hover

            // Append inputs and button to the form
            editForm.appendChild(nameInput);
            editForm.appendChild(descriptionInput);
            editForm.appendChild(categoryInput);
            editForm.appendChild(priceInput);
            editForm.appendChild(saveButton);

            // Replace the product card content with the edit form
            productCard.innerHTML = ''; // Clear existing content
            productCard.appendChild(editForm);

            // Handle form submission
            editForm.addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent the default form submission

                // Get updated values
                const updatedProduct = {
                    name: nameInput.value,
                    description: descriptionInput.value,
                    category: categoryInput.value,
                    price: priceInput.value,
                    picture: product.picture, // Keep the same picture
                    additionalSizes: product.additionalSizes // Keep the same sizes
                };

                try {
                    // Update the product in Firestore
                    await updateDoc(doc(db, "menuItems", product.id), updatedProduct);
                    // Update the product card in the UI
                    productCard.innerHTML = ''; // Clear the form
                    displayProductCard(productCard, updatedProduct); // Display updated product
                } catch (error) {
                    console.error("Error updating product: ", error);
                    alert("There was an error updating the product. Please try again.");
                }
            });
        });

        // Append all elements to the product card
        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
        productCard.appendChild(productCategory);
        productCard.appendChild(sizesContainer);
        productCard.appendChild(editButton);
        productCard.appendChild(deleteButton);

        // Append the product card to the product container
        productContainer.appendChild(productCard);
    });
}

// Function to display a product card
function displayProductCard(productCard, product) {
    const productImage = document.createElement('img');
    productImage.src = product.picture || "https://via.placeholder.com/150"; // Use a placeholder if no image
    productImage.alt = product.name;

    const productName = document.createElement('h3');
    productName.textContent = product.name;

    const productDescription = document.createElement('p');
    productDescription.textContent = product.description;

    const productCategory = document.createElement('p');
    productCategory.innerHTML = `Category: <span class="product-category">${product.category || 'N/A'}</span>`;

    const sizesContainer = document.createElement('div');
    sizesContainer.classList.add('additional-sizes');

    if (product.additionalSizes && product.additionalSizes.length > 0) {
        product.additionalSizes.forEach(sizeInfo => {
            const sizeElement = document.createElement('p');
            sizeElement.innerHTML = `Size: <span class="product-size">${sizeInfo.size}</span> <br> <br> Price: <span class="product-price">$${sizeInfo.price || 'N/A'}</span>`;
            sizesContainer.appendChild(sizeElement);
        });
    } else {
        // If additionalSizes is empty, display the main product price
        const mainPriceElement = document.createElement('p');
        mainPriceElement.innerHTML = `Price: <span class="product-price">${product.price || 'N/A'}</span>`;
        sizesContainer.appendChild(mainPriceElement);
    }

    // Create Edit and Delete buttons
    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.textContent = 'Edit';

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';

    // Add delete functionality
    deleteButton.addEventListener('click', async () => {
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            try {
                // Delete from Firestore
                await deleteDoc(doc(db, "menuItems", product.id));
                // Remove the product card from the UI
                productContainer.removeChild(productCard);
                // Optionally, update the allProducts array
                allProducts = allProducts.filter(p => p.id !== product.id);
            } catch (error) {
                console.error("Error deleting product: ", error);
                alert("There was an error deleting the product. Please try again.");
            }
        }
    });

    // Add edit functionality
    editButton.addEventListener('click', () => {
        // Create an edit form
        const editForm = document.createElement('form');
        editForm.classList.add('edit-form');

        // Display the current image
        const currentImage = document.createElement('img');
        currentImage.src = product.picture || "https://via.placeholder.com/150"; // Show current image
        currentImage.alt = "Current Product Image";
        currentImage.style.width = '150px'; // Set a width for the image
        currentImage.style.height = 'auto'; // Maintain aspect ratio
        editForm.appendChild(currentImage);

        // Create input fields for editing
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = product.name;
        nameInput.placeholder = 'Product Name';
        nameInput.style.width = '100%'; // Full width
        nameInput.style.padding = '10px'; // Padding for better appearance
        nameInput.style.margin = '5px 0'; // Margin for spacing
        nameInput.style.border = '1px solid #ccc'; // Border style
        nameInput.style.borderRadius = '4px'; // Rounded corners

        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.value = product.description;
        descriptionInput.placeholder = 'Product Description';
        descriptionInput.style.width = '100%'; // Full width
        descriptionInput.style.padding = '10px'; // Padding        descriptionInput.style.margin = '5px 0'; // Margin for spacing
        descriptionInput.style.border = '1px solid #ccc'; // Border style
        descriptionInput.style.borderRadius = '4px'; // Rounded corners

        const categoryInput = document.createElement('input');
        categoryInput.type = 'text';
        categoryInput.value = product.category;
        categoryInput.placeholder = 'Category';
        categoryInput.style.width = '100%'; // Full width
        categoryInput.style.padding = '10px'; // Padding for better appearance
        categoryInput.style.margin = '5px 0'; // Margin for spacing
        categoryInput.style.border = '1px solid #ccc'; // Border style
        categoryInput.style.borderRadius = '4px'; // Rounded corners

        const priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.value = product.price;
        priceInput.placeholder = 'Price';
        priceInput.style.width = '100%'; // Full width
        priceInput.style.padding = '10px'; // Padding for better appearance
        priceInput.style.margin = '5px 0'; // Margin for spacing
        priceInput.style.border = '1px solid #ccc'; // Border style
        priceInput.style.borderRadius = '4px'; // Rounded corners

        // Create a save button
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.textContent = 'Save';
        saveButton.style.backgroundColor = '#4CAF50'; // Green background
        saveButton.style.color = 'white'; // White text
        saveButton.style.padding = '10px 15px'; // Padding
        saveButton.style.border = 'none'; // No border
        saveButton.style.borderRadius = '4px'; // Rounded corners
        saveButton.style.cursor = 'pointer'; // Pointer cursor on hover

        // Append inputs and button to the form
        editForm.appendChild(nameInput);
        editForm.appendChild(descriptionInput);
        editForm.appendChild(categoryInput);
        editForm.appendChild(priceInput);
        editForm.appendChild(saveButton);

        // Replace the product card content with the edit form
        productCard.innerHTML = ''; // Clear existing content
        productCard.appendChild(editForm);

        // Handle form submission
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            // Get updated values
            const updatedProduct = {
                name: nameInput.value,
                description: descriptionInput.value,
                category: categoryInput.value,
                price: priceInput.value,
                picture: product.picture, // Keep the same picture
                additionalSizes: product.additionalSizes // Keep the same sizes
            };

            try {
                // Update the product in Firestore
                await updateDoc(doc(db, "menuItems", product.id), updatedProduct);
                // Update the product card in the UI
                productCard.innerHTML = ''; // Clear the form
                displayProductCard(productCard, updatedProduct); // Display updated product
            } catch (error) {
                console.error("Error updating product: ", error);
                alert("There was an error updating the product. Please try again.");
            }
        });
    });

    // Append all elements to the product card
    productCard.appendChild(productImage);
    productCard.appendChild(productName);
    productCard.appendChild(productDescription);
    productCard.appendChild(productCategory);
    productCard.appendChild(sizesContainer);
    productCard.appendChild(editButton);
    productCard.appendChild(deleteButton);

    // Append the product card to the product container
    productContainer.appendChild(productCard);
}

// Function to filter products based on selected category
function filterProducts() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredProducts = selectedCategory ?
        allProducts.filter(product => product.category === selectedCategory) :
        allProducts;

    displayProducts(filteredProducts);
}

// Event listener for category filter
document.getElementById('categoryFilter').addEventListener('change', filterProducts);

// Call the fetchProducts function when the page loads
window.onload = fetchProducts;