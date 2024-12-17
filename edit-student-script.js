import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHGQXISemOWSC60LEt4zWal8oCnAhXVfk",
  authDomain: "onlineenrollmentsystem-d33e0.firebaseapp.com",
  projectId: "onlineenrollmentsystem-d33e0",
  storageBucket: "onlineenrollmentsystem-d33e0.firebasestorage.app",
  messagingSenderId: "669640475583",
  appId: "1:669640475583:web:d81380f621bdc402e7970a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get student ID from URL
const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

if (studentId) {
  // Fetch student data
  const studentDocRef = doc(db, "students", studentId);
  const studentDoc = await getDoc(studentDocRef);

  if (studentDoc.exists()) {
    const student = studentDoc.data();

    // Populate the form with student data
    document.getElementById("edit-first-name").value = student.firstName;
    document.getElementById("edit-last-name").value = student.lastName;
    document.getElementById("edit-course").value = student.course;
    document.getElementById("edit-email").value = student.email;
  }

  // Handle form submission
  document.getElementById("edit-student-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedStudent = {
      firstName: document.getElementById("edit-first-name").value,
      lastName: document.getElementById("edit-last-name").value,
      course: document.getElementById("edit-course").value,
      email: document.getElementById("edit-email").value,
    };

    // Update the student document
    await updateDoc(studentDocRef, updatedStudent);

    alert("Student details updated successfully!");
    window.location.href = "admin-dashboard.html"; // Redirect back to the dashboard
  });
}
