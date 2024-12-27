document.addEventListener('DOMContentLoaded', () => {
  try {
    // Fetch data from localStorage
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    document.getElementById('current-date').textContent = currentDate;

    // Display current user's username
    const usernameElement = document.getElementById('header-username');
    const logoutLink = document.getElementById('logout-link');
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');

    if (currentUser && currentUser.username) {
      usernameElement.textContent = currentUser.username;
      logoutLink.style.display = 'block'; // Show logout
      signupLink.style.display = 'none';  // Hide sign up
      if (loginLink) loginLink.style.display = 'none'; // Hide login if present
    } else {
      usernameElement.textContent = 'Guest';
      logoutLink.style.display = 'none';  // Hide logout
      signupLink.style.display = 'block'; // Show sign up
      if (loginLink) loginLink.style.display = 'block'; // Show login if present
    }

    // Log out functionality
    if (logoutLink) {
      logoutLink.addEventListener('click', () => {
        localStorage.removeItem('currentUser'); // Clear current user data
        window.location.href = 'login.html'; // Redirect to login page
      });
    }

    // Display user name
    document.getElementById('user-name').textContent = currentUser ? currentUser.username : 'Guest';

    // Update total posts
    const totalPostsElement = document.getElementById('total-posts');
    const totalPostsCard = document.getElementById('total-posts-card');
    totalPostsElement.textContent = `${blogs.length} Posts`;
    totalPostsCard.textContent = blogs.length;

    // Calculate and display total likes
    const totalLikes = blogs.reduce((sum, blog) => {
      if (blog.reactions) {
        return (
          sum +
          Object.values(blog.reactions).filter(reaction => reaction === 'like').length
        );
      }
      return sum;
    }, 0);
    document.getElementById('likes').textContent = `${totalLikes} Likes`;

    // Calculate and display total comments
    const totalComments = blogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0);
    document.getElementById('comments').textContent = `${totalComments} Comments`;

    // Display the three most recent blogs
    const blogsList = document.getElementById('blogs-list');
    blogsList.innerHTML = ''; // Clear existing content
    blogs.slice(-3).reverse().forEach(blog => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <a href="#">
          <strong>${blog.title}</strong>
          <span style="font-size: 0.9rem; color: #555;">(${blog.comments?.length || 0} Comments)</span>
        </a>`;
      blogsList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error initializing dashboard:', error);
  }
});
