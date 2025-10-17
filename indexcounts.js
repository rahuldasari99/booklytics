window.addEventListener("DOMContentLoaded", () => {
  const studentCount = document.getElementById("studentCount");
  const totalFine = document.getElementById("totalFine");
  const bookCount = document.getElementById("bookCount");
  const popularGenre = document.getElementById("popularGenre"); // create this in HTML

  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const students = data.Sheet1;

      // Total Students
      if (studentCount) studentCount.textContent = `${students.length}`;

      // Total Fine
      if (totalFine) {
        const fine = students.reduce((sum, s) => sum + (parseFloat(s.Fine_Amount) || 0), 0);
        totalFine.textContent = ` ₹${fine.toFixed(2)}`;
      }

      // Total Books
      if (bookCount) {
        const uniqueBooks = [...new Set(students.map(s => s.Book_Title))];
        bookCount.textContent = `${uniqueBooks.length}`;
      }

      // Most Popular Genre (by highest average rating)
      if (popularGenre) {
        const genreRatings = {};

        students.forEach(s => {
          if (!genreRatings[s.Category]) genreRatings[s.Category] = [];
          genreRatings[s.Category].push(parseFloat(s.Rating) || 0);
        });

        let topGenre = "";
        let topRating = -1;

        for (const [genre, ratings] of Object.entries(genreRatings)) {
          const avgRating = ratings.reduce((a,b) => a+b, 0) / ratings.length;
          if (avgRating > topRating) {
            topRating = avgRating;
            topGenre = genre;
          }
        }

        popularGenre.innerText = ` ${topGenre}`
        
      }
    })
    .catch(err => console.error("Error loading data:", err));
});
