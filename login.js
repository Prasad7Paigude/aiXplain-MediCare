document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Simple validation
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            try {
                showToast('Logging in...', 'info');
                
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok && result.user) {
                    // Store user data
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('medicare-user', JSON.stringify(result.user));
                    
                    // Show success message
                    showToast(result.message || 'Login successful! Redirecting...', 'success');
                    
                    // Clear form
                    loginForm.reset();
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = 'loggedin.html';
                    }, 1500);
                } else {
                    showToast(result.message || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Login Error:', error);
                showToast('An error occurred. Please try again.', 'error');
            }
        });
    }

    // Check login status and update UI
    checkLoginStatus();
    
    // Setup user profile dropdown
    setupUserProfile();
    
    // Setup logout functionality
    setupLogout();
});

// Function to check login status and update UI
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    
    if (!authButtons || !userProfile) return;
    
    if (isLoggedIn) {
        // Show user profile, hide auth buttons
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
        
        // Update user name
        const userData = JSON.parse(localStorage.getItem('medicare-user'));
        const userNameElement = userProfile.querySelector('.user-name');
        
        if (userData && userNameElement) {
            userNameElement.textContent = userData.fullName || userData.email.split('@')[0];
        }
        
        // If on login/signup page, redirect to home
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
            window.location.href = 'index.html';
        }
    } else {
        // Show auth buttons, hide user profile
        authButtons.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

// Function to setup user profile dropdown
function setupUserProfile() {
    const userInfo = document.querySelector('.user-info');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (!userInfo || !dropdownMenu) return;
    
    userInfo.addEventListener('click', function(e) {
        e.stopPropagation();
        userInfo.classList.toggle('active');
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        userInfo.classList.remove('active');
        dropdownMenu.style.display = 'none';
    });
}

// Function to setup logout
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('medicare-user');
            
            // Show success message
            showToast('Logged out successfully!', 'success');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
}

// Function to show toast messages
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    // Remove existing toasts
    const existingToasts = toastContainer.getElementsByClassName('toast');
    Array.from(existingToasts).forEach(toast => toast.remove());

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i data-lucide="check-circle"></i>';
            break;
        case 'error':
            icon = '<i data-lucide="x-circle"></i>';
            break;
        case 'info':
            icon = '<i data-lucide="info"></i>';
            break;
    }
    
    toast.innerHTML = `
        <div class="toast-content">
            ${icon}
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    lucide.createIcons();

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
