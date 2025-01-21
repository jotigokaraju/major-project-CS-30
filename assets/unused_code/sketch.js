//2024-12-11

let analysisResult = '';  // Variable to store the result of the analysis

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // Display the analysis result on the canvas
  textSize(16);
  fill(0);
  textAlign(LEFT, TOP);
  text(analysisResult, 10, 10, width - 20, height - 20);
}

//Main logic
//I have to use async otherwise I can't use await
async function analyzeURL() {

  let url = document.getElementById('urlInput').value; 
  
  try {

    //Send to backend
    let response = await fetch('http://localhost:3000/api/pdf/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({url})
    });

    //Receive from backend
    let data = await response.json();
    analysisResult = data.analysis;
  } 
  
  catch(error) {
    console.log(error);
  }
}
