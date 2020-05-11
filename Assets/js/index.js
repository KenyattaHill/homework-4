const ERROR_REDUCTION = 5;
const timer = document.getElementById('timer');
const questionsContainer = document.querySelector('.questions-container');
const startElement = document.querySelector('.start');
const quizElement = document.querySelector('.container');
const endElement = document.querySelector('.end');
const questionContainer = document.getElementById('question');
const questionButtons = document.getElementById('question-buttons');
const resultContainer = document.querySelector('.result');

const questionCount = questions.length;
let TIMER_LENGTH = 30;
let TIMER;

let currentQuestion = 0;
let shuffledQuestions;
let score = 0;


endElement.querySelector('button').addEventListener('click', event => {
  event.preventDefault();
  const initials = endElement.querySelector('input').value;
  const percentage = `${Math.ceil((score / questionCount) * 100)}%`
  const highScore = {
    initials,
    percentage
  }
  let highScoreHistory = JSON.parse(localStorage.getItem('highScores'));

  if (highScoreHistory) {
    highScoreHistory.push(highScore);
  }
  else {
    highScoreHistory = [highScore];
  }
  console.log(highScoreHistory)
  localStorage.setItem('highScores', JSON.stringify(highScoreHistory));
  location.href = '/homework-4/highScores/';
})

startElement.querySelector('button').addEventListener('click', startGame);

quizElement.style.display = 'none';
endElement.style.display = 'none';

function startGame() {
  startTimer();
  startElement.style.display = 'none';
  quizElement.style.display = 'flex';
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestion = 0;
  renderNextQuestion();
}

function renderNextQuestion() {
  questionButtons.innerHTML = '';
  const question = shuffledQuestions[currentQuestion];
  questionContainer.textContent = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    button.classList.add('answer');
    questionButtons.appendChild(button);
  })
}

function selectAnswer(event) {
  const isCorrect = event.target.dataset.correct;

  if (isCorrect) {
    ++score;
    resultContainer.textContent = 'Correct!'
  } else {
    TIMER_LENGTH -= ERROR_REDUCTION;
    resultContainer.textContent = 'Wrong!'
  }
  setTimeout(() => {
    resultContainer.textContent = '';
  }, 300)

  if (currentQuestion === shuffledQuestions.length - 1) {
    stopTimer();
    endOfGame();
  } else {
    ++currentQuestion;
    renderNextQuestion();
  }
}

function endOfGame() {
  quizElement.style.display = 'none';
  endElement.style.display = 'flex';
  const percentage = Math.ceil((score / questionCount) * 100);
  endElement.querySelector('p').textContent = `Your score was ${percentage}%`;

}

function startTimer() {
  TIMER = setInterval(renderTimer, 1000);
}

function stopTimer() {
  timer.textContent = '';
  clearInterval(TIMER);
}

function renderTimer() {
  if (TIMER_LENGTH === 0) {
    stopTimer();
    endOfGame();
    return;
  }
  timer.textContent = `Time: ${TIMER_LENGTH}`;
  --TIMER_LENGTH;

}

