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

    // Set up the modal functionality
    setupBedBookingModal();

    // Set up the form submission
    setupBedBookingForm();

    // Define hospital data
    const hospitals = {
        'city-hospital': {
            name: 'City Hospital',
            location: 'Central City',
            contact: '+1 234 567 890',
            facilities: ['24/7 Emergency', 'ICU', 'General Ward', 'Private Rooms'],
            specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
            rating: 4.5,
            bedTypes: ['General Ward', 'Private Room', 'ICU'],
            fees: {
                'General Ward': 2000,
                'Private Room': 5000,
                'ICU': 8000
            }
        },
        'apollo': {
            name: 'Apollo Hospital',
            location: 'North City',
            contact: '+1 234 567 891',
            facilities: ['Emergency Care', 'ICU', 'NICU', 'Private Rooms'],
            specialties: ['Pediatrics', 'Oncology', 'Gastroenterology'],
            rating: 4.8,
            bedTypes: ['General Ward', 'Private Room', 'ICU', 'NICU'],
            fees: {
                'General Ward': 2500,
                'Private Room': 6000,
                'ICU': 10000,
                'NICU': 12000
            }
        },
        'fortis': {
            name: 'Fortis Hospital',
            location: 'South City',
            contact: '+1 234 567 892',
            facilities: ['24/7 Emergency', 'ICU', 'Private Rooms'],
            specialties: ['Cardiology', 'Urology', 'Nephrology'],
            rating: 4.6,
            bedTypes: ['General Ward', 'Private Room', 'ICU'],
            fees: {
                'General Ward': 2200,
                'Private Room': 5500,
                'ICU': 9000
            }
        },
        'max': {
            name: 'Max Healthcare',
            location: 'East City',
            contact: '+1 234 567 893',
            facilities: ['Emergency Care', 'ICU', 'General Ward'],
            specialties: ['Orthopedics', 'Neurology', 'Psychiatry'],
            rating: 4.7,
            bedTypes: ['General Ward', 'Private Room', 'ICU'],
            fees: {
                'General Ward': 2300,
                'Private Room': 5800,
                'ICU': 9500
            }
        }
    };

    // Quick book functionality
    window.quickBookBed = function(hospitalId) {
        const userData = JSON.parse(localStorage.getItem('medicare-user'));
        if (!userData) {
            showToast('Please log in to book a bed', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        // Open the booking modal
        const modal = document.getElementById('bedBookingModal');
        modal.classList.add('active');
        
        // Pre-fill user data
        document.getElementById('patientName').value = userData.fullName || '';
        document.getElementById('patientEmail').value = userData.email || '';
        document.getElementById('patientContact').value = userData.phone || '';
        
        // Set the hospital in the dropdown
        const hospitalSelect = document.getElementById('hospitalName');
        const hospital = hospitals[hospitalId];
        
        if (hospital) {
            // Find the option with the hospital name
            for (let i = 0; i < hospitalSelect.options.length; i++) {
                if (hospitalSelect.options[i].value === hospital.name) {
                    hospitalSelect.selectedIndex = i;
                    break;
                }
            }
            
            // Trigger change event to update ward types
            const event = new Event('change');
            hospitalSelect.dispatchEvent(event);
        }
        
        // Set minimum date to today for admission date
        const dateInput = document.getElementById('admissionDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    };

    // View hospital details
    window.viewHospitalDetails = function(hospitalId) {
        const hospital = hospitals[hospitalId];
        if (!hospital) return;

        // Create modal content
        const modalContent = `
            <div class="hospital-details">
                <h2>${hospital.name}</h2>
                <p class="location"><i data-lucide="map-pin"></i> ${hospital.location}</p>
                <p class="contact"><i data-lucide="phone"></i> ${hospital.contact}</p>
                <div class="rating">
                    <i data-lucide="star"></i>
                    <span>${hospital.rating} / 5.0</span>
                </div>
                <div class="facilities">
                    <h3>Facilities</h3>
                    <ul>
                        ${hospital.facilities.map(f => `<li><i data-lucide="check-circle"></i> ${f}</li>`).join('')}
                    </ul>
                </div>
                <div class="specialties">
                    <h3>Specialties</h3>
                    <ul>
                        ${hospital.specialties.map(s => `<li><i data-lucide="activity"></i> ${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="bed-types">
                    <h3>Available Bed Types</h3>
                    <div class="bed-type-buttons">
                        ${hospital.bedTypes.map(type => `
                            <button class="btn btn-primary btn-sm mb-2" onclick="quickBookBed('${hospitalId}')">
                                <i data-lucide="bed"></i> Book ${type} (₹${hospital.fees[type]}/day)
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Show modal with hospital details
        showModal(modalContent);
    };

    function setupBedBookingModal() {
        const bookBedBtn = document.getElementById('bookBedBtn');
        const modal = document.getElementById('bedBookingModal');
        const closeBtn = document.getElementById('closeModal');
        
        if (bookBedBtn) {
            bookBedBtn.addEventListener('click', function() {
                // Check if user is logged in
                const userData = JSON.parse(localStorage.getItem('medicare-user'));
                if (!userData) {
                    showToast('Please log in to book a bed', 'error');
                    setTimeout(() => window.location.href = 'login.html', 1500);
                    return;
                }
                
                modal.classList.add('active');
                
                // Pre-fill user data
                document.getElementById('patientName').value = userData.fullName || '';
                document.getElementById('patientEmail').value = userData.email || '';
                document.getElementById('patientContact').value = userData.phone || '';
                
                // Set minimum date to today
                const dateInput = document.getElementById('admissionDate');
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
                dateInput.value = today;
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    function setupBedBookingForm() {
        const form = document.getElementById('bedBookingForm');
        const hospitalSelect = document.getElementById('hospitalName');
        const wardTypeSelect = document.getElementById('wardType');
        
        // Update ward types based on selected hospital
        if (hospitalSelect) {
            hospitalSelect.addEventListener('change', function() {
                const selectedHospital = this.value;
                
                // Find the hospital in our data
                let hospitalData = null;
                for (const id in hospitals) {
                    if (hospitals[id].name === selectedHospital) {
                        hospitalData = hospitals[id];
                        break;
                    }
                }
                
                if (hospitalData) {
                    // Clear existing options
                    wardTypeSelect.innerHTML = '<option value="">Select ward type</option>';
                    
                    // Add new options based on hospital bed types
                    hospitalData.bedTypes.forEach(type => {
                        const option = document.createElement('option');
                        option.value = type;
                        option.textContent = `${type} (₹${hospitalData.fees[type]}/day)`;
                        wardTypeSelect.appendChild(option);
                    });
                }
            });
        }
        
        // Form submission
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Get form data
                const patientName = document.getElementById('patientName').value.trim();
                const patientEmail = document.getElementById('patientEmail').value.trim();
                const patientContact = document.getElementById('patientContact').value.trim();
                const hospitalName = document.getElementById('hospitalName').value.trim();
                const wardType = document.getElementById('wardType').value.trim();
                const admissionDate = document.getElementById('admissionDate').value.trim();
                
                // Validation
                if (!patientName || !patientEmail || !patientContact || !hospitalName || !wardType || !admissionDate) {
                    showToast('Please fill in all required fields', 'error');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(patientEmail)) {
                    showToast('Please enter a valid email address', 'error');
                    return;
                }
                
                // Phone validation
                if (patientContact.length < 10) {
                    showToast('Please enter a valid phone number', 'error');
                    return;
                }
                
                // Get fees for the selected ward type
                let feesPerDay = 0;
                for (const id in hospitals) {
                    if (hospitals[id].name === hospitalName) {
                        // Extract the ward type without the fee information
                        const wardTypeOnly = wardType.split(' (')[0];
                        feesPerDay = hospitals[id].fees[wardTypeOnly];
                        break;
                    }
                }
                
                // Create booking data
                const bookingData = {
                    patientName,
                    patientEmail,
                    patientContact,
                    hospitalName,
                    wardType: wardType.split(' (')[0], // Extract just the ward type without fees
                    admissionDate,
                    feesPerDay,
                    status: 'pending',
                    bookingDate: new Date().toISOString(),
                    id: 'BED' + Math.floor(100000 + Math.random() * 900000) // Generate a random ID for demo
                };
                
                try {
                    showToast('Processing your booking...', 'info');
                    
                    // Try to send data to the server to store in the database
                    try {
                        const response = await fetch('/api/bed-bookings', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(bookingData)
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            // Update the ID if we got one from the server
                            if (result.id) {
                                bookingData.id = result.id;
                            }
                        }
                    } catch (apiError) {
                        console.log('API not available, using local storage instead');
                        // If API fails, store in localStorage as fallback
                        const existingBookings = JSON.parse(localStorage.getItem('bedBookings')) || [];
                        existingBookings.push(bookingData);
                        localStorage.setItem('bedBookings', JSON.stringify(existingBookings));
                    }
                    
                    // Show success message regardless of API success
                    showToast('Bed booked successfully!', 'success');
                    
                    // Close the modal
                    document.getElementById('bedBookingModal').classList.remove('active');
                    
                    // Reset the form
                    form.reset();
                    
                    // Show confirmation popup
                    showConfirmationPopup(bookingData);
                    
                } catch (error) {
                    console.error('Booking Error:', error);
                    showToast('An error occurred. Please try again.', 'error');
                }
            });
        }
    }

    function showConfirmationPopup(bookingData) {
        const modalContent = `
            <div class="booking-confirmation">
                <div class="text-center mb-4">
                    <i data-lucide="check-circle" class="text-success w-16 h-16 mx-auto"></i>
                    <h2 class="text-xl font-bold mt-2">Booking Confirmed!</h2>
                    <p class="text-gray-600">Your hospital bed has been successfully booked.</p>
                </div>
                
                <div class="booking-details">
                    <h3 class="font-semibold text-primary mb-2">Booking Details</h3>
                    <ul class="space-y-2">
                        <li><strong>Booking ID:</strong> ${bookingData.id || 'N/A'}</li>
                        <li><strong>Patient:</strong> ${bookingData.patientName}</li>
                        <li><strong>Hospital:</strong> ${bookingData.hospitalName}</li>
                        <li><strong>Ward Type:</strong> ${bookingData.wardType}</li>
                        <li><strong>Admission Date:</strong> ${new Date(bookingData.admissionDate).toLocaleDateString()}</li>
                        <li><strong>Daily Fee:</strong> ₹${bookingData.feesPerDay}</li>
                    </ul>
                </div>
                
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600 mb-4">A confirmation email has been sent to ${bookingData.patientEmail}</p>
                    <button class="btn btn-primary" onclick="this.closest('.modal').classList.remove('active')">
                        <i data-lucide="check"></i> Done
                    </button>
                </div>
            </div>
        `;
        
        showModal(modalContent);
    }

    function showModal(content) {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">
                    <i data-lucide="x"></i>
                </button>
                ${content}
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);
        lucide.createIcons();

        // Close modal on click outside or close button
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.closest('.modal-close')) {
                modal.remove();
            }
        });
    }
});

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userProfile = document.querySelector('.user-profile');
    
    if (isLoggedIn) {
        // User is logged in
        userProfile.classList.remove('hidden');
        
        // Set user name
        const userData = JSON.parse(localStorage.getItem('medicare-user'));
        const userNameElement = document.getElementById('displayUsername');
        
        if (userData && userNameElement) {
            if (userData.fullName) {
                userNameElement.textContent = userData.fullName;
            } else if (userData.email) {
                userNameElement.textContent = userData.email.split('@')[0];
            }
        }
    } else {
        // User is not logged in
        userProfile.classList.add('hidden');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear login status
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('medicare-user');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
}

// Setup dropdown toggle
function setupDropdownToggle() {
    const userProfileToggle = document.getElementById('userProfileToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (userProfileToggle && dropdownMenu) {
        userProfileToggle.addEventListener('click', function() {
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userProfileToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

// Show toast message
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                type === 'error' ? 'alert-circle' : 
                type === 'info' ? 'info' : 'bell';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i data-lucide="${icon}"></i>
        </div>
        <div class="toast-content">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    lucide.createIcons();
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
