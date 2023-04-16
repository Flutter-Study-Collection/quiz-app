const { displayQuestion, startQuiz } = require('../script');

describe('displayQuestion function', () => {
  test('should display question', () => {
    const question = { question: 'What is the capital of France?', answers: ['Paris', 'London', 'Berlin'], correctAnswer: 'Paris' };
    const questionContainer = document.createElement('div');
    const answerContainer = document.createElement('div');
    displayQuestion(question, questionContainer, answerContainer);
    expect(questionContainer.textContent).toContain(question.question);
  });

  test('should display answer buttons', () => {
    const question = { question: 'What is the capital of France?', answers: ['Paris', 'London', 'Berlin'], correctAnswer: 'Paris' };
    const questionContainer = document.createElement('div');
    const answerContainer = document.createElement('div');
    displayQuestion(question, questionContainer, answerContainer);
    const answerBtns = answerContainer.querySelectorAll('button');
    expect(answerBtns.length).toBe(question.answers.length);
    expect(answerBtns[0].textContent).toBe(question.answers[0]);
  });
});