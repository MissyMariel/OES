import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHGQXISemOWSC60LEt4zWal8oCnAhXVfk",
  authDomain: "onlineenrollmentsystem-d33e0.firebaseapp.com",
  projectId: "onlineenrollmentsystem-d33e0",
  storageBucket: "onlineenrollmentsystem-d33e0.appspot.com",
  messagingSenderId: "669640475583",
  appId: "1:669640475583:web:d81380f621bdc402e7970a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Admin Login ---
document.getElementById('profile-icon').addEventListener('click', () => {
  const loginForm = document.getElementById('admin-login');
  loginForm.classList.toggle('hidden');
});

const adminEmail = "admin@gmail.com";
const adminPassword = "admin123";

document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;

  if (email === adminEmail && password === adminPassword) {
    window.location.href = 'admin.html';
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
});

// --- Enrollment Form Submission ---
document.getElementById('enrollment-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form data
  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const birthDate = document.getElementById('birth-date').value;
  const genderElement = document.querySelector('input[name="gender"]:checked');
  const gender = genderElement ? genderElement.value : null;
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const zipCode = document.getElementById('zip-code').value.trim();
  const region = document.getElementById('region').value.trim();
  const email = document.getElementById('email').value.trim();
  const civilStatus = document.getElementById('civil-status').value.trim();
  const religion = document.getElementById('religion').value.trim();
  const course = document.getElementById('course').value;

  // Validate required fields
  if (!firstName || !lastName || !birthDate || !gender || !email || !course) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    // Add data to Firestore
    await addDoc(collection(db, 'students'), {
      firstName,
      lastName,
      birthDate,
      gender,
      address,
      city,
      zipCode,
      region,
      email,
      civilStatus,
      religion,
      course,
      timestamp: new Date() // Optional: Add submission timestamp
    });
    alert('Enrollment form submitted successfully!');
    e.target.reset(); // Reset the form fields
  } catch (error) {
    console.error("Error submitting enrollment form:", error);
    alert('Failed to submit form. Please check your network and try again.');
  }
});
