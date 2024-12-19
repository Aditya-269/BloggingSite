document.addEventListener("DOMContentLoaded", () => {
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const currentPostIndex = localStorage.getItem("currentPost");
    const contentContainer = document.getElementById("blog-content");

    if (currentPostIndex !== null && blogs[currentPostIndex]) {
        const post = blogs[currentPostIndex];
        contentContainer.innerHTML = `
            <h1>${post.title}</h1>
            ${post.image ? `<img src="${post.image}" alt="Blog Image" style="max-width: 100%;">` : ""}
            <p>${post.body}</p>
            <a href="main.html">Back to Blog List</a>
        `;
    } else {
        contentContainer.innerHTML = "<p>No content found.</p>";
    }
});