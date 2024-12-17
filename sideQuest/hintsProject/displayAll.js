import { findProblem } from './utils/findProblem.js';

document.getElementById('search-btn').addEventListener('click', async () => {
    let problemName = document.getElementById('problem-name').value.trim();
    problemName = String(problemName);

    if (!problemName) {
        alert('Please enter a problem name.');
        return;
    }

    // Clear previous results
    document.getElementById('problem-title').querySelector('span').textContent = '';
    document.getElementById('question').textContent = '';
    document.getElementById('inputs-list').innerHTML = '';
    document.getElementById('solution-body').textContent = '';

    const result = await findProblem(problemName);

    if (result) {
        // Display fetched data
        document.getElementById('problem-title').querySelector('span').textContent = result.problem;
        document.getElementById('question').textContent = result.question;

        // Display inputs
        result.testCases.forEach((input, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Test case ${index + 1}: ${input}`;
            document.getElementById('inputs-list').appendChild(listItem);
        });

        // Display solution
        document.getElementById('solution-body').textContent = `function(${result.solutionParameters}) {\n${result.solutionStatemt}\n}`;
    } else {
        alert('Problem not found. Please check the name and try again.');
        alert(`${problemName}`)
    }
});
