document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('loginContainer');
  const signupContainer = document.getElementById('signupContainer');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignupLink = document.getElementById('showSignup');
  const showLoginLink = document.getElementById('showLogin');

  const errorElements = {
    login: document.getElementById('login-error'),
    username: document.getElementById('username-error'),
    email: document.getElementById('email-error'),
    password: document.getElementById('password-error'),
    confirmPassword: document.getElementById('confirm-password-error'),
  };

  // Utility functions
  const clearErrors = () => Object.values(errorElements).forEach(el => (el.textContent = ''));
  const getLocalStorage = key => JSON.parse(localStorage.getItem(key)) || [];
  const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const generateIncrementalID = (users) => (users.length ? users[users.length - 1].id + 1 : 1);
  const isValidEmail = email => email.includes('@') && email.split('@').pop().includes('.');

  const toggleForm = (showLogin) => {
    clearErrors();
    loginContainer.style.display = showLogin ? 'block' : 'none';
    signupContainer.style.display = showLogin ? 'none' : 'block';
  };

  // Toggle Forms
  showSignupLink?.addEventListener('click', () => toggleForm(false));
  showLoginLink?.addEventListener('click', () => toggleForm(true));

  // Signup Form Submission
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    const errors = [];
    if (!username || username.length < 3) errors.push({ field: 'username', msg: 'Username must be at least 3 characters' });
    if (!isValidEmail(email)) errors.push({ field: 'email', msg: 'Invalid email address' });
    if (!password || password.length < 6) errors.push({ field: 'password', msg: 'Password must be at least 6 characters' });
    if (password !== confirmPassword) errors.push({ field: 'confirmPassword', msg: 'Passwords do not match' });

    if (errors.length) {
      errors.forEach(err => (errorElements[err.field].textContent = err.msg));
      return;
    }

    const users = getLocalStorage('users');
    if (users.some(user => user.email === email || user.username === username)) {
      errorElements.email.textContent = 'User with this email or username already exists!';
      return;
    }

    users.push({ 
      id: generateIncrementalID(users), 
      username, 
      email, 
      password, 
      createdAt: new Date().toISOString() 
    });

    setLocalStorage('users', users);
    signupForm.reset();
    toggleForm(true);
  });

  // Login Form Submission
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value;

    const users = getLocalStorage('users');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      setLocalStorage('currentUser', { id: user.id, username: user.username, email: user.email });
      window.location.href = 'main.html';
    } else {
      errorElements.login.textContent = 'Invalid email or password';
    }
  });

  // Global utility functions
  window.getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));
  window.updateUserProfile = (updates) => {
    const users = getLocalStorage('users');
    const currentUser = window.getCurrentUser();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      setLocalStorage('users', users);
      return true;
    }
    return false;
  };
});
