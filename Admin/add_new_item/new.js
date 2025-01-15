

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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













const selectedSizes = new Set();

const nameContainer = document.getElementById('name-container');
const categoryDropdown = document.getElementById('category');
const descriptionContainer = document.getElementById('description-container');
const submitButton = document.getElementById('submit-btn');
const pictureContainer = document.getElementById('picture-container');
const addSizeButton = document.getElementById('add-size-container');
const additionalSizesContainer = document.getElementById('additional-sizes');
const priceContainer = document.getElementById('price-container');

// Function to update the visibility of the "Add Sizes" button and additional sizes
function updateVisibility(event) {
    // event.preventDefault();

    // Reset form fields
    document.getElementById('name').value = '';
    document.getElementById('price-container').value = '';
    document.getElementById('price').value = '';
    document.getElementById('picture').value = '';
    document.getElementById('description').value = '';
    additionalSizesContainer.innerHTML = '';



    const selectedCategory = categoryDropdown.value;


    // Show or hide the "Add Sizes" button based on the selected category
    if (selectedCategory === 'burger' || selectedCategory === 'pizza') {
        addSizeButton.classList.remove('hidden'); // Show the "Add Sizes" button
        additionalSizesContainer.classList.remove('hidden'); // Show additional sizes
        nameContainer.classList.remove('hidden');
        priceContainer.classList.add('hidden');
        pictureContainer.classList.remove('hidden');
        descriptionContainer.classList.remove('hidden');
        submitButton.classList.remove('hidden'); // Show submit button
    } else if (selectedCategory === 'set-menu') {
        addSizeButton.classList.add('hidden'); // Hide the "Add Sizes" button
        additionalSizesContainer.classList.add('hidden'); // Hide additional sizes
        nameContainer.classList.remove('hidden');
        priceContainer.classList.remove('hidden');
        pictureContainer.classList.remove('hidden');
        descriptionContainer.classList.remove('hidden');
        submitButton.classList.remove('hidden'); // Show submit button
    } else {
        // If no valid category is selected, hide everything except the category dropdown
        addSizeButton.classList.add('hidden');
        additionalSizesContainer.classList.add('hidden');
        nameContainer.classList.add('hidden');
        pictureContainer.classList.add('hidden');
        descriptionContainer.classList.add('hidden');
        submitButton.classList.add('hidden');
    }
}

// Initial check to set the visibility of the "Add Sizes" button
updateVisibility();

// Event listener for category dropdown
categoryDropdown.addEventListener('change', function () {
    updateVisibility();
});












submitButton.addEventListener('click', async function (event) {
    event.preventDefault();

    // Collect form data
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const picture = document.getElementById('picture').files[0]; // Get the file input
    const description = document.getElementById('description').value;
    const selectedCategory = categoryDropdown.value;

    // Collect additional sizes and their prices
    const additionalSizes = [];
    const sizeSelects = document.querySelectorAll('#additional-sizes select');
    const priceInputs = document.querySelectorAll('#additional-sizes input[type="number"]');
    const customSizeInputs = document.querySelectorAll('#additional-sizes input[type="text"]');
    const customPriceInputs = document.querySelectorAll('#additional-sizes input[type="number"].custom-price');

    sizeSelects.forEach((select, index) => {
        const size = select.value;
        const priceValue = priceInputs[index].value; // Renamed to avoid confusion with the main price

        // If the size is not empty and has a price, add it to additionalSizes
        if (size && priceValue) {
            additionalSizes.push({ size, price: priceValue });
        }

        // Check if the size is 'custom' and collect custom size info
        if (size === 'custom') {
            const customSize = customSizeInputs[index].value; // Get the custom size name
            const customPrice = customPriceInputs[index].value; // Get the custom size price
            if (customSize && customPrice) {
                additionalSizes.push({ size: customSize, price: customPrice });
            }
        }
    });

    // Log the collected data to the console
    const formData = {
        category: selectedCategory,
        name,
        price: price ? `${price} BDT` : '',
        picture: picture ? picture.name : 'No picture uploaded', // Log the picture name or indicate no upload
        description,
        additionalSizes
    };

    console.log('Collected Form Data:', formData); // Log the collected data

    // Check if an image file is uploaded
    if (!picture) {
        console.error('Please upload an image.');
        return;
    }

    try {
        // Create a FormData object to send the image file
        const formDataImage = new FormData();
        formDataImage.append('key', '70ed7be6aa8eb21841cee9efeef1fd9b'); // Your imgBB API key
        formDataImage.append('image', picture);

        // Upload image to imgBB
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formDataImage,
        });

        const data = await response.json();

        if (data.success) {
            const imageUrl = data.data.url; // Get the uploaded image URL
            console.log('Image uploaded successfully:', imageUrl);

            // Create an object to hold all the collected data
            const finalData = {
                category: selectedCategory,
                name,
                price: price ? `${price} BDT` : '',
                picture: imageUrl, // Use the uploaded image URL
                description,
                additionalSizes
            };

            // Store the data in Firestore
            try {
                const docRef = await addDoc(collection(db, "menuItems"), finalData);

                // Clear the selected sizes and re-enable all options in the dropdowns
                selectedSizesList.length = 0; // Clear the selected sizes list
                const allSelects = document.querySelectorAll('#additional-sizes select');
                allSelects.forEach(select => {
                    const options = select.querySelectorAll('option');
                    options.forEach(option => {
                        option.disabled = false; // Enable all options
                    });
                });

                // Reset the additional sizes container
                additionalSizesContainer.innerHTML = '';

            } catch (e) {
                console.error("Error adding document: ", e);
            }

            alert("Product added successfully");
            updateVisibility();
        } else {
            console.error('Image upload failed:', data.error.message);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }

    
    updateVisibility();
});







const selectedSizesList = []; // Global list to track selected sizes

addSizeButton.addEventListener('click', function () {
    const additionalSizesContainer = document.getElementById('additional-sizes');

    // Create new size dropdown
    const newSizeDiv = document.createElement('div');
    newSizeDiv.classList.add('form-group');

    const newSizeLabel = document.createElement('label');
    newSizeLabel.textContent = 'Size';
    newSizeDiv.appendChild(newSizeLabel);

    const newSizeSelect = document.createElement('select');
    newSizeSelect.required = true;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Select size';
    newSizeSelect.appendChild(defaultOption);

    // Add options for sizes
    const sizes = ['small', 'medium', 'large', 'custom'];
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size.charAt(0).toUpperCase() + size.slice(1);
        newSizeSelect.appendChild(option);
    });

    newSizeDiv.appendChild(newSizeSelect);

    // Create new price input
    const newPriceDiv = document.createElement('div');
    newPriceDiv.classList.add('form-group');

    const newPriceLabel = document.createElement('label');
    newPriceLabel.textContent = 'Price';
    newPriceDiv.appendChild(newPriceLabel);

    const newPriceInput = document.createElement('input');
    newPriceInput.type = 'number';
    newPriceInput.placeholder = 'Enter price for selected size';
    newPriceInput.required = true;
    newPriceDiv.appendChild(newPriceInput);

    // Append new size dropdown and price input to the container
    additionalSizesContainer.appendChild(newSizeDiv);
    additionalSizesContainer.appendChild(newPriceDiv);

    // Create custom size and price fields
    const customSizeDiv = document.createElement('div');
    customSizeDiv.classList.add('form-group', 'hidden'); // Initially hidden

    const customSizeLabel = document.createElement('label');
    customSizeLabel.textContent = 'Custom Size Name';
    customSizeDiv.appendChild(customSizeLabel);

    const customSizeInput = document.createElement('input');
    customSizeInput.type = 'text';
    customSizeInput.placeholder = 'Enter custom size name';
    customSizeInput.required = false; // Not required
    customSizeDiv.appendChild(customSizeInput);

    const customPriceDiv = document.createElement('div');
    customPriceDiv.classList.add('form-group', 'hidden'); // Initially hidden

    const customPriceLabel = document.createElement('label');
    customPriceLabel.textContent = 'Custom Size Price';
    customPriceDiv.appendChild(customPriceLabel);

    const customPriceInput = document.createElement('input');
    customPriceInput.type = 'number';
    customPriceInput.placeholder = 'Enter custom size price';
    customPriceInput.required = false; // Not required
    customPriceDiv.appendChild(customPriceInput);

    // Append custom size and price fields to the container
    additionalSizesContainer.appendChild(customSizeDiv);
    additionalSizesContainer.appendChild(customPriceDiv);

    // Function to update dropdown options based on the selectedSizesList
    function updateDropdownOptions() {
        const allSelects = document.querySelectorAll('#additional-sizes select');
        allSelects.forEach(select => {
            const options = select.querySelectorAll('option');
            options.forEach(option => {
                if (selectedSizesList.includes(option.value)) {
                    option.disabled = true; // Disable selected sizes
                } else {
                    option.disabled = false; // Enable unselected sizes
                }
            });
        });
    }

    // Add an event listener to the new size select to handle size selection
    newSizeSelect.addEventListener('change', function () {
        const selectedValue = newSizeSelect.value;

        if (selectedValue) {
            // If a size is selected
            if (newSizeSelect.dataset.previousValue) {
                // Remove the previous value from the list
                const index = selectedSizesList.indexOf(newSizeSelect.dataset.previousValue);
                if (index > -1) {
                    selectedSizesList.splice(index, 1);
                }
            }

            // Add the new selected value to the list
            if (selectedValue !== 'custom') {
                selectedSizesList.push(selectedValue);
            }

            newSizeSelect.dataset.previousValue = selectedValue; // Store the current value

            // Show custom size fields if "custom" is selected
            if (selectedValue === 'custom') {
                newPriceLabel.classList.add('hidden');
                newPriceInput.classList.add('hidden');
                customSizeDiv.classList.remove('hidden');
                customPriceDiv.classList.remove('hidden');
                newPriceInput.value = ''; // Clear the price input if custom is selected
            } else {
                // If a predefined size is selected, show the price input and hide custom fields
                newPriceLabel.classList.remove('hidden');
                newPriceInput.classList.remove('hidden');
                customSizeDiv.classList.add('hidden');
                customPriceDiv.classList.add('hidden');

                // Clear custom size and price inputs if switching back to predefined sizes
                customSizeInput.value = '';
                customPriceInput.value = '';
            }

            // Update all dropdown options
            updateDropdownOptions();
        } else {
            // If the default option is selected, remove the previous value from the list
            if (newSizeSelect.dataset.previousValue) {
                const index = selectedSizesList.indexOf(newSizeSelect.dataset.previousValue);
                if (index > -1) {
                    selectedSizesList.splice(index, 1);
                }
                newSizeSelect.dataset.previousValue = null; // Clear the previous value
            }

            // Update all dropdown options
            updateDropdownOptions();
        }
    });

    // Update dropdown options initially
    updateDropdownOptions();
});
