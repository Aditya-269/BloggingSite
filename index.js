    // Function to get blogs from localStorage
    function getBlogs() {
        return JSON.parse(localStorage.getItem('blogs')) || [];
    }

    // Function to get the current user from localStorage
    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    }
  
    const getLocalStorage = key => JSON.parse(localStorage.getItem(key)) || []

    function saveBlogs(blogs) {
        localStorage.setItem('blogs', JSON.stringify(blogs));
    }    

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
    
        if (!blog.reactions[currentUser.id]) {
            blog.reactions[currentUser.id] = null; // Initialize reactions for the user
        }
    
        const currentReaction = blog.reactions[currentUser.id];
    
        if (currentReaction === reactionType) {
            // If the user clicks the same reaction, remove it
            blog.reactions[currentUser.id] = null;
        } else {
            // If the user clicks a different reaction, update it
            blog.reactions[currentUser.id] = reactionType;
        }
    
        saveBlogs(blogs);
        displayBlogs();
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

            const reactionCounts = { like: 0, love: 0, celebrate: 0, insightful: 0 };
            for (const userId in blog.reactions || {}) {
                const reaction = blog.reactions[userId];
                if (reaction) {
                   reactionCounts[reaction]++;
                }
            }
            const userReaction = blog.reactions && blog.reactions[currentUser?.id];
            
            const commentsHTML = blog.comments
            ? blog.comments.map(comment => `<p><strong>${comment.user}:</strong> ${comment.text}</p>`).join('')
            : "<p>No comments yet.</p>";

            return `
                <div class="post">
                    <h2>${blog.title}</h2>
                    <p>${blog.description}</p>
                    ${blog.image ? `<img src="${blog.image}" alt="Post Image" style="width:200px;">` : ""}
                    <p><strong>Author:</strong> ${author ? author.username : "Unknown"}</p>

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

    //Function for add comment
    function addComment(event,postIndex){
        event.preventDefault();

        const blogs=getBlogs();
        const currentUser=getCurrentUser();

        if (!currentUser) {
            alert("You need to be logged in to add a comment.");
            return;
        }

        const commentText=event.target.querySelector('textarea').value.trim();
        if(!commentText){
            alert("Comment cannot be empty.");
            return;
        }

        const blog=blogs[postIndex];
        if(!blog.comments){
            blog.comments=[];
        }

        blog.comments.push({user: currentUser.username,text: commentText});
        saveBlogs(blogs);
        displayBlogs();
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



    