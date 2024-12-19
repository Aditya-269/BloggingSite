document.addEventListener('DOMContentLoaded', () => {
  const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Guest' };
  const followers = JSON.parse(localStorage.getItem('followers')) || {}; 


  document.getElementById('username').textContent = currentUser.username;


  document.getElementById('total-posts').textContent = `${blogs.length} Posts`;
  document.getElementById('total-posts-card').textContent = blogs.length;

  const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
  document.getElementById('likes').textContent = `${totalLikes} Likes`;


  const totalComments = blogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0);
  document.getElementById('comments').textContent = `${totalComments} Comments`;

  const currentUserFollowers = followers[currentUser.email] || []; 
  document.getElementById('followers').textContent = `${currentUserFollowers.length} Followers`;

  function addFollower(userEmail, followerEmail) {
    const followers = JSON.parse(localStorage.getItem('followers')) || {};
    if (!followers[userEmail]) {
      followers[userEmail] = [];
    }
    if (!followers[userEmail].includes(followerEmail)) {
      followers[userEmail].push(followerEmail);
      localStorage.setItem('followers', JSON.stringify(followers));
      alert("Followed successfully!");
    } else {
      alert("You are already following this user.");
    }
  }
  

  
  const blogsList = document.getElementById('blogs-list');
  blogsList.innerHTML = ''; 

  blogs.slice(-3).reverse().forEach(blog => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<a href="#">${blog.title} <span>${blog.comments?.length || 0} Comments</span></a>`;
    blogsList.appendChild(listItem);
  });

 
  setInterval(() => {
    const updatedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const updatedFollowers = JSON.parse(localStorage.getItem('followers')) || {};

    document.getElementById('total-posts').textContent = `${updatedBlogs.length} Posts`;
    document.getElementById('total-posts-card').textContent = updatedBlogs.length;

    const updatedLikes = updatedBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
    document.getElementById('likes').textContent = `${updatedLikes} Likes`;

    const updatedComments = updatedBlogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0);
    document.getElementById('comments').textContent = `${updatedComments} Comments`;

    const updatedUserFollowers = updatedFollowers[currentUser.email] || [];
    document.getElementById('followers').textContent = `${updatedUserFollowers.length} Followers`;
  }, 2000);
});
