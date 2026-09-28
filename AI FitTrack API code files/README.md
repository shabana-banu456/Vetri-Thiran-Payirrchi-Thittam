# AI FitTrack API

AI-Augmented backend project based on the supplied project template.

## Stack

- Node.js
- Express.js
- MongoDB / MongoDB Atlas
- JWT Authentication
- bcrypt password hashing
- OpenAI API
- MongoDB Atlas Vector Search
- MVC architecture
- Postman

## 1. Install

```bash
npm install
```

## 2. Configure

Copy `.env.example` to `.env` and set:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/ai_fittrack
JWT_SECRET=your_long_secret
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is empty, normal authentication, fitness CRUD, document upload and keyword fallback still work. AI endpoints return a configuration message and semantic search falls back to keyword search.

## 3. Run

```bash
npm run dev
```

or

```bash
npm start
```

API:
`http://localhost:8000`

Health:
`GET /api/health`

## Main API endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### User
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/dashboard`

### Fitness
- `POST /api/fitness`
- `GET /api/fitness`
- `GET /api/fitness/:id`
- `PUT /api/fitness/:id`
- `DELETE /api/fitness/:id`

### AI
- `POST /api/ai/chat`
- `POST /api/ai/summarize`
- `POST /api/ai/semantic-search`
- `GET /api/ai/history`

### Documents
- `POST /api/documents/upload`
- `GET /api/documents`
- `GET /api/documents/:id`
- `DELETE /api/documents/:id`

For upload, use multipart/form-data:
- `file`: optional `.txt` file
- `title`: optional
- `content`: optional text

### Admin
- `GET /api/admin/analytics`
- Requires a JWT for a user whose `role` is `admin`.

## MongoDB Atlas Vector Search

Documents store an embedding array in `embedding`.

Create an Atlas Vector Search index named:

`document_vector_index`

Use the following conceptual mapping:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

The dimension must match the embedding model actually used. The project uses `text-embedding-3-small` by default, which produces 1536 dimensions unless you intentionally configure a different dimension.

For a production deployment, restrict document visibility and validate all uploaded content.

## Important security notes

- Never commit `.env`.
- Use a strong JWT secret.
- Keep AI API keys on the server only.
- Add rate limiting before production deployment.
- Validate uploaded file types and sizes.
- Do not treat AI output as medical diagnosis.
- Use HTTPS in production.

## Suggested Postman flow

1. Register
2. Login
3. Copy JWT token
4. Set `Authorization: Bearer <token>`
5. Create fitness data
6. Upload a text document
7. Ask `/api/ai/chat`
8. Try `/api/ai/semantic-search`
9. Check `/api/ai/history`

## Notes

The supplied template also asks for architecture and ER diagrams, screenshots, demo video link, source-code link, API explanations, and project execution evidence. Those are documentation/demo deliverables rather than backend source-code files.
