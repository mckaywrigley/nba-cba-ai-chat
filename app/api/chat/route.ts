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

  let finalMessages: any = [];

  if (messages.length === 1) {
    const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!, { auth: { persistSession: false } });

    const vectorstore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), { client, tableName: "nba", queryName: "match_documents_nba" });

    const retriever = vectorstore.asRetriever(4);

    const pages = await retriever.getRelevantDocuments(messages[messages.length - 1].content);

    const systemMessage = {
      role: "system",
      content: endent`You are an expert lawyer and an NBA general manager.

    You are studying the new 2023 NBA Collective Bargaining Agreement.

    You are able to answer any question about the CBA in a way that is both accurate and easy to understand.

    You cite the relevant sections of the CBA in your answer.

    You will be given a question about the CBA and you will answer it based on the following pages of the CBA:

    ${pages.map((page) => page.pageContent).join("\n\n")}`
    };

    finalMessages = [systemMessage, ...messages];
  } else {
    finalMessages = messages;
  }

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.2,
    stream: true,
    messages: finalMessages
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
