import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Your Firebase config (use your own config)
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
const auth = getAuth();

// Reference to the student collection in Firestore
const studentCollectionRef = collection(db, "students");

// Fetch and display student data
async function fetchStudentData(searchQuery = "") {
  const querySnapshot = await getDocs(studentCollectionRef);
  const tableBody = document.querySelector("#student-data-table tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  querySnapshot.forEach((doc) => {
    const student = doc.data();
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

    // Filter by search query (if provided)
    if (
      !searchQuery ||
      fullName.includes(searchQuery) ||
      student.email.toLowerCase().includes(searchQuery)
    ) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.course}</td>
        <td>${student.email}</td>
        <td>
          <div class="action-btns">
            <button class="edit-btn" data-id="${doc.id}">Edit</button>
            <button class="delete-btn" data-id="${doc.id}">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    }
  });
}

// Event delegation for edit and delete buttons
document.querySelector("#student-data-table").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    openEditModal(e.target.dataset.id);
  }

  if (e.target.classList.contains("delete-btn")) {
    deleteStudent(e.target.dataset.id);
  }
});

// Open the edit modal and populate the fields
async function openEditModal(studentId) {
  const studentDocRef = doc(db, "students", studentId);
  const studentDoc = await getDocs(studentDocRef);
  const student = studentDoc.data();

  // Populate the modal fields
  document.getElementById("edit-first-name").value = student.firstName;
  document.getElementById("edit-last-name").value = student.lastName;
  document.getElementById("edit-course").value = student.course;
  document.getElementById("edit-email").value = student.email;

  // Set the current student ID for saving
  document.getElementById("edit-modal").dataset.id = studentId;
  document.getElementById("edit-modal").style.display = "block";
}

// Save the updated student details
async function saveStudentEdits() {
  const studentId = document.getElementById("edit-modal").dataset.id;
  const studentDocRef = doc(db, "students", studentId);

  // Get updated values
  const updatedData = {
    firstName: document.getElementById("edit-first-name").value,
    lastName: document.getElementById("edit-last-name").value,
    course: document.getElementById("edit-course").value,
    email: document.getElementById("edit-email").value,
  };

  // Update Firestore
  await updateDoc(studentDocRef, updatedData);
  alert("Student details updated successfully!");

  // Close modal and refresh data
  closeEditModal();
  fetchStudentData();
}

// Close the edit modal
function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none";
}

// Function to delete student
async function deleteStudent(studentId) {
  const studentDocRef = doc(db, "students", studentId);
  await deleteDoc(studentDocRef);
  alert("Student deleted successfully!");
  fetchStudentData();
}

// Search functionality
document.getElementById("search-input").addEventListener("input", (e) => {
  const searchQuery = e.target.value.toLowerCase();
  fetchStudentData(searchQuery);
});

// Logout function
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html"; // Redirect to the homepage
});

// Call function to fetch and display student data on page load
fetchStudentData();

// Attach event listener to save button in modal
document.getElementById("save-changes-btn").addEventListener("click", saveStudentEdits);

// Attach event listener to close modal button
document.getElementById("close-modal-btn").addEventListener("click", closeEditModal);
