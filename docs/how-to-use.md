# How to Use with Solr or Elasticsearch

Since you are sending these vectors to **Solr** or **Elasticsearch**, your browser-side generation serves as a "Zero-Server" feature extraction layer. This significantly reduces your backend's CPU load because the user's hardware handles the heavy vectorization.

Here is what you need to consider for the integration:

### 1. **Vector Dimension Alignment**

Ensure your backend schema matches the model dimensions. If the dimensions don't match, the database will reject the document/query.

| Model Size | Dimensions | Solr/Elasticsearch Field Type |
| --- | --- | --- |
| **Small** | 384 | `knn_vector` (ES) / `DenseVectorField` (Solr) |
| **Base** | 768 | `knn_vector` (ES) / `DenseVectorField` (Solr) |
| **Large** | 1024 | `knn_vector` (ES) / `DenseVectorField` (Solr) |

### 2. **Similarity Metric**

For the **E5** and **BGE** families, you should configure your backend to use **Cosine Similarity** or **Inner Product**, as these models are normalized.

* **Elasticsearch:** Set `similarity: "cosine"` or `"dot_product"`.
* **Solr:** Use `similarityFunction="cosine"`.

### 3. **The Indexing vs. Querying Prefix**

This is the most common mistake with E5 models. You must use different prefixes depending on the action:

* **Querying (Browser):** When the user types a search term, the browser generates an embedding with the prefix **`query: `**.
* **Indexing (Backend/Ingestion):** When you are saving documents to Solr/Elasticsearch, the embeddings should ideally be generated with the prefix **`passage: `**.

> **Note:** If you use the browser to generate embeddings for *uploading* documents, make sure to change the prefix in your `worker.js` logic to `passage: ` for those specific tasks.

### 4. **Handling the Payload**

The output from the code we built is a standard JavaScript `Array`. You can send this directly in a JSON POST request:

```javascript
const embedding = await generateEmbedding(text);

// Example for Elasticsearch /_search
const response = await fetch('YOUR_BACKEND_URL', {
    method: 'POST',
    body: JSON.stringify({
        query: {
            knn: {
                field: "content_vector",
                query_vector: embedding,
                k: 10,
                num_candidates: 100
            }
        }
    })
});

```

### 5. **Hybrid Search (RRF)**

Since you have a strong background in **RRF (Reciprocal Rank Fusion)**, you can now easily implement hybrid search. You send the raw text for a standard **BM25** (keyword) search and the generated vector for a **kNN** (semantic) search in a single request, then let the backend fuse the results.
