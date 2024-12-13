

document.addEventListener('DOMContentLoaded', () => {
  
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  
   
    document.getElementById('total-posts').textContent = `${blogs.length} Posts`;
    document.getElementById('total-posts-card').textContent = blogs.length;
  
    
    const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
    document.getElementById('likes').textContent = `${totalLikes} Likes`;
  

    const totalComments = blogs.reduce((sum, blog) => sum + blog.comments.length, 0);
    document.getElementById('comments').textContent = `${totalComments} Comments`;
  
  
    const blogsList = document.getElementById('blogs-list');
    blogsList.innerHTML = ''; 
  
    blogs.slice(-3).reverse().forEach(blog => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<a href="#">${blog.title} <span>${blog.comments.length} Comments</span></a>`;
      blogsList.appendChild(listItem);
    });
  
    
    setInterval(() => {
      const updatedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
  
     
      document.getElementById('total-posts').textContent = `${updatedBlogs.length} Posts`;
      document.getElementById('total-posts-card').textContent = updatedBlogs.length;
  
      const updatedLikes = updatedBlogs.reduce((sum, blog) => sum + blog.likes, 0);
      document.getElementById('likes').textContent = `${updatedLikes} Likes`;
  
      const updatedComments = updatedBlogs.reduce((sum, blog) => sum + blog.comments.length, 0);
      document.getElementById('comments').textContent = `${updatedComments} Comments`;
    }, 5000); 
  });
  