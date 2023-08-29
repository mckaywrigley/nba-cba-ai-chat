import { loadEnvConfig } from "@next/env";
import { createClient } from "redis";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RedisVectorStore } from "langchain/vectorstores/redis";

loadEnvConfig("");

const url = process.env.REDIS_URL;
if (!url) throw new Error(`Expected env var REDIS_URL`);

(async () => {
  const client = createClient({url: process.env.REDIS_URL || "redis://localhost:6379"});
  await client.connect();

  const loader = new PDFLoader("nba_cba_2023.pdf");

  const docs = await loader.load();

  await RedisVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    redisClient: client,
    indexName: "nba",
  });

  await client.disconnect();
})();
