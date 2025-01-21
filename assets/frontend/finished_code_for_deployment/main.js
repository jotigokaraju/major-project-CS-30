document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log("clicked");
    // Get the user input (name, location, occupation, and range)
    let name = document.getElementById('name').value;
    let location = document.getElementById('location').value;
    let occupation = document.getElementById('text').value; // Occupation input
    let range = document.getElementById('range').value;
  
    // Combine the name, location, and occupation to create the search query
    let searchQuery = `${name} ${location} ${occupation}`;
    console.log(JSON.stringify({searchQuery: searchQuery, range: range}));
    // Show the progress bar
    document.getElementById('progress').style.display = 'block';
  
    // Send a POST request to the backend with the searchQuery and range
    const response = await fetch('http://localhost:3000/run-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({searchQuery: searchQuery, range: range}),
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      
      // Update the results sections with the returned data
      document.getElementById('bio').innerHTML = data.bio;
      document.getElementById('personal').innerHTML = data.personal;
      document.getElementById('work').innerHTML = data.work;
      document.getElementById('facts').innerHTML = data.facts;
      document.getElementById('interests').innerHTML = data.interests;
      
    } else {
      // Handle errors in response
      document.getElementById('bio').innerHTML = 'Error: Unable to fetch analysis.';
      document.getElementById('personal').innerHTML = 'Error: Unable to fetch analysis.';
      document.getElementById('work').innerHTML = 'Error: Unable to fetch analysis.';
      document.getElementById('facts').innerHTML = 'Error: Unable to fetch analysis.';
      document.getElementById('interests').innerHTML = 'Error: Unable to fetch analysis.';
    }
    
    // Hide the progress bar after receiving the response
    document.getElementById('progress').style.display = 'none';
  });
