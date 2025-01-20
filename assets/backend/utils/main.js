document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    
    // Get the user input (the name of the person)
    const searchQ = document.getElementById('firstname').value;
  
    // Send a POST request to the backend at port 3000
    const response = await fetch('http://localhost:3000/run-analysis', {  // Update this URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchQ }), // Send the search query
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      
      console.log(data.key.join(", "));
      console.log("ok");
      document.getElementById('geminiAnalysisOutput').innerHTML = data.key.join(", ");
      
    } else {
      document.getElementById('geminiAnalysisOutput').innerHTML = 'Error: Unable to fetch analysis.';
    }
  });
  