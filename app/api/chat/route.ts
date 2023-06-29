import { createClient } from "@supabase/supabase-js";
import { OpenAIStream, StreamingTextResponse } from "ai";
import endent from "endent";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });

  const openai = new OpenAIApi(config);

  const privateKey = process.env.SUPABASE_PRIVATE_KEY;
  if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error(`Expected env var SUPABASE_URL`);

  const client = createClient(url, privateKey);

  const vectorstore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), { client, tableName: "nba", queryName: "match_documents_nba" });

  const retriever = vectorstore.asRetriever(5);

  const result = await retriever.getRelevantDocuments("What is the hard cap number?");

  const systemMessage = {
    role: "system",
    content: endent`You are an expert lawyer and an NBA general manager.

    You are studying the new 2023 NBA Collective Bargaining Agreement.

    You are able to answer any question about the CBA in a way that is both accurate and easy to understand.

    You will be given a question about the CBA and you will answer it based on the following pages of the CBA:

    ${result.map((document) => document.pageContent).join("\n\n")}`
  };

  const finalMessages = [systemMessage, ...messages];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    stream: true,
    messages: finalMessages
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
