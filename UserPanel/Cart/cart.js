// Function to render cart items
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing items
    let totalPrice = 0;

    // Get cart items from local storage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartItems.forEach((item, index) => {
        // Parse the price as a number, ignoring the " BDT" part
        const itemPrice = parseFloat(item.price); // Assuming item.price is already a number
        const itemTotal = itemPrice * item.quantity;
        totalPrice += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.picture}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-category">Category: ${item.category}</div>
                <div class="unit-price">Unit Price: ${itemPrice.toFixed(2)} BDT</div> <!-- Display with BDT -->
            </div>
            <div class="quantity-controls">
                <button class="decrease-quantity">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increase-quantity">+</button>
            </div>
            <div class="item-total">Total: ${(itemTotal).toFixed(2)} BDT</div> <!-- Display with BDT -->
        `;

        // Add event listeners for quantity buttons
        cartItem.querySelector('.increase-quantity').addEventListener('click', () => {
            item.quantity++;
            localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update local storage
            renderCartItems(); // Re-render cart items
        });

        cartItem.querySelector('.decrease-quantity').addEventListener('click', () => {
            if (item.quantity > 0) {
                item.quantity--;
                if (item.quantity === 0) {
                    // Remove item from cart if quantity is zero
                    cartItems.splice(index, 1); // Remove the item from the array
                }
                localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update local storage
                renderCartItems(); // Re-render cart items
            }
        });

        cartItemsContainer.appendChild(cartItem);
    });

    // Update the total price display
    document.getElementById('total-price').innerText = totalPrice.toFixed(2) + ' BDT'; // Display total with BDT
}

// Function to handle the "Order Now" button click
document.getElementById('order-now').addEventListener('click', () => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Get cart items again
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Thank you for your order!");
        // Clear the cart in local storage
        localStorage.removeItem('cartItems');
        renderCartItems(); // Re-render to show empty cart
    }
});

// Initial render of cart items
renderCartItems();

document.getElementById('order-now').addEventListener('click', () => {
    // Redirect to the desired URL
    window.location.href = '/Resturant_Order_QR/UserPanel/Home/home.html'; // Replace with your URL
});