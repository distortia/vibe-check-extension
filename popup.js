(function () {
  const container = document.getElementById('container');
  const scoreEl = document.getElementById('score');
  const vibeMessageEl = document.getElementById('vibeMessage');
  const againBtn = document.getElementById('again');
  const decrementBtn = document.getElementById('decrement');
  const incrementBtn = document.getElementById('increment');
  const tickerInput = document.getElementById('tickerInput');
  const tickerSave = document.getElementById('tickerSave');
  const apikeyInput = document.getElementById('apikeyInput');
  const apikeySave = document.getElementById('apikeySave');
  const tickerStatus = document.getElementById('tickerStatus');

  const vibeMessages = [
    { min: 0, max: 19, text: 'rough out here' },
    { min: 20, max: 39, text: 'kinda mid' },
    { min: 40, max: 59, text: "it's alright" },
    { min: 60, max: 79, text: 'pretty good' },
    { min: 80, max: 100, text: 'immaculate' }
  ];

  const STORAGE_KEY = 'vibeCheckTicker';
  const APIKEY_STORAGE_KEY = 'vibeCheckFinnhubKey';
  const MAX_STOCK_NUDGE = 25;

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

  function loadTicker(cb) {
    chrome.storage.sync.get([STORAGE_KEY, APIKEY_STORAGE_KEY], function (data) {
      var ticker = (data && data[STORAGE_KEY]) || '';
      var apikey = (data && data[APIKEY_STORAGE_KEY]) || '';
      if (tickerInput) tickerInput.value = ticker;
      if (apikeyInput) apikeyInput.value = apikey;
      if (typeof cb === 'function') cb(ticker, apikey);
    });
  }

  function saveTicker(ticker) {
    ticker = (ticker || '').trim().toUpperCase();
    chrome.storage.sync.set({ [STORAGE_KEY]: ticker }, function () {
      tickerInput.value = ticker;
      setTickerStatus(ticker ? 'tracking ' + ticker : '');
    });
  }

  function setTickerStatus(msg) {
    tickerStatus.textContent = msg;
  }

  function fetchFinnhubQuote(symbol, apiKey, done) {
    if (!apiKey || !apiKey.trim()) {
      done(null, 'no API key');
      return;
    }
    var url = 'https://finnhub.io/api/v1/quote?symbol=' + encodeURIComponent(symbol) + '&token=' + encodeURIComponent(apiKey.trim());
    fetch(url)
      .then(function (res) {
        if (!res.ok) {
          return Promise.reject(new Error('HTTP ' + res.status));
        }
        return res.json();
      })
      .then(function (data) {
        if (!data || data.dp == null) {
          done(null, 'invalid or no data');
          return;
        }
        done({
          symbol: symbol.toUpperCase(),
          changePercent: data.dp,
          price: data.c
        }, null);
      })
      .catch(function (err) {
        done(null, err && err.message ? err.message : 'fetch failed');
      });
  }

  function stockNudgeFromChangePercent(percent) {
    if (percent == null || isNaN(percent)) return 0;
    var nudge = Math.round(percent * 2);
    return Math.max(-MAX_STOCK_NUDGE, Math.min(MAX_STOCK_NUDGE, nudge));
  }

  function randomScore() {
    var base = randomVibes();
    loadTicker(function (ticker, apikey) {
      if (!ticker) {
        updateDisplay(base);
        return;
      }
      if (!apikey || !apikey.trim()) {
        setTickerStatus('get a free API key at finnhub.io');
        updateDisplay(base);
        return;
      }
      setTickerStatus('checking ' + ticker + '…');
      fetchFinnhubQuote(ticker, apikey, function (quote, err) {
        if (err || !quote) {
          if (err) {
            setTickerStatus('stock: ' + err);
            console.error('Vibe Check stock fetch failed:', err);
          } else {
            setTickerStatus('');
          }
          updateDisplay(base);
          return;
        }
        var nudge = stockNudgeFromChangePercent(quote.changePercent);
        var finalScore = base + nudge;
        setTickerStatus(quote.symbol + ' ' + (quote.changePercent >= 0 ? '+' : '') + quote.changePercent.toFixed(2) + '% today');
        updateDisplay(finalScore);
      });
    });
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
  tickerSave.addEventListener('click', function () {
    saveTicker(tickerInput.value);
  });

  apikeySave.addEventListener('click', function () {
    var key = (apikeyInput && apikeyInput.value) ? apikeyInput.value.trim() : '';
    chrome.storage.sync.set({ [APIKEY_STORAGE_KEY]: key }, function () {
      setTickerStatus(key ? 'API key saved' : 'API key cleared');
    });
  });

  loadTicker(function (ticker) {
    if (ticker) setTickerStatus('tracking ' + ticker);
  });
  randomScore();
})();
