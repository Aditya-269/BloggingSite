let blogs = JSON.parse(localStorage.getItem('blogs')) || [];

function display() {
  const blogList = document.getElementById('blog-list');
  blogList.innerHTML = ''; 

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    const blogElement = document.createElement('div');
    blogElement.className = 'blog';

    blogElement.innerHTML = `
      <div class="blog-title">${blog.title}</div>
      <div class="blog-body">${blog.body}</div>
    
      <div class="blog-actions">
        <button onclick="editBlog(${i})">Edit</button>
        <button class="delete" onclick="deleteBlog(${i})">Delete</button>
        <button class="like" onclick="likeBlog(${i})">Like (${blog.likes})</button>
      </div>
      <div class="blog-comments">
        <span>Comments: ${blog.comments.length}</span>
        <button onclick="addComment(${i})">Add Comment</button>
      </div>
    `;

    blogList.appendChild(blogElement);
  }

  localStorage.setItem('blogs', JSON.stringify(blogs));
}

function addBlog() {
  const title = document.getElementById('blog-title').value.trim();
  const body = document.getElementById('blog-body').value.trim();
  

  if (title && body) {
    blogs.push({ title, body, likes: 0, comments: [] });
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-body').value = '';
    display();
  } else {
    alert('Please enter a title and content.');
  }
}

function editBlog(index) {
  const newTitle = prompt('Edit blog title:', blogs[index].title);
  const newBody = prompt('Edit blog content:', blogs[index].body);

  if (newTitle && newBody) {
    blogs[index].title = newTitle;
    blogs[index].body = newBody;
    display();
  }
}

function deleteBlog(index) {
  if (confirm('Are you sure you want to delete this blog?')) {
    blogs.splice(index, 1);
    display();
  }
}

function likeBlog(index) {
  blogs[index].likes++;
  display();
}

function addComment(index) {
  const comment = prompt('Enter your comment:');
  if (comment) {
    blogs[index].comments.push(comment);
    display();
  }
}

display();
