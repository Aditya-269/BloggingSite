// Utility functions
function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveBlogs(blogs) {
    localStorage.setItem('blogs', JSON.stringify(blogs));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

// Initialize Quill editor
let quill;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Quill
    quill = new Quill("#blog-body", {
        modules: {
            toolbar: true
        },
        theme: "snow"
    });

    loadPostData();
});

function loadPostData() {
    try {
        const editIndex = localStorage.getItem('editIndex');
        if (editIndex === null) {
            throw new Error('No post selected for editing');
        }

        const blogs = getLocalStorage('blogs');
        const post = blogs[editIndex];
        const currentUser = getCurrentUser();

        // Validate user
        if (!currentUser) {
            throw new Error('Please log in to edit posts');
        }
        if (String(currentUser.id) !== String(post.userId)) {
            throw new Error('You are not authorized to edit this post');
        }

        // Fill form with post data
        document.getElementById('editIndex').value = editIndex;
        document.getElementById('title').value = post.title;
        document.getElementById('image').value = post.image || '';
        document.getElementById('description').value = post.description;
        
        // Set Quill content
        if (quill && post.body) {
            quill.root.innerHTML = post.body;
        }
    } catch (error) {
        alert(error.message);
        window.location.href = 'index.html';
    }
}

// Handle form submission
document.getElementById('editPostForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const editIndex = document.getElementById('editIndex').value;
        const blogs = getLocalStorage('blogs');
        const currentUser = getCurrentUser();

        if (!currentUser) {
            throw new Error('Please log in to edit posts');
        }

        const formData = {
            title: document.getElementById('title').value.trim(),
            image: document.getElementById('image').value.trim(),
            description: document.getElementById('description').value.trim(),
            body: quill.root.innerHTML,
            updatedAt: new Date().toISOString()
        };

        // Validate form data
        if (!formData.title || !formData.description || !formData.body) {
            throw new Error('Please fill in all required fields');
        }

        // Update the blog post
        const updatedBlog = {
            ...blogs[editIndex],
            ...formData
        };

        blogs[editIndex] = updatedBlog;
        saveBlogs(blogs);
        
        alert('Post updated successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        alert(error.message);
    }
});
