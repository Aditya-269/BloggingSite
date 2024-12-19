    // Function to get blogs from localStorage
    function getBlogs() {
        return JSON.parse(localStorage.getItem('blogs')) || [];
    }

    // Function to get the current user from localStorage
    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    }
  
    const getLocalStorage = key => JSON.parse(localStorage.getItem(key)) || [];

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
        
            return `
                <div class="post">
                    <h2>${blog.title}</h2>
                    <p>${blog.description}</p>
                    ${blog.image ? `<img src="${blog.image}" alt="Post Image" style="width:200px;">` : ""}
                    <p><strong>Author:</strong> ${author ? author.username : "Unknown"}</p>
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

    // Function to view a blog post
    function viewPost(index) {
        localStorage.setItem('currentPost', index);
        window.location.href = 'single.html'; 
    }

    function editPost(index) {
        const blogs = getBlogs();
        const blog = blogs[index];
        const currentUser = getCurrentUser();

        if (String(blog.userId) !== String(currentUser.id)) {
            alert("You cannot edit someone else's post.");
            return;
        }

        localStorage.setItem('editIndex', index);
        window.location.href = 'blog.html'; 
    }

    function deletePost(index) {
        const blogs = getBlogs();
        const blog = blogs[index];
        const currentUser = getCurrentUser();

        if (String(blog.userId) !== String(currentUser.id)) {
            alert("You cannot delete someone else's post.");
            return;
        }

        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            blogs.splice(index, 1); // Remove the blog post
            localStorage.setItem('blogs', JSON.stringify(blogs));
            displayBlogs(); // Re-render the blog list
        }
    }

    // Function to set the username dynamically
    function setUsername() {
        const user = getCurrentUser();
        const usernameEl = document.getElementById('username');

        if (user && user.username) {
            usernameEl.textContent = user.username; // Display the stored username
        } else {
            usernameEl.textContent = 'Guest'; // Fallback if no user is logged in
        }
    }

    // Function to log out the user
    function logoutUser() {
        localStorage.removeItem('currentUser'); // Clear current user data
        window.location.href = 'login.html'; // Redirect to login page
    }

    // Attach logout event to logout button
    document.querySelector('.logout')?.addEventListener('click', logoutUser);

    // On page load, display blogs and set the username
    window.onload = function () {
        displayBlogs(); // Display blog posts
        setUsername();  // Set the current username dynamically
    };