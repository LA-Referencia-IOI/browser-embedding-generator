import { env, pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

let extractor = null;

self.onmessage = async (e) => {
    const { action, modelName, text } = e.data;

    if (action === 'load') {
        try {
            // Using WebGPU like a RTX 5080
            extractor = await pipeline('feature-extraction', modelName, {
                device: 'webgpu',
            });
            self.postMessage({ status: 'ready', modelName, device: 'webgpu' });
        } catch (_err) {
            console.error("WebGPU fallback to CPU", _err);
            extractor = await pipeline('feature-extraction', modelName);
            self.postMessage({ status: 'ready', modelName, device: 'cpu' });
        }
    }

    if (action === 'generate') {
        if (!extractor) return;

        // E5 requirement: prefix the text with "query: " for better search accuracy
        const preparedText = text.startsWith('query:') ? text : `query: ${text}`;

        const output = await extractor(preparedText, { 
            pooling: 'mean', 
            normalize: true 
        });
        
        const embedding = Array.from(output.data);
        self.postMessage({ 
            status: 'complete', 
            embedding, 
            dimensions: embedding.length 
        });
    }
};