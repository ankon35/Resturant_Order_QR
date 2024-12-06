
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
            const sizes = ['small', 'medium', 'large'];
            sizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size.charAt(0).toUpperCase() + size.slice(1);
                // Disable option if it has already been selected
                if (selectedSizes.has(size)) {
                    option.disabled = true;
                }
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

            // Add an event listener to the new size select to track selected sizes
            newSizeSelect.addEventListener('change', function () {
                const selectedValue = newSizeSelect.value;

                // If a size is selected
                if (selectedValue) {
                    // If the previous value was not the default, remove it from the set
                    if (newSizeSelect.dataset.previousValue) {
                        selectedSizes.delete(newSizeSelect.dataset.previousValue);
                    }
                    // Add the new selected value to the set
                    selectedSizes.add(selectedValue);
                    newSizeSelect.dataset.previousValue = selectedValue; // Store the current value for future reference

                    // Disable the selected option in all future dropdowns
                    const allSelects = document.querySelectorAll('#additional-sizes select');
                    allSelects.forEach(select => {
                        const options = select.querySelectorAll('option');
                        options.forEach(option => {
                            if (selectedSizes.has(option.value)) {
                                option.disabled = true;
                            }
                        });
                    });
                } else {
                    // If the default option is selected, remove the previous value from the set
                    if (newSizeSelect.dataset.previousValue) {
                        selectedSizes.delete(newSizeSelect.dataset.previousValue);
                        newSizeSelect.dataset.previousValue = null; // Clear the previous value
                    }
                }

                // Re-enable previously selected sizes in all dropdowns
                const allSelects = document.querySelectorAll('#additional-sizes select');
                allSelects.forEach(select => {
                    const options = select.querySelectorAll('option');
                    options.forEach(option => {
                        if (!selectedSizes.has(option.value)) {
                            option.disabled = false; // Enable the option if it's not in the selectedSizes set
                        }
                    });
                });
            });
        });
