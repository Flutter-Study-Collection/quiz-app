const questionContainer = document.getElementById('question-container');
const answerContainer = document.getElementById('answer-container');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');

const questions = [
    {
        question: 'What is the capital of France?',
        answers: ['Paris', 'Berlin', 'London', 'Madrid'],
        correctAnswer: 'Paris'
    },
    {
        question: 'What is the largest mammal?',
        answers: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
        correctAnswer: 'Blue Whale'
    }
];

let currentQuestionIndex = 0;
let userAnswer = '';

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.textContent = currentQuestion.question;

    answerContainer.innerHTML = '';
    currentQuestion.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.textContent = answer;
        btn.onclick = () => userAnswer = answer;
        answerContainer.appendChild(btn);
    });
}

function checkAnswer() {
    if (userAnswer === questions[currentQuestionIndex].correctAnswer) {
        alert('Correct!');
    } else {
        alert('Incorrect. The correct answer is ' + questions[currentQuestionIndex].correctAnswer);
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        alert('Quiz completed!');
        currentQuestionIndex = 0;
        displayQuestion();
    }
}

submitBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextQuestion);

displayQuestion();
