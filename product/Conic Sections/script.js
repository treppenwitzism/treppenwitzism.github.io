// SheetJS
// https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js

const quizContainer = document.getElementById('quiz-container');
let currentQuestionIndex = 0;
let questions = [];
let userAnswers = [];

function showLoadingSpinner() {
    quizContainer.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading quiz...</p>
        </div>
    `;
}

// autoload
async function loadExcelFile() {
    showLoadingSpinner();
    
    try {
        // Excel path
        const response = await fetch('Conic Sections.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        questions = XLSX.utils.sheet_to_json(worksheet);
        startQuiz();
    } catch (error) {
        quizContainer.innerHTML = `
            <div class="error-message">
                Error loading quiz: ${error.message}
                Please try again later or contact support.
            </div>
        `;
        console.error('Error loading quiz:', error);
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    displayCurrentQuestion();
}

function displayCurrentQuestion() {
    const question = questions[currentQuestionIndex];
    const progress = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    const score = userAnswers.filter(answer => answer.correct).length;
    const scorepercent = score/questions.length*100;
    
    const questionHTML = `
        <div class="question-card">
            <div class="progress-bar">${progress}</div>
            <div class="score">Score: ${score}|${scorepercent}%</div> 
            <h3>Question ${currentQuestionIndex + 1}</h3>
            <p class="question-text">${question.question}</p>
            <div class="options">
                <label class="option-label" for="q_a">
                    <div class="option">
                        <input type="radio" id="q_a" name="question" value="a">
                        <span class="option-text">${question.option_a}</span>
                    </div>
                </label>
                <label class="option-label" for="q_b">
                    <div class="option">
                        <input type="radio" id="q_b" name="question" value="b">
                        <span class="option-text">${question.option_b}</span>
                    </div>
                </label>
                <label class="option-label" for="q_c">
                    <div class="option">
                        <input type="radio" id="q_c" name="question" value="c">
                        <span class="option-text">${question.option_c}</span>
                    </div>
                </label>
                <label class="option-label" for="q_d">
                    <div class="option">
                        <input type="radio" id="q_d" name="question" value="d">
                        <span class="option-text">${question.option_d}</span>
                    </div>
                </label>
            </div>
            <button onclick="submitAnswer()" class="submit-btn">Submit Answer</button>
            <div class="feedback" id="feedback"></div>
        </div>
    `;
    
    quizContainer.innerHTML = questionHTML;
}

function submitAnswer() {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    
    if (!selectedOption) {
        alert('Please select an answer!');
        return;
    }

    const userAnswer = selectedOption.value;
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    userAnswers.push({
        question: currentQuestionIndex + 1,
        userAnswer: userAnswer,
        correct: userAnswer === correctAnswer
    });

    const feedbackDiv = document.getElementById('feedback');
    const isCorrect = userAnswer === correctAnswer;
    
    feedbackDiv.innerHTML = isCorrect ? 
        '<div class="correct">Correct!</div>' : 
        `<div class="incorrect">Incorrect. The correct answer was ${correctAnswer}.</div>`;
    
    document.querySelector('.submit-btn').disabled = true;
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.disabled = true);
    
    if (currentQuestionIndex < questions.length - 1) {
        feedbackDiv.innerHTML += `
            <button onclick="nextQuestion()" class="next-btn">Next Question</button>
        `;
    } else {
        showFinalResults();
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    displayCurrentQuestion();
}

function showFinalResults() {
    const correctAnswers = userAnswers.filter(answer => answer.correct).length;
    const percentage = (correctAnswers / questions.length * 100).toFixed(2);
    const pass = "passed";
    const fail = "failed";


    if (correctAnswers < questions.length * .75) {
        passfail = fail;
    } else {
        passfail = pass;
    }

    quizContainer.innerHTML = `
        <div class="results-card">
            <h2>Quiz Complete!</h2>
            <p>You scored ${correctAnswers} out of ${questions.length} (${percentage}%). You ${passfail}!</p>
            <button onclick="startQuiz()" class="restart-btn">Restart Quiz</button>
        </div>
    `;
}

// styling
const style = document.createElement('style');
style.textContent = `
     .option-label {
        display: block;
        cursor: pointer;
        margin-bottom: 10px;
        width: 100%;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        border: 2px solid #eee;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .option-label:hover .option {
        background-color: #f0f7ff;
        border-color: #007bff;
        color: black;
    }

    .option input[type="radio"] {
        margin: 0;
    }

    .option-text {
        flex: 1;
    }

    input[type="radio"]:checked + .option-text {
        font-weight: 500;
    }

    .option-label input[type="radio"]:checked ~ .option {
        background-color: #e3f2fd;
        border-color: #007bff;
    }
    
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        padding: 20px;
    }

    .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading-container p {
        color: #666;
        font-size: 1.1em;
        margin: 0;
    }

    .question-card {
        background-color: white;
        margin: 20px;
        padding: 20px;
        border: 10px solid #ddd;
        border-radius: 8px;
        max-width: 600px;
        margin: 20px auto;
    }
    .question-text {
        font-size: 1.1em;
        margin-bottom: 15px;
    }
    .score{
    text-align: right;
    }
    .options {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
    }
    .option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        border: 1px solid #eee;
        border-radius: 4px;
    }
    .option:hover {
        background-color: #f5f5f5;
    }
    .feedback {
        margin-top: 20px;
    }
    .correct {
        color: green;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .incorrect {
        color: red;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .submit-btn, .next-btn, .restart-btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1em;
    }
    .submit-btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    .next-btn {
        background-color: #28a745;
        margin-top: 10px;
    }
    .progress-bar {
        text-align: center;
        margin-bottom: 15px;
        color: #666;
    }
    .results-card {
        text-align: center;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        max-width: 600px;
        margin: 20px auto;
        background-color: white;
    }
    .error-message {
        color: red;
        text-align: center;
        padding: 20px;
        border: 1px solid red;
        border-radius: 8px;
        max-width: 600px;
        margin: 20px auto;
    }
`;
document.head.appendChild(style);

// load when finished
window.addEventListener('load', loadExcelFile);