import { loadEnvConfig } from "@next/env";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";

loadEnvConfig("");

const url = process.env.QDRANT_URL;
if (!url) throw new Error(`Expected env var QDRANT_URL`);

(async () => {
  const loader = new PDFLoader("nba_cba_2023.pdf");

  const docs = await loader.load();

  const pages = docs.map((doc) => doc.pageContent);
  const metadata = docs.map((doc) => doc.metadata);

  await QdrantVectorStore.fromTexts(pages, metadata,  new OpenAIEmbeddings({ openAIApiKey: "random-string"}, {basePath: process.env.EMBEDDINGS_MODEL_BASE_URL ?? "http://184.105.3.16:8444/v1"}), {
    url: process.env.QDRANT_URL,
    collectionName: "nba3",
    collectionConfig: { vectors: {size: 384, distance: "Cosine"}}
  });

})();
