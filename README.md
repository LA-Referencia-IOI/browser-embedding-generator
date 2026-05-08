# Browser Embedding Demo

A simple browser-based demo for generating semantic embeddings with `@xenova/transformers`.

## Features

- Runs fully in the browser
- Generates embeddings from text input
- Lets you choose between these multilingual E5 models:
  - `multilingual-e5-small`
  - `multilingual-e5-base`
  - `multilingual-e5-large`
- Shows model loading status and load duration
- Disables embedding generation until the selected model is ready
- Uses browser caching to avoid re-downloading model files

## How it works

The app uses the Transformers.js `pipeline()` API with the `feature-extraction` task.

For each input, it generates an embedding using:

- `pooling: 'mean'`
- `normalize: true`

The input text is prefixed with `query:`, which matches the expected format for E5 models.

## Running the app

Since this project is a static HTML page, you can open it directly in the browser or serve it with a simple local server.

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Serve locally

If you prefer running a local server, from the `browser-embedding` directory you can use any static file server, for example:

```/dev/null/bash.sh#L1-1
python3 -m http.server 8000
```

Then open:

```/dev/null/text.txt#L1-1
http://localhost:8000
```

## Usage

1. Open the app.
2. Select the model you want to use.
3. Wait until the status says the model loaded successfully.
4. Enter some text.
5. Click `Generate Embedding`.
6. View the resulting embedding vector in the textarea.

## Notes

- Larger models generally provide better quality embeddings but take longer to load.
- The first load may take longer because model files need to be downloaded.
- After that, browser caching should reduce repeated download time for previously used models.
- Embedding generation only becomes available after the currently selected model has finished loading.

## Current file structure

- `index.html` — the complete app UI, styling, and logic

## Future improvements

Possible next enhancements:

- persist selected model with `localStorage`
- cache initialized pipelines in memory for faster model switching
- add similarity comparison between multiple texts
- add loading indicators in the button or status area
