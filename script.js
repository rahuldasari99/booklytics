window.addEventListener("DOMContentLoaded", () => {
  const studentnameele = document.getElementById("ustudentname");
  const searchForm = document.getElementById("searchForm");

  // Load all students initially
  fetchStudentData();

  // Search form submit handler
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page reload
    fetchstudentsearch(studentnameele.value);
  });
});

function fetchStudentData() {
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const students = data.Sheet1;
      const tbody = document.querySelector("#studentTable tbody");
      tbody.innerHTML = "";

      students.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.Student_ID}</td>
          <td>${student.Student_Name}</td>
          <td>${student.Department}</td>
          <td>${student.Year}</td>
          <td>${student.Book_Title}</td>
          <td>${student.Category}</td>
          <td>${student.Borrow_Date}</td>
          <td>${student.Return_Date}</td>
          <td>${student.Days_Borrowed}</td>
          <td>₹${student.Fine_Amount}</td>
          <td>⭐${student.Rating}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error loading data:", err));
}

function fetchstudentsearch(searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  const tbody = document.querySelector("#studentTable tbody");

  if (term === "") {
    alert("Please enter student name or ID");
    return;
  }

  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const students = data.Sheet1;

     const filtered = students.filter(student =>
  student.Student_Name.toLowerCase().includes(term) ||
  student.Student_ID.toString().toLowerCase().includes(term) ||
  student.Department.toLowerCase().includes(term)
);


      tbody.innerHTML = "";

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="text-center">No results found</td></tr>`;
        return;
      }

      filtered.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.Student_ID}</td>
          <td>${student.Student_Name}</td>
          <td>${student.Department}</td>
          <td>${student.Year}</td>
          <td>${student.Book_Title}</td>
          <td>${student.Category}</td>
          <td>${student.Borrow_Date}</td>
          <td>${student.Return_Date}</td>
          <td>${student.Days_Borrowed}</td>
          <td>₹${student.Fine_Amount}</td>
          <td>⭐${student.Rating}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error searching data:", err));
}
