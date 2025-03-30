
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize chatbot
    initChatbot();
    
    // Check login status and update UI
    checkLoginStatus();
    
    // Add logout functionality
    setupLogout();
  });
  
  // Header scroll effect
  function initHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    
    // Trigger scroll event on page load to set initial state
    window.dispatchEvent(new Event('scroll'));
  }
  
  // Mobile menu functionality
  function initMobileMenu() {
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('.nav');
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    
    if (!menuButton || !nav) return;
    
    menuButton.addEventListener('click', function() {
      // Create mobile menu if it doesn't exist
      let mobileMenu = document.querySelector('.mobile-menu');
      
      if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        
        // Clone navigation links
        const navClone = nav.cloneNode(true);
        
        // Add auth elements based on login status
        let authElement;
        if (localStorage.getItem('isLoggedIn') === 'true') {
          // User is logged in, clone user profile section
          if (userProfile) {
            authElement = userProfile.cloneNode(true);
          }
        } else {
          // User is not logged in, clone auth buttons
          if (authButtons) {
            authElement = authButtons.cloneNode(true);
          }
        }
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-menu-close';
        closeButton.innerHTML = '<i data-lucide="x"></i>';
        
        mobileMenu.appendChild(closeButton);
        mobileMenu.appendChild(navClone);
        if (authElement) {
          mobileMenu.appendChild(authElement);
        }
        
        document.body.appendChild(mobileMenu);
        
        // Initialize icons in the mobile menu
        lucide.createIcons({
          icons: {
            x: closeButton.querySelector('i[data-lucide="x"]')
          }
        });
        
        // Add close functionality
        closeButton.addEventListener('click', function() {
          mobileMenu.classList.remove('active');
        });
        
        // Add logout functionality to mobile menu
        const mobileLogoutBtn = mobileMenu.querySelector('#logoutBtn');
        if (mobileLogoutBtn) {
          mobileLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
          });
        }
      }
      
      // Toggle mobile menu
      mobileMenu.classList.toggle('active');
    });
  }
  
  // Check if user is logged in
  function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    
    if (!authButtons || !userProfile) return;
    
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
        logout();
      });
    }
  }
  
  // Logout function
  function logout() {
    // Clear login data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('medicare-user');
    
    // Show toast message
    showToast('Logged out successfully', 'success');
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
  
  // Chatbot functionality
  function initChatbot() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.querySelector('.chat-messages');
    const loginPrompt = document.querySelector('.login-prompt');
    
    if (!chatToggle || !chatWindow) return;
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn && chatInput && sendButton && loginPrompt) {
      // Enable chat if logged in
      chatInput.disabled = false;
      sendButton.disabled = false;
      loginPrompt.style.display = 'none';
    }
    
    // Toggle chat window
    chatToggle.addEventListener('click', function() {
      chatWindow.classList.toggle('hidden');
    });
    
    // Close chat window
    if (closeChat) {
      closeChat.addEventListener('click', function() {
        chatWindow.classList.add('hidden');
      });
    }
    
    // Send message functionality
    function sendMessage() {
      if (!chatInput || !chatMessages || !isLoggedIn) return;
      
      const message = chatInput.value.trim();
      
      if (message) {
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
          const botResponses = [
            "I'm here to help with your healthcare needs. Could you provide more details?",
            "Thank you for your message. Would you like to book an appointment with a doctor?",
            "I understand. Let me connect you with the right healthcare professional.",
            "For urgent medical concerns, please call our emergency line at +91 1800 123 4567."
          ];
          
          const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
          addMessage(randomResponse, 'bot');
        }, 1000);
      }
    }
    
    // Add message to chat
    function addMessage(text, sender) {
      if (!chatMessages) return;
      
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${sender}`;
      
      const messageText = document.createElement('p');
      messageText.textContent = text;
      
      messageDiv.appendChild(messageText);
      chatMessages.appendChild(messageDiv);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send message on button click
    if (sendButton) {
      sendButton.addEventListener('click', sendMessage);
    }
    
    // Send message on Enter key
    if (chatInput) {
      chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }
  }
  
  // Toast notification system
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '<i data-lucide="x"></i>';
    
    toast.appendChild(messageSpan);
    toast.appendChild(closeButton);
    toastContainer.appendChild(toast);
    
    // Initialize the close icon
    lucide.createIcons({
      icons: {
        x: closeButton.querySelector('i[data-lucide="x"]')
      }
    });
    
    // Close button functionality
    closeButton.addEventListener('click', function() {
      toast.remove();
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);
  }
  
  // Make showToast globally available
  window.showToast = showToast;
  