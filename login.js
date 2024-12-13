let loginbtn = document.getElementById("login_btn");
let signUpPage = document.getElementById("signup");
let loginPage = document.getElementById("Login");
let loginbttn = document.getElementById("loginbtn");
let signupbttn = document.getElementById("signupbtn");
let signupbtn = document.getElementById("signup_btn");


loginbtn.addEventListener("click", (e) => {
  signUpPage.style.display = "none";
  loginPage.style.display = "block";
});

signupbtn.addEventListener("click", (e) => {
  signUpPage.style.display = "block";
  loginPage.style.display = "none";
});

signupbttn.addEventListener("click", (e) => {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let username = document.getElementById("username").value;
  
  if (!email || !password || !username) {
    alert("Please fill all the fields");
    return;
  }

  if (localStorage.getItem(email) === password) {
    alert("User Registered Already");
    return;
  }

  const newUser = {username,password,email};

  localStorage.setItem(email,JSON.stringify(newUser));
  alert("New User Registered");
  loginbtn.click();
});

loginbtn.addEventListener("click", (e) => {
  e.preventDefault();
  let email = document.getElementById("email-login").value;
  let password = document.getElementById("password-login").value;

  if (!email || !password) {
    alert("Please fill all the fields");
    return;
  }

  const parsedUserData = JSON.parse(localStorage.getItem(email));
  if (!(parsedUserData.password == password)) {
    alert("Email or Password is incorrect");
    return;
  }
  alert("User Login Successfull");
  localStorage.setItem("isLoggedIn", email);
  window.location.href = "landing.html";
});
