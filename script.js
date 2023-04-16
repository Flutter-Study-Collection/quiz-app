document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question-container');
    const answerContainer = document.getElementById('answer-container');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const previousBtn = document.getElementById('previous-btn');
    const retryBtn = document.getElementById('retry-btn');
    const shareBtn = document.getElementById('share-btn');
    const difficultyMenu = document.getElementById('difficulty-menu');
    const resultContainer = document.getElementById('result-container');
    const beginnerBtn = document.getElementById('beginner-btn');
    const intermediateBtn = document.getElementById('intermediate-btn');
    const hardBtn = document.getElementById('hard-btn');
    const randomBtn = document.getElementById('random-btn');
    const scoreContainer = document.getElementById('score');
    const totalQuestionsContainer = document.getElementById('total-questions');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressSteps = Array.from(document.querySelectorAll('.progress-step'));

    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswer = '';
    let score = 0;

    async function loadQuizData() {
        try {
            const response = await fetch('data/data.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading quiz data:', error);
        }
    }

    const quizDataPromise = loadQuizData();

    initializeEventListeners();

    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.textContent = currentQuestion.question;

        answerContainer.innerHTML = '';
        currentQuestion.answers.forEach((answer) => {
            const btn = document.createElement('button');
            btn.textContent = answer;
            btn.classList.add('answer-btn');
            btn.onclick = () => {
                userAnswer = answer;
                showSubmitButton();
            };
            answerContainer.appendChild(btn);
        });
    }

    function showPreviousButton() {
        previousBtn.style.display = 'inline-block';
    }

    function showSubmitButton() {
        submitBtn.style.display = 'inline-block';
    }

    function showNextButton() {
        nextBtn.style.display = 'inline-block';
    }

    function hideButtons() {
        previousBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'none';
    }

    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
            updateProgressBar();
            showSubmitButton();
            showNextButton();
            if (currentQuestionIndex === 0) {
                hideButtons();
            }
        }
    }

    function checkAnswer() {
        if (userAnswer === questions[currentQuestionIndex].correctAnswer) {
            alert('Correct!');
            score++;
            scoreContainer.textContent = score;
        } else {
            alert(
                `Incorrect. The correct answer is ${questions[currentQuestionIndex].correctAnswer}`
            );
        }

        if (currentQuestionIndex === questions.length - 2) {
            showSubmitButton();
            showNextButton();
        } else if (currentQuestionIndex === questions.length - 1) {
            hideButtons();
        } else {
            showSubmitButton();
            showNextButton();
        }
    }

    function nextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
            updateProgressBar();
            showPreviousButton();
            hideButtons();
        }
        if (currentQuestionIndex === questions.length - 1) {
            hideButtons();
            showPreviousButton();
            showSubmitButton();
        }
    }

    function updateProgressBar() {
        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;

        const progressStep = progressBar.clientWidth / (questions.length - 1);
        const stepIndex = currentQuestionIndex - 1;
        const stepOffset = progressStep * stepIndex;

        if (stepIndex >= 0) {
            progressSteps.forEach((step, index) => {
                if (index <= stepIndex) {
                    step.style.transform = `translateX(${stepOffset}px)`;
                } else {
                    step.style.transform = '';
                }
            });
        }
    }

    async function startQuiz(difficulty) {
        const quizQuestions = await quizDataPromise;

        questions = quizQuestions[difficulty];

        if (difficulty === 'random') {
            questions = Object.values(quizQuestions).flat();
            questions.sort(() => Math.random() - 0.5);
        }

        currentQuestionIndex = 0;
        score = 0;
        const scoreContainer = document.getElementById('score');
        const totalQuestionsContainer = document.getElementById('total-questions');
        if (totalQuestionsContainer) {
            totalQuestionsContainer.textContent = questions.length;
        } else {
            console.error('total-questions element not found');
        }
        scoreContainer.textContent = score;

        // Show the question and answer containers and hide the difficulty menu
        document.getElementById('difficulty-menu').style.display = 'none';
        questionContainer.style.display = 'block';
        answerContainer.style.display = 'block';

        // Reset progress bar
        progressBar.style.width = '0%';
        progressText.textContent = '';

        // Reset progress steps
        progressSteps.forEach(step => {
            step.style.transform = '';
        });

        // Reset answer buttons
        answerContainer.innerHTML = '';

        // Show the submit button and the next button
        submitBtn.style.display = 'inline-block';
        nextBtn.style.display = 'inline-block';

        // Hide the previous button
        previousBtn.style.display = 'none';

        // Display the first question
        displayQuestion();

        // Update the progress bar
        updateProgressBar();
    }


    function initializeEventListeners() {
        submitBtn.addEventListener('click', checkAnswer);
        nextBtn.addEventListener('click', nextQuestion);
        previousBtn.addEventListener('click', previousQuestion);
        beginnerBtn.addEventListener('click', () => startQuiz('beginner'));
        intermediateBtn.addEventListener('click', () => startQuiz('intermediate'));
        hardBtn.addEventListener('click', () => startQuiz('hard'));
        randomBtn.addEventListener('click', () => startQuiz('random'));

        // Add event listener to disable previous button if it's the first question
        previousBtn.addEventListener('click', () => {
            if (currentQuestionIndex === 0) {
                previousBtn.disabled = true;
            }
        });

        // Add event listener to hide submit button until last question
        nextBtn.addEventListener('click', () => {
            if (currentQuestionIndex === questions.length - 2) {
                submitBtn.style.display = 'inline-block';
                nextBtn.style.display = 'none';
            }
        });

        // Add event listener to hide next button on last question
        submitBtn.addEventListener('click', () => {
            nextBtn.style.display = 'none';
            showResult();
        });

        retryBtn.addEventListener('click', () => {
            document.getElementById('result-container').style.display = 'none';
            currentQuestionIndex = 0;
            document.getElementById('difficulty-menu').style.display = 'block';
            hideButtons();
            scoreContainer.textContent = '0';
            progressBar.style.width = '0%';
            progressText.textContent = '';
        });
    }
});