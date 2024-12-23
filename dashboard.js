document.addEventListener('DOMContentLoaded', () => {
  // Retrieve data from localStorage
  const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Guest', email: '' };
  const followers = JSON.parse(localStorage.getItem('followers')) || {};

  // Display current user's username
  document.getElementById('username').textContent = currentUser.username;

  // Display total posts
  document.getElementById('total-posts').textContent = `${blogs.length} Posts`;
  document.getElementById('total-posts-card').textContent = blogs.length;

  // Calculate and display total likes
  const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
  document.getElementById('likes').textContent = `${totalLikes} Likes`;

  // Calculate and display total comments
  const totalComments = blogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0);
  document.getElementById('comments').textContent = `${totalComments} Comments`;



  // Display the three most recent blogs in the "Recent Blogs" section
  const blogsList = document.getElementById('blogs-list');
  blogsList.innerHTML = ''; 

  blogs.slice(-3).reverse().forEach(blog => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <a href="#">
        <strong>${blog.title}</strong> 
        <span style="font-size: 0.9rem; color: #555;">(${blog.comments?.length || 0} Comments)</span>
      </a>`;
    blogsList.appendChild(listItem);
  });

  // Periodically update analytics data
  setInterval(() => {
    const updatedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];

    // Update posts count
    document.getElementById('total-posts').textContent = `${updatedBlogs.length} Posts`;
    document.getElementById('total-posts-card').textContent = updatedBlogs.length;

  }, 2000);
});
