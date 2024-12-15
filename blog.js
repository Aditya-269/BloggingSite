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
      
      ${blog.image ? `<img src="${blog.image}" alt="Blog Image" class="blog-img">` : ''}

      <div class="blog-reactions">
        <button onclick="addReaction(${i}, 'like')">👍 Like (${blog.reactions.like || 0})</button>
        <button onclick="addReaction(${i}, 'love')">❤️ Love (${blog.reactions.love || 0})</button>
        <button onclick="addReaction(${i}, 'celebrate')">🎉 Celebrate (${blog.reactions.celebrate || 0})</button>
        <button onclick="addReaction(${i}, 'insightful')">💡 Insightful (${blog.reactions.insightful || 0})</button>
      </div>
      <div class="blog-actions">
        <button onclick="editBlog(${i})">Edit</button>
        <button class="delete" onclick="deleteBlog(${i})">Delete</button>
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

  const addImg= document.getElementById('blog-img');
  let imgBase64='';
  // Check if an image is uploaded
  if(addImg.files.length > 0){
     const file=addImg.files[0];
     const reader=new FileReader();

     reader.onload = function (e){
      imgBase64=e.target.result;
      saveBlog(title,body,imgBase64);
     };

     reader.readAsDataURL(file);
  }else{
    saveBlog(title,body,null);
  }
  
 function saveBlog(title,body,image){
  if (title && body) {
    blogs.push({ title, body,image, reactions: { like: 0, love: 0, celebrate: 0, insightful: 0}, comments: [] });
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-body').value = '';
    document.getElementById('blog-img').value = '';
    display();
  } else {
    alert('Please enter a title and content.');
  }
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

function addReaction(index, type) {
  if (blogs[index].reactions[type] !== undefined) {
    blogs[index].reactions[type]++;
    display();
  }
}

function addComment(index) {
  const comment = prompt('Enter your comment:');
  if (comment) {
    blogs[index].comments.push(comment);
    display();
  }
}

display();
