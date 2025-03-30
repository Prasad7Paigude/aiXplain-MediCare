document.addEventListener('DOMContentLoaded', function() {
  // DNA Helix Animation
  initDNAHelix();
  
  // Initialize appointment form
  initAppointmentForm();
  
  // Initialize stats counter
  initStatsCounter();

  // Initialize login redirect
  initLoginRedirect();
  
  // Fix for login button
  initAuthButtons();
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
  
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const department = document.getElementById('department').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const message = document.getElementById('message').value;

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, department, date, time, message })
      });

      if (response.ok) {
        showToast('Appointment booked successfully', 'success');
        form.reset();
      } else {
        const errorText = await response.text();
        let errorMessage = 'An error occurred';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message;
        } catch (e) {
          errorMessage = errorText || 'An unknown error occurred';
        }
        showToast(`Error: ${errorMessage}`, 'error');
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  });
}

// Stats Counter Animation
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  
  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      
      // Check if the end value is a decimal number
      if (Number.isInteger(end)) {
        element.textContent = value.toLocaleString() + '+';
      } else {
        // For decimal numbers (like 98.12), show with fixed decimal places
        const decimal = (progress * (end - start) + start).toFixed(2);
        element.textContent = decimal + '%';
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Ensure we end up with the exact target number
        if (Number.isInteger(end)) {
          element.textContent = end.toLocaleString() + '+';
        } else {
          element.textContent = end.toFixed(2) + '%';
        }
      }
    };
    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseFloat(target.dataset.count);
        target.classList.add('visible');
        animateValue(target, 0, endValue, 2000);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

// Login Redirect
function initLoginRedirect() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    if (!username) {
      showToast('Please enter your username', 'error');
      return;
    }

    // Simulate login process
    localStorage.setItem('username', username);
    window.location.href = 'loggedin.html';
  });
}

// Fix for login and signup buttons
function initAuthButtons() {
  const loginBtn = document.querySelector('.auth-buttons a[href="login.html"]');
  const signupBtn = document.querySelector('.auth-buttons a[href="signup.html"]');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  }
  
  if (signupBtn) {
    signupBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'signup.html';
    });
  }
}