# Vibe Check

A Chrome extension that picks a random number between 0–100 for how good the vibes are. Laid-back and casual. Optionally nudge the score with a stock’s daily performance.

## Install

1. Open Chrome and go to `chrome://extensions/`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder (`vibe_check`).
4. The extension icon appears in your toolbar; click it to run a vibe check.

## How it works

- Opening the popup shows a random vibe score (0–100) with a message and color (red → green).
- Use **−** and **+** to adjust the score by 5.
- Click **check again** to roll a new number.

### Optional: Stock vibes

You can tie the vibe score to a stock’s performance:

1. Get a free API key at [finnhub.io](https://finnhub.io) (sign up, copy from dashboard).
2. In the popup, paste your key into **“Paste Finnhub API key”** and click **save**. The key is stored only in your browser (Chrome sync storage), not in the codebase.
3. Enter a ticker (e.g. `AAPL`, `TSLA`) and click **add stock**.
4. When you click **check again**, the extension fetches that stock’s daily % change and nudges the vibe score (up when the stock is green, down when it’s red).

If you add a ticker but no API key, the popup will prompt you to get one at finnhub.io. The extension never uses a key unless you paste and save it yourself.

## Optional: add an icon

To give the extension a custom icon, add a folder named `icons` with:

- `icon16.png` (16×16)
- `icon32.png` (32×32)
- `icon48.png` (48×48)

Then add this to `manifest.json` inside `"action"`:

```json
"default_icon": {
  "16": "icons/icon16.png",
  "32": "icons/icon32.png",
  "48": "icons/icon48.png"
}
```

And add an `"icons"` key at the top level with the same paths.
