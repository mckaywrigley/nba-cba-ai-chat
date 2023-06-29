import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

loadEnvConfig("");

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

(async () => {
  const client = createClient(url, privateKey);

  const loader = new PDFLoader("nba_cba_2023.pdf");

  const docs = await loader.load();

  const pages = docs.map((doc) => doc.pageContent);
  const metadata = docs.map((doc) => doc.metadata);

  await SupabaseVectorStore.fromTexts(pages, metadata, new OpenAIEmbeddings(), {
    client,
    tableName: "nba",
    queryName: "match_documents_nba"
  });
})();
