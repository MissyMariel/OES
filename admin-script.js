import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyAHGQXISemOWSC60LEt4zWal8oCnAhXVfk",
  authDomain: "onlineenrollmentsystem-d33e0.firebaseapp.com",
  projectId: "onlineenrollmentsystem-d33e0",
  storageBucket: "onlineenrollmentsystem-d33e0.firebasestorage.app",
  messagingSenderId: "669640475583",
  appId: "1:669640475583:web:d81380f621bdc402e7970a"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


const studentCollectionRef = collection(db, "students");


async function fetchStudentData(searchQuery = "") {
  try {
    const querySnapshot = await getDocs(studentCollectionRef);
    const tableBody = document.querySelector("#student-data-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    querySnapshot.forEach((doc) => {
      const student = doc.data();
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

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
              <!-- Only the Delete button remains -->
              <button class="delete-btn" data-id="${doc.id}">Delete</button>
            </div>
          </td>
        `;
        tableBody.appendChild(row);
      }
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    alert("An error occurred while fetching student data.");
  }
}


document.querySelector("#student-data-table").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    deleteStudent(e.target.dataset.id);
  }
});


async function openEditModal(studentId) {
  const studentDocRef = doc(db, "students", studentId);
  const studentDoc = await getDoc(studentDocRef);
  const student = studentDoc.data();

  document.getElementById("edit-first-name").value = student.firstName;
  document.getElementById("edit-last-name").value = student.lastName;
  document.getElementById("edit-course").value = student.course;
  document.getElementById("edit-email").value = student.email;

  document.getElementById("edit-modal").dataset.id = studentId;
  document.getElementById("edit-modal").style.display = "block";
}


async function saveStudentEdits() {
  try {
    const studentId = document.getElementById("edit-modal").dataset.id;
    const studentDocRef = doc(db, "students", studentId);

    const updatedData = {
      firstName: document.getElementById("edit-first-name").value,
      lastName: document.getElementById("edit-last-name").value,
      course: document.getElementById("edit-course").value,
      email: document.getElementById("edit-email").value,
    };

    await updateDoc(studentDocRef, updatedData);
    alert("Student details updated successfully!");

    closeEditModal();
    fetchStudentData();
  } catch (error) {
    console.error("Error saving student edits:", error);
    alert("An error occurred while updating the student details.");
  }
}


function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none";
}


async function deleteStudent(studentId) {
  try {
    const studentDocRef = doc(db, "students", studentId);
    await deleteDoc(studentDocRef);
    alert("Student deleted successfully!");
    fetchStudentData();
  } catch (error) {
    console.error("Error deleting student:", error);
    alert("An error occurred while deleting the student.");
  }
}


document.getElementById("search-input").addEventListener("input", (e) => {
  const searchQuery = e.target.value.toLowerCase();
  fetchStudentData(searchQuery);
});


document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html"; 
});


fetchStudentData();


document.getElementById("save-changes-btn").addEventListener("click", saveStudentEdits);


document.getElementById("close-modal-btn").addEventListener("click", closeEditModal);
