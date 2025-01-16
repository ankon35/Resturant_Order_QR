


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
    categoryFilter.innerHTML = '<option value="">All Categories</option>'; // Clear existing options
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
                sizeElement.innerHTML = `Size: <span class="product-size">${sizeInfo.size}</span> <br> <br> Price: <span class="product-price">${sizeInfo.price || 'N/A'}</span>`;
                sizesContainer.appendChild(sizeElement);
            });
        } else {
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
                    await deleteDoc(doc(db, "menuItems", product.id));
                    productContainer.removeChild(productCard);
                    allProducts = allProducts.filter(p => p.id !== product.id);
                } catch (error) {
                    console.error("Error deleting product: ", error);
                    alert("There was an error deleting the product. Please try again.");
                }
            }
        });

        // Add edit functionality
        editButton.addEventListener('click', () => {

            const editForm = document.createElement('form');
            editForm.classList.add('edit-form');
            // Display the current image
            const currentImage = document.createElement('img');
            currentImage.src = product.picture || "https://via.placeholder.com/150"; // Show current image
            currentImage.alt = "Current Product Image";
            currentImage.style.width = '150px'; // Set a width for the image
            currentImage.style.height = 'auto'; // Maintain aspect ratio
            editForm.appendChild(currentImage);

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

            const additionalSizesDiv = document.createElement('div');
            additionalSizesDiv.classList.add('additional-sizes-edit');

            // If additionalSizes exist, create input fields for them; otherwise, show the main price input
            let mainPriceInput = null;
            if (product.additionalSizes && product.additionalSizes.length > 0) {
                product.additionalSizes.forEach(sizeInfo => {
                    const sizeDiv = document.createElement('div');
                    sizeDiv.classList.add('size-info');

                    const sizeInput = document.createElement('input');
                    sizeInput.type = 'text';
                    sizeInput.value = sizeInfo.size;
                    sizeInput.placeholder = 'Size';
                    sizeInput.style.width = '100%'; // Adjust width
                    sizeInput.style.margin = '5px 0';
                    sizeInput.style.border = '1px solid #ccc';
                    sizeInput.style.borderRadius = '4px';
                    sizeInput.style.padding = '10px';

                    const priceInput = document.createElement('input');
                    priceInput.type = 'number';
                    priceInput.value = sizeInfo.price;
                    priceInput.placeholder = 'Price';
                    priceInput.style.width = '100%'; // Adjust width
                    priceInput.style.margin = '5px 0';
                    priceInput.style.border = '1px solid #ccc';
                    priceInput.style.borderRadius = '4px';
                    priceInput.style.padding = '10px';

                    sizeDiv.appendChild(sizeInput);
                    sizeDiv.appendChild(priceInput);
                    additionalSizesDiv.appendChild(sizeDiv);
                });
            } else {
                mainPriceInput = document.createElement('input');
                mainPriceInput.type = 'number';
                mainPriceInput.value = product.price || '';
                mainPriceInput.placeholder = 'Main Price';
                additionalSizesDiv.appendChild(mainPriceInput);
            }

            const saveButton = document.createElement('button');
            saveButton.type = 'submit';
            saveButton.textContent = 'Save';
            saveButton.style.width = '100%'
            saveButton.style.margin = '5px 0';
            saveButton.style.border = '1px solid #ccc';
            saveButton.style.borderRadius = '4px';
            saveButton.style.padding = '10px';

            editForm.appendChild(nameInput);
            editForm.appendChild(descriptionInput);
            editForm.appendChild(categoryInput);
            editForm.appendChild(additionalSizesDiv);
            editForm.appendChild(saveButton);

            productCard.innerHTML = '';
            productCard.appendChild(editForm);

            editForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                // If additionalSizes exist, update them; otherwise, update the main price
                const updatedProduct = {
                    name: nameInput.value,
                    description: descriptionInput.value,
                    category: categoryInput.value,
                };

                if (mainPriceInput) {
                    updatedProduct.price = mainPriceInput.value;
                    updatedProduct.additionalSizes = null; // Clear additional sizes if they previously existed
                } else {
                    updatedProduct.additionalSizes = Array.from(additionalSizesDiv.querySelectorAll('div')).map(sizeDiv => ({
                        size: sizeDiv.querySelector('input[type="text"]').value,
                        price: sizeDiv.querySelector('input[type="number"]').value,
                    }));
                }

                try {
                    await updateDoc(doc(db, "menuItems", product.id), updatedProduct);
                    alert("Updated");
                    fetchProducts(); // Refresh the products list
                } catch (error) {
                    console.error("Error updating product: ", error);
                    alert("There was an error updating the product. Please try again.");
                }
            });
        });


        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
        productCard.appendChild(productCategory);
        productCard.appendChild(sizesContainer);
        productCard.appendChild(editButton);
        productCard.appendChild(deleteButton);

        productContainer.appendChild(productCard);
    });
    

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

// Initial fetch of products
fetchProducts();
