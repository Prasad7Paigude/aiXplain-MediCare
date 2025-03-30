document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Debug: Check localStorage on page load
    const userDataStr = localStorage.getItem('medicare-user');
    console.log('LocalStorage on load:', {
        isLoggedIn: localStorage.getItem('isLoggedIn'),
        userData: userDataStr
    });

    if (userDataStr) {
        try {
            const userData = JSON.parse(userDataStr);
            console.log('User data parsed:', userData);
            
            // Directly try to update username
            const userNameElement = document.getElementById('displayUsername');
            if (userNameElement) {
                userNameElement.textContent = userData.fullName || userData.email.split('@')[0];
                console.log('Updated username directly');
            } else {
                console.log('Username element not found');
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
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
    
    console.log('Login status:', { isLoggedIn, authButtons: !!authButtons, userProfile: !!userProfile });
    
    if (!authButtons || !userProfile) {
        console.log('Missing required elements');
        return;
    }
    
    if (isLoggedIn) {
        // Show user profile, hide auth buttons
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
        
        // Update user name
        try {
            const userDataStr = localStorage.getItem('medicare-user');
            console.log('Raw user data:', userDataStr);
            
            const userData = JSON.parse(userDataStr);
            console.log('Parsed user data:', userData);
            
            const userNameElement = document.querySelector('#displayUsername');
            console.log('Username element:', userNameElement);
            
            if (userData && userNameElement) {
                const displayName = userData.fullName || userData.email.split('@')[0];
                userNameElement.textContent = displayName;
                console.log('Set display name to:', displayName);
            } else {
                console.log('Missing userData or userNameElement');
            }
        } catch (error) {
            console.error('Error updating username:', error);
        }
        
        // If on login/signup page, redirect to loggedin.html
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
            window.location.href = 'loggedin.html';
        }
    } else {
        // Show auth buttons, hide user profile
        authButtons.classList.remove('hidden');
        userProfile.classList.add('hidden');
        
        // If on protected pages, redirect to login
        if (window.location.pathname.includes('loggedin.html')) {
            window.location.href = 'login.html';
        }
    }
}

// Function to setup user profile dropdown
function setupUserProfile() {
    const userProfileToggle = document.getElementById('userProfileToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (!userProfileToggle || !dropdownMenu) {
        console.log('Missing dropdown elements');
        return;
    }
    
    // Initially hide dropdown
    dropdownMenu.style.display = 'none';
    
    // Toggle dropdown on user profile click
    userProfileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (dropdownMenu.style.display === 'none') {
            dropdownMenu.style.display = 'block';
        } else {
            dropdownMenu.style.display = 'none';
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!userProfileToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
}

// Function to setup logout
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Debug: Log data before clearing
            console.log('Clearing user data:', {
                isLoggedIn: localStorage.getItem('isLoggedIn'),
                userData: localStorage.getItem('medicare-user')
            });
            
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
