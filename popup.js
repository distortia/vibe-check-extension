(function () {
  const container = document.getElementById('container');
  const scoreEl = document.getElementById('score');
  const vibeMessageEl = document.getElementById('vibeMessage');
  const againBtn = document.getElementById('again');
  const decrementBtn = document.getElementById('decrement');
  const incrementBtn = document.getElementById('increment');

  const vibeMessages = [
    { min: 0, max: 19, text: 'rough out here' },
    { min: 20, max: 39, text: 'kinda mid' },
    { min: 40, max: 59, text: "it's alright" },
    { min: 60, max: 79, text: 'pretty good' },
    { min: 80, max: 100, text: 'immaculate' }
  ];

  function randomVibes() {
    return Math.floor(Math.random() * 101);
  }

  function getVibeMessage(score) {
    const row = vibeMessages.find(function (r) {
      return score >= r.min && score <= r.max;
    });
    return row ? row.text : "it's alright";
  }

  function hueForScore(score) {
    return Math.round((score / 100) * 120);
  }

  function getCurrentScore() {
    var text = scoreEl.textContent;
    var n = parseInt(text, 10);
    return isNaN(n) ? 50 : n;
  }

  function updateDisplay(score) {
    score = Math.max(0, Math.min(100, score));
    scoreEl.textContent = score;
    vibeMessageEl.textContent = getVibeMessage(score);
    container.style.setProperty('--vibe-hue', hueForScore(score));
  }

  function randomScore() {
    updateDisplay(randomVibes());
  }

  function decrement() {
    updateDisplay(getCurrentScore() - 5);
  }

  function increment() {
    updateDisplay(getCurrentScore() + 5);
  }

  againBtn.addEventListener('click', randomScore);
  decrementBtn.addEventListener('click', decrement);
  incrementBtn.addEventListener('click', increment);
  updateDisplay(randomVibes());
})();
