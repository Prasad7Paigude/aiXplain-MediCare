document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Check if user is logged in and update the UI accordingly
    checkLoginStatus();
    
    // Add logout functionality
    setupLogout();

    // Setup dropdown toggle functionality
    setupDropdownToggle();
    
    // Elements
    const medicinesList = document.getElementById('medicinesList');
    const searchInput = document.getElementById('searchInput');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItems = document.getElementById('cartItems');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmount');
    const uploadBtn = document.getElementById('uploadBtn');
    const prescriptionUpload = document.getElementById('prescriptionUpload');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const orderForm = document.getElementById('orderForm');
    
    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Sample medicine data
    const medicines = [
        {
            id: '1',
            name: 'Paracetamol 500mg',
            genericName: 'Acetaminophen',
            price: 35,
            stock: 'In Stock',
            prescriptionRequired: false
        },
        {
            id: '2',
            name: 'Azithromycin 250mg',
            genericName: 'Azithromycin',
            price: 120,
            stock: 'In Stock',
            prescriptionRequired: true
        },
        {
            id: '3',
            name: 'Amoxicillin 500mg',
            genericName: 'Amoxicillin',
            price: 80,
            stock: 'In Stock',
            prescriptionRequired: true
        },
        {
            id: '4',
            name: 'Cetrizine 10mg',
            genericName: 'Cetrizine',
            price: 45,
            stock: 'In Stock',
            prescriptionRequired: false
        },
        {
            id: '5',
            name: 'Pantoprazole 40mg',
            genericName: 'Pantoprazole',
            price: 95,
            stock: 'Low Stock',
            prescriptionRequired: false
        },
        {
            id: '6',
            name: 'Metformin 500mg',
            genericName: 'Metformin',
            price: 60,
            stock: 'In Stock',
            prescriptionRequired: true
        }
    ];
    
    // Initialize the page
    displayMedicines(medicines);
    updateCartUI();
    
    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    uploadBtn.addEventListener('click', () => prescriptionUpload.click());
    
    prescriptionUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });

    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await placeOrder();
        });
    }
    
    // Functions
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMedicines = medicines.filter(medicine => 
            medicine.name.toLowerCase().includes(searchTerm) ||
            medicine.genericName.toLowerCase().includes(searchTerm)
        );
        displayMedicines(filteredMedicines);
    }

    async function placeOrder() {
        if (cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }

        const orderForm = document.getElementById('orderForm');
        
        // Form validation
        if (!orderForm.checkValidity()) {
            orderForm.reportValidity();
            return;
        }

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Prepare order data
        const orderData = {
            name: name,
            email: email,
            phone: phone,
            medicines: cart.map(item => ({
                name: item.name,
                quantity: item.quantity
            })),
            address: address,
            paymentMethod: paymentMethod
        };

        try {
            showToast('Placing your order...', 'info');
            
            console.log('Order data being sent:', JSON.stringify(orderData));
            
            const response = await fetch('http://localhost:5000/order-medicine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok) {
                showToast('Order placed successfully! A confirmation email has been sent to your email address.', 'success');
                // Clear cart and form
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                orderForm.reset();
                updateCartUI();
                
                // Hide order form and show success message
                document.getElementById('cartContent').classList.add('hidden');
                document.getElementById('emptyCart').classList.remove('hidden');
            } else {
                console.error('Order Error:', result);
                showToast(result.message || 'Failed to place order', 'error');
            }
        } catch (error) {
            console.error('Order Error:', error);
            showToast('An error occurred. Please try again.', 'error');
        }
    }

    function displayMedicines(medicinesToDisplay) {
        medicinesList.innerHTML = '';
        medicinesToDisplay.forEach(medicine => {
            const card = document.createElement('div');
            card.className = 'medicine-card';
            card.innerHTML = `
                <h3>${medicine.name}</h3>
                <p class="generic-name">${medicine.genericName}</p>
                <p class="price">₹${medicine.price}</p>
                <p class="stock ${medicine.stock === 'Low Stock' ? 'low-stock' : ''}">${medicine.stock}</p>
                ${medicine.prescriptionRequired ? '<p class="prescription-required">Prescription Required</p>' : ''}
                <button class="btn btn-primary btn-sm add-to-cart" onclick="addToCart(${JSON.stringify(medicine).replace(/"/g, '&quot;')})">
                    <i data-lucide="shopping-cart"></i>
                    Add to Cart
                </button>
            `;
            medicinesList.appendChild(card);
        });
        lucide.createIcons();
    }

    // Make addToCart and removeFromCart available globally
    window.addToCart = function(medicine) {
        const existingItem = cart.find(item => item.id === medicine.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...medicine, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showToast(`${medicine.name} added to cart`, 'success');
    };

    window.removeFromCart = function(medicineId) {
        cart = cart.filter(item => item.id !== medicineId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    };

    function updateCartUI() {
        if (cart.length === 0) {
            emptyCart.classList.remove('hidden');
            cartContent.classList.add('hidden');
            return;
        }

        emptyCart.classList.add('hidden');
        cartContent.classList.remove('hidden');

        // Update cart items
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₹${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-total">
                    <p>₹${item.price * item.quantity}</p>
                    <button class="btn btn-icon btn-danger" onclick="removeFromCart('${item.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        // Update totals
        const subtotal = calculateSubtotal();
        const deliveryFee = 40; // Fixed delivery fee
        const total = subtotal + deliveryFee;

        subtotalAmount.textContent = `₹${subtotal}`;
        totalAmount.textContent = `₹${total}`;

        // Reinitialize icons
        lucide.createIcons();
    }

    function calculateSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
});

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    
    if (isLoggedIn) {
        // User is logged in
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
        
        // Set user name
        const userData = JSON.parse(localStorage.getItem('medicare-user'));
        const userNameElement = document.querySelector('.user-name');
        
        if (userData && userNameElement) {
            if (userData.name) {
                userNameElement.textContent = userData.name;
            } else if (userData.email) {
                userNameElement.textContent = userData.email.split('@')[0];
            }
        }
    } else {
        // User is not logged in
        authButtons.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear login data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('medicare-user');
            
            // Show toast message
            showToast('Logged out successfully', 'success');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
}

// Setup Dropdown Toggle
function setupDropdownToggle() {
    const userProfileToggle = document.getElementById('userProfileToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (userProfileToggle && dropdownMenu) {
        // Toggle dropdown on click
        userProfileToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
            userProfileToggle.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!userProfileToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
                userProfileToggle.classList.remove('active');
            }
        });
    }
}

// Show Toast Messages
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Auto-remove after 3s
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
