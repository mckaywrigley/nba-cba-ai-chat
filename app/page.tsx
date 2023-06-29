"use client";

import { useChat } from "ai/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      <div className="">
        <div className="text-3xl font-bold text-center">NBA Chat AI</div>
        <div>Use AI to ask questions about the new 676-page NBA CBA.</div>
        <div className="mb-4">Powered by OpenAI</div>
        <a
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-[40px]"
          href="https://donate.stripe.com/5kAeWqezzdn6gtWaEF"
        >
          DONATE
        </a>
      </div>

      {messages.map((m) => (
        <div
          key={m.id}
          className="flex border-b-2 py-2"
        >
          <div className="font-bold w-[120px]">{m.role}:</div>
          <div className="ml-2 whitespace-pre-wrap w-full">{m.content}</div>
        </div>
      ))}

      <form
        className="flex fixed bottom-0"
        onSubmit={handleSubmit}
      >
        <input
          className="w-[500px] border border-gray-300 rounded mb-8 shadow-xl p-2"
          placeholder="Ask a question..."
          type="text"
          value={input}
          onChange={handleInputChange}
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-[40px] ml-2"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
