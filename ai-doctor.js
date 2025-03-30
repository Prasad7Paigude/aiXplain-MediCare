document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons({
      attrs: {
        "stroke-width": 1.5,
      },
    });
  }

  // Check login status
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Elements
  const loginSection = document.getElementById("loginSection");
  const chatInputArea = document.getElementById("chatInputArea");
  const loginPrompt = document.getElementById("loginPrompt");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const chatMessages = document.getElementById("chatMessages");

  // Login/Signup buttons
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const loginBtnBottom = document.getElementById("loginBtnBottom");
  const signupBtnBottom = document.getElementById("signupBtnBottom");

  // Dropdown menu for login/signup
  const authDropdownBtn = document.getElementById("authDropdownBtn");
  const authDropdownMenu = document.getElementById("authDropdownMenu");
  const authButtonText = document.getElementById("authButtonText");
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const logoutLink = document.getElementById("logoutLink");

  // Set current year in footer
  const currentYearElement = document.getElementById("currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  authDropdownBtn.addEventListener("click", function () {
    authDropdownMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", function (event) {
    if (
      !authDropdownBtn.contains(event.target) &&
      !authDropdownMenu.contains(event.target)
    ) {
      authDropdownMenu.classList.add("hidden");
    }
  });

  // Update UI based on login status
  updateUIBasedOnLoginStatus(isLoggedIn);

  // Add initial welcome message with personalized greeting
  addInitialWelcomeMessage();

  // Login/Signup button event listeners
  loginBtn.addEventListener("click", navigateToLogin);
  signupBtn.addEventListener("click", navigateToSignup);
  loginBtnBottom.addEventListener("click", navigateToLogin);
  signupBtnBottom.addEventListener("click", navigateToSignup);

  // Send message functionality
  messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  messageInput.addEventListener("input", function () {
    sendButton.disabled = !messageInput.value.trim();
  });

  sendButton.addEventListener("click", sendMessage);

  // Logout functionality
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("medicare-user");
    window.location.reload();
  });

  // Functions
  function updateUIBasedOnLoginStatus(isLoggedIn) {
    const loginSection = document.getElementById("loginSection");
    const chatInputArea = document.getElementById("chatInputArea");
    const loginPrompt = document.getElementById("loginPrompt");

    if (isLoggedIn) {
      // User is logged in
      if (loginSection) loginSection.classList.add("hidden");
      if (chatInputArea) chatInputArea.classList.remove("hidden");
      if (loginPrompt) loginPrompt.classList.add("hidden");

      // Enable the send button if there's text in the input
      const messageInput = document.getElementById("messageInput");
      const sendButton = document.getElementById("sendButton");

      if (messageInput && sendButton) {
        messageInput.addEventListener("input", function () {
          sendButton.disabled = messageInput.value.trim() === "";
        });
      }
    } else {
      // User is not logged in
      if (loginSection) loginSection.classList.remove("hidden");
      if (chatInputArea) chatInputArea.classList.add("hidden");
      if (loginPrompt) loginPrompt.classList.remove("hidden");
    }
  }

  async function getUserFromDatabase(email) {
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      if (data.success) {
        return data.user;
      } else {
        console.error("Error fetching user data:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error connecting to database:", error);
      return null;
    }
  }

  async function addInitialWelcomeMessage() {
    // Get time-appropriate greeting
    const greeting = getTimeBasedGreeting();

    // Get user name if logged in
    let userName = "there";

    if (localStorage.getItem("isLoggedIn") === "true") {
      const userString = localStorage.getItem("medicare-user");
      if (userString) {
        const user = JSON.parse(userString);

        if (user.email) {
          // Try to get user from database first
          const dbUser = await getUserFromDatabase(user.email);

          if (dbUser && dbUser.fullName) {
            // Use first name only from database
            userName = dbUser.fullName.split(" ")[0];
          } else if (user.fullName) {
            // Fallback to localStorage if database fetch fails
            userName = user.fullName.split(" ")[0];
          }
        }
      }
    }

    // Create personalized welcome message
    const welcomeMessage = `${greeting} ${userName}, how can I assist you today?`;

    // Add the welcome message
    addMessage({
      sender: "ai",
      text: welcomeMessage,
      time: getCurrentTime(),
    });
  }

  function getTimeBasedGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function navigateToLogin() {
    window.location.href = "login.html";
  }

  function navigateToSignup() {
    window.location.href = "signup.html";
  }

  async function sendMessage() {
    if (!isLoggedIn) return;

    const text = messageInput.value.trim();
    if (!text) return;

    // Add user message
    addMessage({
      sender: "user",
      text: text,
      time: getCurrentTime(),
    });

    // Clear input
    messageInput.value = "";
    sendButton.disabled = true;

    // Show typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "bot-message typing-indicator";
    typingIndicator.innerHTML =
      '<p><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      // Get user information from localStorage
      const userString = localStorage.getItem("medicare-user");
      let userId = "anonymous";

      if (userString) {
        const user = JSON.parse(userString);
        userId = user.email || "anonymous";
      }

      // Send request to AI Doctor API
      const response = await fetch("http://localhost:5000/api/ai-doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          userId: userId,
        }),
      });

      const data = await response.json();

      // Remove typing indicator
      chatMessages.removeChild(typingIndicator);

      if (data.success) {
        // Add AI response
        addMessage({
          sender: "ai",
          text: data.message,
          time: getCurrentTime(),
        });
      } else {
        // Add error message
        addMessage({
          sender: "ai",
          text: "I'm sorry, I couldn't process your request. Please try again later.",
          time: getCurrentTime(),
        });
        console.error("AI Doctor API Error:", data.message);
      }
    } catch (error) {
      // Remove typing indicator
      chatMessages.removeChild(typingIndicator);

      // Add error message
      addMessage({
        sender: "ai",
        text: "I'm sorry, there was an error connecting to the AI service. Please try again later.",
        time: getCurrentTime(),
      });
      console.error("AI Doctor Error:", error);
    }
  }

  function addMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.className =
      message.sender === "user" ? "user-message" : "bot-message";

    // Format AI messages with proper sections
    if (message.sender === "ai") {
      // Create message container
      const messageText = document.createElement("div");

      // Format the message with proper HTML
      const formattedText = formatAIResponse(message.text);
      messageText.innerHTML = formattedText;

      const messageTime = document.createElement("div");
      messageTime.className = "text-xs mt-1 text-right";
      messageTime.style.opacity = "0.7";
      messageTime.textContent = message.time;

      messageDiv.appendChild(messageText);
      messageDiv.appendChild(messageTime);
    } else {
      // Regular user message (no formatting)
      const messageText = document.createElement("p");
      messageText.textContent = message.text;

      const messageTime = document.createElement("div");
      messageTime.className = "text-xs mt-1 text-right";
      messageTime.style.opacity = "0.7";
      messageTime.textContent = message.time;

      messageDiv.appendChild(messageText);
      messageDiv.appendChild(messageTime);
    }

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to format AI responses with proper sections
  function formatAIResponse(text) {
    // Replace asterisks with proper bold formatting
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Format bullet points
    text = text.replace(/\* (.*?)(?=\n|$)/g, "<li>$1</li>");
    text = text.replace(/<li>(.*?)<\/li>/g, function (match) {
      return '<ul class="list-disc ml-5 my-2">' + match + "</ul>";
    });

    // Remove duplicate UL tags
    text = text.replace(/<\/ul>\s*<ul class="list-disc ml-5 my-2">/g, "");

    // Format sections (lines ending with colon followed by newline)
    text = text.replace(
      /^(.*?):\s*$/gm,
      '<h3 class="text-primary font-bold mt-4 mb-2">$1</h3>'
    );

    // Format important notes and warnings
    text = text.replace(
      /Important Note:|Important Considerations:|When to seek medical attention:|Note:|Warning:/g,
      '<h3 class="text-red-600 font-bold mt-4 mb-2">$&</h3>'
    );

    // Add paragraph breaks
    text = text.replace(/\n\n/g, '</p><p class="my-2">');

    // Wrap the entire text in a paragraph
    text = '<p class="my-2">' + text + "</p>";

    // Fix any HTML issues from multiple replacements
    text = text.replace(/<p class="my-2"><ul/g, "<ul");
    text = text.replace(/<\/ul><\/p>/g, "</ul>");
    text = text.replace(/<p class="my-2"><h3/g, "<h3");
    text = text.replace(/<\/h3><\/p>/g, "</h3>");

    return text;
  }
});
