document.addEventListener('DOMContentLoaded', function() {
    // DNA Helix Animation
    initDNAHelix();
    
    // Initialize appointment form
    initAppointmentForm();
    
    // Initialize stats counter
    initStatsCounter();

    // Initialize user profile
    initUserProfile();
});
  
// DNA Helix Animation
function initDNAHelix() {
    const helix = document.getElementById('dnaHelix');
    if (!helix) return;
    
    // Create strands
    const strand1 = document.createElement('div');
    strand1.className = 'dna-strand';
    
    const strand2 = document.createElement('div');
    strand2.className = 'dna-strand';
    
    // Number of base pairs
    const numPairs = 10;
    const helixHeight = helix.offsetHeight;
    const spacing = helixHeight / numPairs;
    
    // Create base pairs
    for (let i = 0; i < numPairs; i++) {
        // Base pair position
        const yPos = i * spacing;
        const rotation = i * 36; // 360 / 10 to complete a full turn
        
        // Left base
        const leftBase = document.createElement('div');
        leftBase.className = 'dna-base left';
        leftBase.style.top = `${yPos}px`;
        leftBase.style.transform = `rotate(${rotation}deg)`;
        
        // Right base
        const rightBase = document.createElement('div');
        rightBase.className = 'dna-base right';
        rightBase.style.top = `${yPos}px`;
        rightBase.style.transform = `rotate(${rotation}deg)`;
        
        // Connecting line
        const line = document.createElement('div');
        line.className = 'dna-line';
        line.style.top = `${yPos + 2.5}px`; // Center of the base
        line.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        
        strand1.appendChild(leftBase);
        strand2.appendChild(rightBase);
        helix.appendChild(line);
    }
    
    helix.appendChild(strand1);
    helix.appendChild(strand2);
    
    // Animate the helix
    let angle = 0;
    const animate = () => {
        angle += 0.5;
        
        const bases = helix.querySelectorAll('.dna-base');
        const lines = helix.querySelectorAll('.dna-line');
        
        bases.forEach((base, i) => {
            const rotation = (i * 36) + angle;
            base.style.transform = `rotate(${rotation}deg)`;
        });
        
        lines.forEach((line, i) => {
            const rotation = (i * 36) + angle;
            line.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        });
        
        requestAnimationFrame(animate);
    };
    
    animate();
}
  
// Appointment Form
function initAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const department = document.getElementById('department').value;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        
        if (!fullName || !email || !phone || !department || !date || !time) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Validate phone (simple validation for demonstration)
        if (phone.length < 10) {
            showToast('Please enter a valid phone number', 'error');
            return;
        }
        
        // Success - simulating appointment booking
        showToast('Appointment booked successfully! We will contact you shortly.', 'success');
        form.reset();
    });
}
  
// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-count'));
                let startValue = 0;
                let duration = 2000;
                let startTime = null;
                
                function updateValue(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const elapsedTime = timestamp - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    const currentValue = Math.floor(progress * targetValue);
                    
                    target.textContent = currentValue.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateValue);
                    }
                }
                
                requestAnimationFrame(updateValue);
                observer.unobserve(target);
            }
        });
    }, options);
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

// User Profile
function initUserProfile() {
    const userNameElement = document.getElementById('userName');
    const userProfileToggle = document.getElementById('userProfileToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    // Fetch the username from local storage
    const userData = JSON.parse(localStorage.getItem('medicare-user'));
    const username = userData ? userData.name : "User Name";
    userNameElement.textContent = username;

    userProfileToggle.addEventListener('click', function() {
        dropdownMenu.classList.toggle('visible');
    });

    logoutBtn.addEventListener('click', function() {
        // Clear username from local storage and redirect to login page
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('medicare-user');
        window.location.href = 'login.html';
    });
}