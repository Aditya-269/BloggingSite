document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup");
    const loginForm = document.getElementById("login");
    const showLogin = document.getElementById("show-login");
    const showSignup = document.getElementById("show-signup");
  
    // Toggle Forms
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      signupForm.classList.remove("active");
      loginForm.classList.add("active");
    });
  
    showSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.remove("active");
      signupForm.classList.add("active");
    });
  
    // Signup Form Submission
    document.getElementById("signupForm").addEventListener("submit", (e) => {
      e.preventDefault();
  
      const username = document.getElementById("signup-username").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
  
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      // Check if user already exists
      const existingUser = users.find(user => user.username === username);
      const existingEmail = users.find(user => user.email === email);
  
      if (existingUser) {
        alert("Username already taken. Please choose a different username.");
      } else if (existingEmail) {
        alert("Email already registered. Please use a different email.");
      } else {
        // Generate unique ID
        const timestamp = Date.now();
        const randomNumber = Math.random();
        const uniqueId = timestamp + randomNumber;
  
        // Add new user to localStorage
        users.push({ username, email, password, userId: uniqueId });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Signup successful! You can now login.");
  
        // Redirect to login form
        signupForm.classList.remove("active");
        loginForm.classList.add("active");
      }
    });
  
    // Login Form Submission
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
  
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
  
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      // Validate user credentials
      const validUser = users.find(user => user.username === username && user.password === password);
  
      if (validUser) {
        alert("Login successful! Welcome, " + validUser.username + ".");
  
        // Store session data (including userId)
        sessionStorage.setItem("loggedInUser", JSON.stringify(validUser));
  
        // Redirect or handle logged-in state
        window.location.href = "dashboard.html"; // Replace with actual dashboard URL
      } else {
        alert("Invalid username or password. Please try again.");
      }
    });
  });
