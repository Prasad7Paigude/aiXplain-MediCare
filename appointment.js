document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('medicare-user'));
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }

    // Pre-fill user data
    document.getElementById('name').value = userData.fullName || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('contact').value = userData.phone || '';

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Appointment form
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const contact = document.getElementById('contact').value.trim();
            const doctor = document.getElementById('doctor').value.trim();
            const date = document.getElementById('date').value.trim();
            const time = document.getElementById('time').value.trim();
            
            // Validation
            if (!name || !email || !contact || !doctor || !date || !time) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            // Phone validation
            if (contact.length < 10) {
                showToast('Please enter a valid phone number', 'error');
                return;
            }

            // Date validation
            const selectedDate = new Date(date);
            const now = new Date();
            if (selectedDate < now) {
                showToast('Please select a future date', 'error');
                return;
            }

            const appointmentData = {
                name,
                email,
                contact,
                doctor,
                date,
                time
            };

            try {
                showToast('Booking your appointment...', 'info');
                
                const response = await fetch('http://localhost:5000/book-appointment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(appointmentData)
                });

                const result = await response.json();

                if (response.ok) {
                    showToast(result.message || 'Appointment booked successfully!', 'success');
                    // Reset the form
                    appointmentForm.reset();
                } else {
                    showToast(result.message || 'Failed to book appointment', 'error');
                }
            } catch (error) {
                console.error('Appointment Booking Error:', error);
                showToast('An error occurred. Please try again.', 'error');
            }
        });
    }
});
