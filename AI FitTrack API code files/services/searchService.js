const Document = require("../models/Document");

async function keywordSearch(userId, query) {
  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return Document.find({
    uploadedBy: userId,
    $or: [{ title: regex }, { content: regex }]
  }).select("_id title content createdAt").limit(10);
}

/*
  Atlas Vector Search:
  1. Create an Atlas Search/Vector Search index on the Document collection.
  2. Store Gemini embeddings in the `embedding` field.
  3. Replace this helper with an Atlas $vectorSearch aggregation using your
     configured index name when your Atlas cluster is ready.
*/
async function vectorSearch(userId, queryVector, indexName = "document_vector_index") {
  if (!Array.isArray(queryVector) || !queryVector.length) return [];

  return Document.aggregate([
    {
      $vectorSearch: {
        index: indexName,
        path: "embedding",
        queryVector,
        numCandidates: 100,
        limit: 10
      }
    },
    { $match: { uploadedBy: userId } },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ]);
}

module.exports = { keywordSearch, vectorSearch };
