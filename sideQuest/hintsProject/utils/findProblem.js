//findProblem.js

async function findProblem(problemName, title) {
    const url = 'https://codingjs.wmcicompsci.ca/dist/bundle.js'; // The URL to the bundle.js file
    title = "Recursion-1"

    try {
        // Fetch the bundle.js content
        const response = await fetch(url);
        const data = await response.text();
        console.log(data);

        let problemRegex;

        // Regex to match the problem definition
        if (title === "Array-1") {
            problemRegex = new RegExp(`\\{*?\\s*title:.*?\\s*name:\\s*"${problemName}",\\s*inputs:*?\\s*(\\[.*?\\]),\\s*question:\\s*"([^"]*?)"`,'s');
        } else if (title === "Recursion-1") {
            problemRegex = new RegExp(`\\{question:"[^"]+",title:"[^"]+",name:"${problemName}",inputs:\\[[^\\]]*\\]\\}`, 's');
        }
        
        // Regex to match the solution definition
        let solutionRegex = new RegExp(`solutions\\.${problemName}\\s*=\\s*function\\((.*?)\\)\\s*{([\\s\\S]*?)}`,'s');

        // Extract the problem details
        let inputs, question;

        let problemMatch = problemRegex.exec(data)
        console.log(problemMatch);

        let questionRegex = new RegExp(`question:"[^"]+"`, 's');
        let questionStatement = questionRegex.exec(problemMatch[0]);
        console.log(questionStatement);
        
        console.log(JSON.parse("{"+String(questionStatement)+"}"))



        // Extract the solution
        const solutionMatch = data.match(solutionRegex);
        if (!solutionMatch) {
            console.error(`Solution for "${problemName}" not found.`);
            return;
        }

        const solutionParams = solutionMatch[1];
        const solutionBody = solutionMatch[2];

        // Display the extracted information
        console.log(`Problem: ${problemName}`);
        console.log('\n')
        console.log(`Question: ${question}`);
        console.log('\n')
        console.log(`Inputs:`);
        
        for (let value of inputs) {
            console.log(`${value} \n`);
        }
       
        console.log(`Solution: function(${solutionParams}) {\n${solutionBody}\n}`);

        let results = {
            problem: problemName,
            question: question,
            testCases: inputs,
            solutionParameters: solutionParams,
            solutionStatemt: solutionBody,
        }

        return results;
        
    } 
    catch (error) {
        console.error('Error fetching or processing the data:', error);
    }
}

export { findProblem };
