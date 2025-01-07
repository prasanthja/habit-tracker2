// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2LV0KjpKw68y7XnQ410HINhm2_PtB_v8",
  authDomain: "habit-tracker-e469f.firebaseapp.com",
  databaseURL: "https://habit-tracker-e469f-default-rtdb.firebaseio.com",
  projectId: "habit-tracker-e469f",
  storageBucket: "habit-tracker-e469f.firebasestorage.app",
  messagingSenderId: "798400313959",
  appId: "1:798400313959:web:565643f1236a861fe9f2c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitTableContainer = document.getElementById("habitTableContainer");

// Add Habit
addHabitBtn.addEventListener("click", () => {
  const habitName = habitInput.value.trim();
  if (habitName === "") {
    alert("Please enter a habit name!");
    return;
  }
  
  const habitsRef = ref(db, "habits");
  const newHabitRef = push(habitsRef);
  set(newHabitRef, { name: habitName, createdAt: new Date().toISOString() });
  habitInput.value = "";
});

// Load Habits
function loadHabits() {
  const habitsRef = ref(db, "habits");
  onValue(habitsRef, (snapshot) => {
    const data = snapshot.val();
    renderHabitTable(data);
  });
}

// Render Habit Table
function renderHabitTable(data) {
  if (!data) {
    habitTableContainer.innerHTML = "<p>No habits found.</p>";
    return;
  }

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Habit Name</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  Object.entries(data).forEach(([id, habit]) => {
    tableHTML += `
      <tr>
        <td>${habit.name}</td>
        <td>${new Date(habit.createdAt).toLocaleDateString()}</td>
        <td><button class="delete-btn" onclick="deleteHabit('${id}')">Delete</button></td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table>";
  habitTableContainer.innerHTML = tableHTML;
}

// Delete Habit
window.deleteHabit = function (habitId) {
  const habitRef = ref(db, `habits/${habitId}`);
  remove(habitRef);
};

// Initialize
loadHabits();
