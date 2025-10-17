window.addEventListener("DOMContentLoaded", () => {
  fetchbookData()  // default search term

 const booknameele = document.getElementById("ubookname");
  const searchForm = document.getElementById("searchForm");




  searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page reload
    fetchbooksearch(booknameele.value);
  });
});


function fetchbookData() {
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const books = data.Sheet1;
      const tbody = document.querySelector("#studentTable tbody");
      tbody.innerHTML = "";

      books.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
        
          
        
          <td>${student.Book_Title}</td>
          <td>${student.Category}</td>
         
          <td>⭐${student.Rating}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error loading data:", err));
}

function fetchbooksearch(searchTerm) {
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
  student.Book_Title.toLowerCase().includes(term) ||
 
  student.Category.toLowerCase().includes(term)
);


      tbody.innerHTML = "";

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="text-center">No results found</td></tr>`;
        return;
      }

      filtered.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
        
          <td>${student.Book_Title}</td>
          <td>${student.Category}</td>
            <td>⭐${student.Rating}</td>
        
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error searching data:", err));
}
