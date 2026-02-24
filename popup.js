(function () {
  const container = document.getElementById('container');
  const scoreEl = document.getElementById('score');
  const vibeMessageEl = document.getElementById('vibeMessage');
  const againBtn = document.getElementById('again');

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

  function showScore() {
    const score = randomVibes();
    scoreEl.textContent = score;
    vibeMessageEl.textContent = getVibeMessage(score);
    var hue = hueForScore(score);
    container.style.setProperty('--vibe-hue', hue);
  }

  againBtn.addEventListener('click', showScore);
  showScore();
})();
