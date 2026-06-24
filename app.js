const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

const CBC_LEVELS = [
    { id: 'EE', label: 'Exceeding Expectations', color: '#2ecc71' },
    { id: 'ME', label: 'Meeting Expectations', color: '#3498db' },
    { id: 'AE', label: 'Approaching Expectations', color: '#f1c40f' },
    { id: 'BE', label: 'Below Expectations', color: '#e74c3c' }
];

function generateRubricRow(learningOutcome) {
    return CBC_LEVELS.map(level => {
        let descriptor = '';
        switch(level.id) {
            case 'EE': descriptor = `Learner consistently demonstrates an advanced understanding of ${learningOutcome} and can independently apply skills in new contexts.`; break;
            case 'ME': descriptor = `Learner demonstrates a clear understanding of ${learningOutcome} and performs tasks correctly with minimal supervision.`; break;
            case 'AE': descriptor = `Learner shows partial understanding of ${learningOutcome} and requires occasional guidance to complete tasks.`; break;
            case 'BE': descriptor = `Learner has difficulty understanding ${learningOutcome} and requires constant support to achieve basic results.`; break;
        }
        return { ...level, descriptor };
    });
}

const getHtml = (content = '', data = {}) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CBC Rubric Generator 2025</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 20px auto; padding: 20px; background: #f4f7f6; }
        .card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        form { margin-bottom: 30px; }
        input, select, button { padding: 12px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; width: 100%; box-sizing: border-box; }
        button { background: #3498db; color: white; cursor: pointer; border: none; font-weight: bold; }
        button:hover { background: #2980b9; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; vertical-align: top; }
        th { background: #ecf0f1; }
        .level-header { font-weight: bold; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="card">
        <h1>CBC Rubric Generator (Kenya 2025)</h1>
        <form method="POST" action="/generate">
            <label>Subject/Learning Area:</label>
            <input type="text" name="subject" placeholder="e.g. Environmental Activities" required value="${data.subject || ''}">
            <label>Learning Outcome/Strand:</label>
            <input type="text" name="outcome" placeholder="e.g. demonstrate waste management skills" required value="${data.outcome || ''}">
            <button type="submit">Generate Assessment Rubric</button>
        </form>
        ${content}
    </div>
</body>
</html>`;

app.get('/', (req, res) => {
    res.send(getHtml('<p>Enter the details above to create a standard CBC assessment table.</p>'));
});

app.post('/generate', (req, res) => {
    const { subject, outcome } = req.body;
    const rubric = generateRubricRow(outcome);
    
    const tableHtml = `
        <h3>Result for: ${subject}</h3>
        <p><strong>Outcome:</strong> ${outcome}</p>
        <table>
            <thead>
                <tr>
                    ${rubric.map(r => `<th style="border-top: 4px solid ${r.color}">${r.label}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    ${rubric.map(r => `<td>${r.descriptor}</td>`).join('')}
                </tr>
            </tbody>
        </table>
        <button onclick="window.print()" style="margin-top:20px; background:#27ae60;">Print Rubric</button>
        <a href="/" style="display:block; margin-top:10px; text-align:center;">Create Another</a>
    `;
    res.send(getHtml(tableHtml, { subject, outcome }));
});

app.listen(port, () => console.log(`CBC Rubric Tool listening at http://localhost:${port}`));