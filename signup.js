document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form data
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Validate phone number (simple validation)
            if (phone.length < 10) {
                showToast('Please enter a valid phone number', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            if (password.length < 6) {
                showToast('Password must be at least 6 characters long', 'error');
                return;
            }

            const userData = { fullName, email, phone, password };

            try {
                showToast('Creating your account...', 'info');
                
                const response = await fetch("http://localhost:5000/signup", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                if (response.ok) {
                    showToast(result.message, 'success');
                    // Store user data in localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('medicare-user', JSON.stringify({
                        fullName,
                        email,
                        phone
                    }));
                    setTimeout(() => window.location.href = 'loggedin.html', 1500);
                } else {
                    showToast(result.message || 'Signup failed', 'error');
                }
            } catch (error) {
                console.error("Signup Error:", error);
                showToast('Unknown error occurred. Please try again.', 'error');
            }
        });
    }

    // Initialize Lucide icons
    lucide.createIcons();
});
