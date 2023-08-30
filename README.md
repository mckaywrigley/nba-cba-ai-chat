# NBA CBA Chat

Use AI to ask questions about the new 676-page NBA CBA.

Built with OpenAI, Next.js, Vercel AI SDK, Supabase, and LangChain.

## Use Redis as Vectorstore

### Run Redis vectorstore with Docker

```bash
docker run -d -p 6379:6379 -v redis-data:/data --name redis-vector-store redis/redis-stack-server:latest
```

### Index the documents in Redis

```bash
npm run embed-redis
```

## Use Qdrant as Vectorstore

### Run Qdrant vectorstore with Docker

```bash
docker run -d -p 6333:6333 -v qdrant-data:/qdrant/storage --name qdrant-vector-store qdrant/qdrant:v1.0.3
```

### Index the documents in Qdrant

```bash
npm run embed-qdrant
```

## Prem Support - 🚧 WiP