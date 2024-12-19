   // Initialize Quill editor
   const quill = new Quill("#blog-body", {
    modules: { toolbar: true },
    theme: "snow",
});

// Utility functions
const getBlogs = () => JSON.parse(localStorage.getItem('blogs')) || [];
const saveBlogs = (blogs) => localStorage.setItem('blogs', JSON.stringify(blogs));
const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser')) || null;

// Function to reset the form after submission
function resetForm() {
    document.getElementById('postForm').reset();
    document.getElementById('editIndex').value = '';
    quill.setContents([]); // Reset Quill editor content
}

// Function to pre-fill the form if editing a post
function loadEditData() {
    const params = new URLSearchParams(window.location.search);
    const editIndex = params.get('editIndex');
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert('User not logged in.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    document.getElementById('userId').value = currentUser.id; // Set user ID in hidden field

    if (editIndex !== null) {
        const blogs = getBlogs();
        const post = blogs[editIndex];

        if (post && post.userId === currentUser.id) { // Ensure user can only edit their posts
            document.getElementById('title').value = post.title;
            document.getElementById('image').value = post.image;
            document.getElementById('description').value = post.description;
            quill.root.innerHTML = post.body; // Set Quill editor content
            document.getElementById('editIndex').value = editIndex; // Store edit index in hidden input
            document.getElementById('submitBtn').innerText = 'Update Post'; // Change button text
        } else {
            alert('You are not authorized to edit this post.');
            window.location.href = 'main.html'; // Redirect unauthorized user
        }
    }
}

// Add/Edit Post Handler
document.getElementById('postForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const image = document.getElementById('image').value.trim();
    const description = document.getElementById('description').value.trim();
    const body = quill.root.innerHTML; // Get Quill editor content
    const editIndex = document.getElementById('editIndex').value;
    const userId = document.getElementById('userId').value;

    if (!title || !description || !body || !userId) {
        alert('Please fill all required fields.');
        return;
    }

    const blogs = getBlogs();

    if (editIndex) {
        // Edit existing post
        blogs[editIndex] = { userId, title, image, description, body };
        alert('Post updated successfully!');
    } else {
        // Add new post
        blogs.push({ userId, title, image, description, body });
        alert('Post added successfully!');
    }

    saveBlogs(blogs);
    resetForm();
    window.location.href = 'main.html'; // Redirect to main page after save
});

// Load edit data on page load
window.onload = loadEditData;