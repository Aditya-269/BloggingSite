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

// Reset the form after submission
function resetPostForm() {
    document.getElementById('postForm').reset();
    document.getElementById('editIndex').value = '';
    if (quill) {
        quill.setContents([]); // Clear Quill editor content
    }
}

// Load existing data for editing
function populateEditForm() {
    const params = new URLSearchParams(window.location.search);
    const editIndex = params.get('editIndex'); // Get the edit index from the URL
    const currentUser = getCurrentUserFromStorage();

    // Debug logs
    console.log('Current User:', currentUser);
    console.log('Edit Index:', editIndex);

    // Redirect if user is not logged in
    if (!currentUser) {
        alert('User not logged in. Please log in to edit posts.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userId').value = currentUser.id; // Set user ID in hidden field

    // Only populate form if we're editing (editIndex exists)
    if (editIndex !== null) {
        const blogs = getBlogsFromStorage();
        const post = blogs[editIndex];

        // Debug log for posts
        console.log('Post Data:', post);

        // Check if the post exists and belongs to the current user
        if (post && post.userId === currentUser.id) {
            document.getElementById('title').value = post.title;
            document.getElementById('image').value = post.image;
            document.getElementById('description').value = post.description;
            
            // Wait for Quill to be initialized before setting content
            const setQuillContent = () => {
                if (quill) {
                    quill.root.innerHTML = post.body;
                } else {
                    // If Quill isn't ready yet, try again in 100ms
                    setTimeout(setQuillContent, 100);
                }
            };
            setQuillContent();
            
            document.getElementById('editIndex').value = editIndex;
            document.getElementById('submitBtn').innerText = 'Update Post';
        } else {
            alert('Unauthorized access: You can only edit your own posts.');
            window.location.href = 'main.html';
        }
    } else {
        // New post - ensure form is clear
        resetPostForm();
        document.getElementById('submitBtn').innerText = 'Create Post';
    }
}

// Handle post submission for adding or editing
document.getElementById('postForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const image = document.getElementById('image').value.trim();
    const description = document.getElementById('description').value.trim();
    const body = quill ? quill.root.innerHTML : ''; // Get content from Quill editor
    const editIndex = document.getElementById('editIndex').value;
    const userId = document.getElementById('userId').value;

    // Validate form inputs
    if (!title || !description || !body || !userId) {
        alert('All fields are required. Please fill in all fields.');
        return;
    }

    const blogs = getBlogsFromStorage();

    if (editIndex !== '') {
        // Update existing post
        blogs[editIndex] = { userId, title, image, description, body };
        alert('Post updated successfully!');
    } else {
        // Create a new post
        blogs.push({ userId, title, image, description, body });
        alert('Post added successfully!');
    }

    saveBlogsToStorage(blogs);
    resetPostForm();
    window.location.href = 'main.html';
});

// Initialize the form when the page loads
window.onload = populateEditForm;