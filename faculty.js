// Data
const students = [
  { id: 1, name: "Aditya", attendance: true, assignment: true, grade: "A" },
  {
    id: 2,
    name: "Omkar Patil",
    attendance: false,
    assignment: true,
    grade: "B",
  },
  {
    id: 3,
    name: "Prathmesh ",
    attendance: true,
    assignment: false,
    grade: "A+",
    },
    {
        id: 4,
        name: "Sahil",
        attendance: false,
        assignment: true,
        grade : "A",
    }
    
];

const announcements = [
  { id: 1, text: "Final project due next week", date: "2024-03-20" },
  { id: 2, text: "Midterm grades posted", date: "2024-03-15" },
];

// Initialize Lucide icons
lucide.createIcons();

// Render attendance list
function renderAttendance() {
  const attendanceList = document.getElementById("attendance-list");
  attendanceList.innerHTML = students
    .map(
      (student) => `
        <div class="student-item">
            <span>${student.name}</span>
            ${
              student.attendance
                ? '<i data-lucide="check-circle-2" class="status-icon status-present"></i>'
                : '<i data-lucide="x-circle" class="status-icon status-absent"></i>'
            }
        </div>
    `
    )
    .join("");
  lucide.createIcons();
}

// Render assignment status
function renderAssignments() {
  const assignmentList = document.getElementById("assignment-list");
  assignmentList.innerHTML = students
    .map(
      (student) => `
        <div class="student-item">
            <span>${student.name}</span>
            <span class="${
              student.assignment ? "status-submitted" : "status-pending"
            }">
                ${student.assignment ? "Submitted" : "Pending"}
            </span>
        </div>
    `
    )
    .join("");
}

// Render announcements
function renderAnnouncements() {
  const announcementList = document.getElementById("announcement-list");
  announcementList.innerHTML = announcements
    .map(
      (announcement) => `
        <div class="announcement">
            <div class="announcement-date">
                <i data-lucide="clock" class="status-icon"></i>
                <span>${announcement.date}</span>
            </div>
            <p>${announcement.text}</p>
        </div>
    `
    )
    .join("");
  lucide.createIcons();
}

// Render grades table
function renderGrades() {
  const gradesTableBody = document.querySelector("#grades-table tbody");
  gradesTableBody.innerHTML = students
    .map(
      (student) => `
        <tr>
            <td>${student.name}</td>
            <td>${student.grade}</td>
        </tr>
    `
    )
    .join("");
}

// Initialize all components
function init() {
  renderAttendance();
  renderAssignments();
  renderAnnouncements();
  renderGrades();
}

// Run initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
