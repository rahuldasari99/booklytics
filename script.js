window.addEventListener("DOMContentLoaded", () => {
  const studentnameele = document.getElementById("ustudentname");
  const searchForm = document.getElementById("searchForm");
  const studentCount = document.getElementById("studentCount");
  const fineCount = document.getElementById("totalFine");

  // Filter dropdowns
  const departmentFilter = document.getElementById("departmentFilter");
  const yearFilter = document.getElementById("yearFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const ratingFilter = document.getElementById("ratingFilter");

  const resetBtn = document.getElementById("resetFilters");

resetBtn?.addEventListener("click", () => {
  // Reset all filters
  if(departmentFilter) departmentFilter.value = "all";
  if(yearFilter) yearFilter.value = "all";
  if(categoryFilter) categoryFilter.value = "all";
  if(ratingFilter) ratingFilter.value = "all";

  // Clear search input
  if(studentnameele) studentnameele.value = "";

  // Render full table
  renderTable(allStudents);
});


  let allStudents = []; // store all students globally

  // Load all students initially
  fetchStudentData();

  // Search form submit handler
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchstudentsearch(studentnameele.value);
    
  });

  // Filter change handlers
  departmentFilter?.addEventListener("change", applyFilters);
  yearFilter?.addEventListener("change", applyFilters);
  categoryFilter?.addEventListener("change", applyFilters);
  ratingFilter?.addEventListener("change", applyFilters);

  function fetchStudentData() {
    fetch("data.json")
      .then(res => res.json())
      .then(data => {
        allStudents = data.Sheet1;

        // Populate filters dynamically
        populateFilters(allStudents);

        // Render table initially
        renderTable(allStudents);
      })
      .catch(err => console.error("Error loading data:", err));
  }

  function fetchstudentsearch(searchTerm) {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      alert("Please enter student name or ID");
      return;
    }

    const filtered = allStudents.filter(student =>
      student.Student_Name.toLowerCase().includes(term) ||
      student.Student_ID.toString().toLowerCase().includes(term) ||
      student.Department.toLowerCase().includes(term)
    );

    renderTable(filtered);
  }

  function populateFilters(students) {
    if (!departmentFilter || !yearFilter || !categoryFilter || !ratingFilter) return;

    // Departments
    const departments = [...new Set(students.map(s => s.Department))].sort();
    departmentFilter.innerHTML = '<option value="all">All Departments</option>';
    departments.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      departmentFilter.appendChild(opt);
    });

    // Years
    const years = [...new Set(students.map(s => s.Year))].sort();
    yearFilter.innerHTML = '<option value="all">All Years</option>';
    years.forEach(y => {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      yearFilter.appendChild(opt);
    });

    // Book Categories
    const categories = [...new Set(students.map(s => s.Category))].sort();
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      categoryFilter.appendChild(opt);
    });

    // Ratings
    const ratings = [...new Set(students.map(s => s.Rating))].sort((a,b)=>b-a);
    ratingFilter.innerHTML = '<option value="all">All Ratings</option>';
    ratings.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = `⭐${r}`;
      ratingFilter.appendChild(opt);
    });
  }

  function applyFilters() {
    const dep = departmentFilter?.value || "all";
    const year = yearFilter?.value || "all";
    const cat = categoryFilter?.value || "all";
    const rate = ratingFilter?.value || "all";

    const filtered = allStudents.filter(s => {
      const matchDep = dep === "all" || s.Department === dep;
      const matchYear = year === "all" || s.Year === year;
      const matchCat = cat === "all" || s.Category === cat;
      const matchRate = rate === "all" || s.Rating == rate;
      return matchDep && matchYear && matchCat && matchRate;
    });

    renderTable(filtered);
  }

  function renderTable(students) {
    const tbody = document.querySelector("#studentTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="11" class="text-center">No results found</td></tr>`;
      studentCount.textContent = `Total Students: 0`;
      if(fineCount) fineCount.textContent = `Total Fine: ₹0`;
      return;
    }

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

    // Update counts
    studentCount.textContent = `Total Students: ${students.length}`;
    if(fineCount) {
      const totalFine = students.reduce((sum, s) => sum + (parseFloat(s.Fine_Amount)||0), 0);
      fineCount.textContent = `Total Fine: ₹${totalFine.toFixed(2)}`;
    }
  }
});
