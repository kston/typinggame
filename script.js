const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');

let score = 0;
let time = 10;

getRandomWord();

let difficulty =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'medium';
difficultySelect.value =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'medium';

text.focus();

const timeInterval = setInterval(updateTime, 1000);

async function getRandomWord() {
  const res = await fetch(
    'https://cors-anywhere.herokuapp.com/https://www.randomlists.com/data/words.json'
  );

  const data = await res.json();
  const selectedWord = data.data[Math.floor(Math.random() * data.data.length)];

  word.innerHTML = selectedWord;

  text.addEventListener('input', (e) => {
    const insertedText = e.target.value;

    if (insertedText === selectedWord) {
      updateScore();
      getRandomWord();

      e.target.value = '';

      if (difficulty === 'hard') {
        time += 5;
      } else if (difficulty === 'medium') {
        time += 8;
      } else {
        time += 10;
      }

      updateTime();
    }
  });
}

function updateScore() {
  score++;
  scoreEl.innerHTML = score;
}

function updateTime() {
  time--;
  timeEl.innerHTML = time + 's';

  if (time === 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

function gameOver() {
  endgameEl.innerHTML = `
    <h1>Your time is over!</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Reload</button>
  `;

  endgameEl.style.display = 'flex';
}

settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'));
settingsForm.addEventListener('change', (e) => {
  difficulty = e.target.value;
  localStorage.setItem('difficulty', difficulty);
});
