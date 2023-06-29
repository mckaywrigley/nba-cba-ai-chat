import { supabaseClient } from "@/utils";
import { OpenAIStream, StreamingTextResponse } from "ai";
import endent from "endent";
import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });

  const openai = new OpenAIApi(config);

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input: messages[messages.length - 1].content
    })
  });

  const json = await res.json();
  const embedding = json.data[0].embedding;

  const { data, error } = await supabaseClient.rpc("match_documents_nba", {
    query_embedding: embedding,
    match_count: 4
  });

  if (error) throw new Error(error.message);

  console.log(data);

  //   const vectorstore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), { client, tableName: "nba", queryName: "match_documents_nba" });

  //   const retriever = vectorstore.asRetriever(5);

  //   const result = await retriever.getRelevantDocuments("What is the hard cap number?");

  const systemMessage = {
    role: "system",
    content: endent`You are an expert lawyer and an NBA general manager.

    You are studying the new 2023 NBA Collective Bargaining Agreement.

    You are able to answer any question about the CBA in a way that is both accurate and easy to understand.

    You will be given a question about the CBA and you will answer it based on the following pages of the CBA:

    ${data.map((page: any) => page.content).join("\n\n")}`
  };

  console.log(systemMessage);

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
