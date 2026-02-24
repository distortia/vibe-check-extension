# Vibe Check

A Chrome extension that picks a random number between 0–100 for how good the vibes are. Laid-back and casual.

## Install

1. Open Chrome and go to `chrome://extensions/`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder (`vibe_check`).
4. The extension icon appears in your toolbar; click it to run a vibe check.

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

## How it works

- Opening the popup shows a random vibe score (0–100).
- Click **check again** to get a new number.

No data is collected or sent anywhere.
