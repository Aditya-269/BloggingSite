// Initialize the Quill editor
let quill;

// Wait for DOM to be fully loaded before initializing Quill
document.addEventListener('DOMContentLoaded', () => {
    quill = new Quill("#blog-body", {
        modules: { toolbar: true },
        theme: "snow",
    });
});

// Utility functions to manage blog posts
const getBlogsFromStorage = () => JSON.parse(localStorage.getItem('blogs')) || [];
const saveBlogsToStorage = (blogs) => localStorage.setItem('blogs', JSON.stringify(blogs));
const getCurrentUserFromStorage = () => JSON.parse(localStorage.getItem('currentUser')) || null;

// Generate a unique ID
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Reset the form after submission
function resetPostForm() {
    document.getElementById('postForm').reset();
    document.getElementById('editIndex').value = '';
    if (quill) {
        quill.setContents([]); // Clear Quill editor content
    }
}

// Handle post submission for adding or editing
document.getElementById('postForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const currentUser = getCurrentUserFromStorage();
    if (!currentUser) {
        alert('Please log in to create or edit posts.');
        window.location.href = 'login.html';
        return;
    }

    const title = document.getElementById('title').value.trim();
    const image = document.getElementById('image').value.trim();
    const description = document.getElementById('description').value.trim();
    const postDate = document.getElementById('postDate').value;
    const body = quill ? quill.root.innerHTML : '';
    const userId = currentUser.id;

    // Validate form inputs
    if (!title || !description || !body || !postDate) {
        alert('Please fill in all required fields.');
        return;
    }

    const blogs = getBlogsFromStorage();
    const newPost = {
        id: generateId(),
        userId,
        title,
        image,
        description,
        body,
        date: postDate,
        createdAt: new Date().toISOString()
    };
    
    blogs.push(newPost);
    
    saveBlogsToStorage(blogs);
    alert('Post created successfully!');
    resetPostForm();
    window.location.href = 'index.html';
});