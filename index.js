// Utility function to get data from localStorage by key
const getLocalStorage = key => JSON.parse(localStorage.getItem(key)) || [];

// Function to save blogs to localStorage
function saveBlogs(blogs) {
    localStorage.setItem('blogs', JSON.stringify(blogs));
}

// Function to get blogs from localStorage
function getBlogs() {
    return getLocalStorage('blogs');
}

// Function to get the current user from localStorage
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

// Function to display blogs
function displayBlogs() {
    const users = getLocalStorage('users');
    const blogs = getBlogs();
    const currentUser = getCurrentUser();
    const container = document.getElementById('blog-list');

    if (blogs.length === 0) {
        container.innerHTML = "<p>No blog posts available.</p>";
        return;
    }

    container.innerHTML = blogs.map((blog, index) => {
        const isAuthor = currentUser && String(currentUser.id) === String(blog.userId);

        // Find the user object for the blog author
        const author = users.find(u => String(u.id) === String(blog.userId));

        // Count reactions for each type
        const reactionCounts = { like: 0, love: 0, celebrate: 0, insightful: 0 };
        for (const userId in blog.reactions || {}) {
            const reaction = blog.reactions[userId];
            if (reaction) {
                reactionCounts[reaction]++;
            }
        }
        const userReaction = blog.reactions && blog.reactions[currentUser?.id];

        // Generate comments HTML
        const commentsHTML = blog.comments
            ? blog.comments.map(comment => `<p><strong>${comment.user}:</strong> ${comment.text}</p>`).join('')
            : "<p>No comments yet.</p>";

        // Display the post date in a readable format and handle missing/invalid dates
        const postDate = blog.date
            ? new Date(blog.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
            : "Unknown Date";

        return `
            <div class="post">
                <h2>${blog.title}</h2>
                <p>${blog.description}</p>
                ${blog.image ? `<img src="${blog.image}" alt="Post Image" style="width:200px;">` : ""}
                <p><strong>Author:</strong> ${author ? author.username : "Unknown"} | <strong>Posted on:</strong> ${postDate}</p>

                <div class="reactions">
                    <button class="reaction-btn ${userReaction === 'like' ? 'active' : ''}" onclick="handleReaction(${index}, 'like')">👍 ${reactionCounts.like}</button>
                    <button class="reaction-btn ${userReaction === 'love' ? 'active' : ''}" onclick="handleReaction(${index}, 'love')">❤️ ${reactionCounts.love}</button>
                    <button class="reaction-btn ${userReaction === 'celebrate' ? 'active' : ''}" onclick="handleReaction(${index}, 'celebrate')">🎉 ${reactionCounts.celebrate}</button>
                    <button class="reaction-btn ${userReaction === 'insightful' ? 'active' : ''}" onclick="handleReaction(${index}, 'insightful')">💡 ${reactionCounts.insightful}</button>
                </div>
                
                <div class="comments">
                    <h3>Comments</h3>
                    <div class="comment-list">${commentsHTML}</div>
                    ${currentUser ? ` 
                        <form onsubmit="addComment(event, ${index})">
                            <textarea placeholder="Write a comment..." required></textarea>
                            <button type="submit">Comment</button>
                        </form>
                    ` : "<p>Login to add a comment.</p>"}
                </div>
                
                <div class="post-actions">
                    <button onclick="viewPost(${index})">Read More</button>
                    ${
                        isAuthor
                            ? `
                                <button onclick="editPost(${index})">Edit</button>
                                <button onclick="deletePost(${index})" class="delete-btn">Delete</button>
                              `
                            : ""
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Function to handle reactions
function handleReaction(postIndex, reactionType) {
    const blogs = getBlogs();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert("You need to be logged in to react.");
        return;
    }

    const blog = blogs[postIndex];
    if (!blog.reactions) {
        blog.reactions = {};
    }

    const currentReaction = blog.reactions[currentUser.id];

    if (currentReaction === reactionType) {
        blog.reactions[currentUser.id] = null; // Remove reaction
    } else {
        blog.reactions[currentUser.id] = reactionType; // Update reaction
    }

    saveBlogs(blogs);
    displayBlogs();
}

// Function to add a comment
function addComment(event, postIndex) {
    event.preventDefault();

    const blogs = getBlogs();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert("You need to be logged in to add a comment.");
        return;
    }

    const commentText = event.target.querySelector('textarea').value.trim();
    if (!commentText) {
        alert("Comment cannot be empty.");
        return;
    }

    const blog = blogs[postIndex];
    if (!blog.comments) {
        blog.comments = [];
    }

    blog.comments.push({ user: currentUser.username, text: commentText });
    saveBlogs(blogs);
    displayBlogs();
}

// Function to create a new blog post
function createBlog(title, description, image = null) {
    const blogs = getBlogs();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert("You need to be logged in to create a blog post.");
        return;
    }

    const currentDate = new Date().toISOString();

    const newBlog = {
        id: blogs.length + 1,
        userId: currentUser.id,
        title: title.trim(),
        description: description.trim(),
        image: image,
        date: currentDate,
        reactions: {},
        comments: []
    };

    blogs.push(newBlog);
    saveBlogs(blogs);
    displayBlogs();
}

// Function to view a blog post
function viewPost(index) {
    localStorage.setItem('currentPost', index);
    window.location.href = 'single.html';
}

// Function to edit a blog post
function editPost(index) {
    const blogs = getBlogs();
    const blog = blogs[index];
    const currentUser = getCurrentUser();

    if (String(blog.userId) !== String(currentUser.id)) {
        alert("You cannot edit someone else's post.");
        return;
    }

    localStorage.setItem('editIndex', index);
    window.location.href = 'edit.html';
}

// Function to delete a blog post
function deletePost(index) {
    const blogs = getBlogs();
    const blog = blogs[index];
    const currentUser = getCurrentUser();

    if (String(blog.userId) !== String(currentUser.id)) {
        alert("You cannot delete someone else's post.");
        return;
    }

    if (confirm("Are you sure you want to delete this post?")) {
        blogs.splice(index, 1);
        saveBlogs(blogs);
        displayBlogs();
    }
}

// Function to set the username dynamically
function setUsername() {
    const user = getCurrentUser();
    const usernameEl = document.getElementById('username');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');

    if (user && user.username) {
        usernameEl.textContent = user.username; // Display the logged-in user's username
        loginLink.style.display = "none"; // Hide Login link
        logoutLink.style.display = "block"; // Show Logout link
    } else {
        usernameEl.textContent = 'Guest'; // Fallback to 'Guest' if no user is logged in
        loginLink.style.display = "block"; // Show Login link
        logoutLink.style.display = "none"; // Hide Logout link
    }
}

// Function to log out the user
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Attach logout event
document.querySelector('.logout')?.addEventListener('click', logoutUser);

// On page load
window.onload = function () {
    displayBlogs();
    setUsername(); // Set the username dynamically on page load
};
