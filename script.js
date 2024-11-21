import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAFTD079RQCx7ymJg8X3lu57VltW9xnr5Y",
  authDomain: "online-enrollment-b4ab7.firebaseapp.com",
  projectId: "online-enrollment-b4ab7",
  storageBucket: "online-enrollment-b4ab7.appspot.com",
  messagingSenderId: "646101796341",
  appId: "1:646101796341:web:1b8ab764b760d276ad5cf7",
  measurementId: "G-NFR1JEBNX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

const adminEmail = "admin@gmail.com";
const adminPassword = "admin123";

// Admin login function
document.getElementById('profile-icon').addEventListener('click', () => {
  document.getElementById('admin-login').classList.remove('hidden');
});

document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (email === adminEmail && password === adminPassword) {
      window.location.href = 'admin.html';
    } else {
      document.getElementById('login-error').style.display = 'block';
    }
  } catch (error) {
    alert('Invalid credentials!');
  }
});

// Save student enrollment data to Firestore
document.getElementById('enrollment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const birthDate = document.getElementById('birth-date').value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const zipCode = document.getElementById('zip-code').value;
  const region = document.getElementById('region').value;
  const email = document.getElementById('email').value;
  const civilStatus = document.getElementById('civil-status').value;
  const religion = document.getElementById('religion').value;
  const course = document.getElementById('course').value;

  try {
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
      course
    });
    alert('Enrollment form submitted successfully!');
    // Reset the form
    e.target.reset();
  } catch (error) {
    alert('Error submitting the enrollment form. Please try again.');
  }
});