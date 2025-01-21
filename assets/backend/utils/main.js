document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    
    // Get the user input (the name of the person)
    let searchQ;
    let name = document.getElementById('firstname').value;
    let geography = document.getElementById('location').value;
    let type = document.getElementById('occuptation').value;
    searchQ = name + geography + type;
    
  
    // Send a POST request to the backend at port 3000
    const response = await fetch('http://localhost:3000/run-analysis', {  // Update this URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({searchQ}), // Send the search query
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      
      document.getElementById('bio').innerHTML = data.bio;
      document.getElementById('personal').innerHTML = data.personal;
      document.getElementById('work').innerHTML = data.work;
      document.getElementById('facts').innerHTML = data.facts;
      document.getElementById('fears').innerHTML = data.fears;
      
    } else {
      document.getElementById('bio').innerHTML = 'Error: Unable to fetch analysis.';
      document.getElementById('personal').innerHTML = 'Error: Unable to fetch analysis.';
      document.getElementById('work').innerHTML = 'Error: Unable to fetch analysis.';
      document.getElementById('facts').innerHTML = 'Error: Unable to fetch analysis.';
      document.getElementById('fears').innerHTML = 'Error: Unable to fetch analysis.';
    }
  });
  