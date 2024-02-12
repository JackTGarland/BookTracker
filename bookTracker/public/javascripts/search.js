// search.js

async function search() {
    const searchTerm = document.querySelector('input[name="q"]').value;
    const response = await fetch(`/search?q=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    displayResults(data);
  }
  
  function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
  
    data.docs.forEach(book => {
      const title = book.title ? book.title : 'Unknown Title';
      const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
      resultsDiv.innerHTML += `<p><strong>Title:</strong> ${title}, <strong>Author:</strong> ${author}</p>`;
    });
  
    // Show the results container
    resultsDiv.style.display = 'block';
  }
  
  // Attach the search function to the form submit event
  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    search();
  });
  