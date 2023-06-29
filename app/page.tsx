"use client";

import { useChat } from "ai/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="mx-auto w-full max-w-[600px] py-2 sm:py-10 flex flex-col stretch text-neutral-50 px-2">
      <div className="text-center">
        <div className="text-[60px]">🏀</div>
        <div className="text-4xl font-bold">NBA CBA Chat</div>
        <div className="mt-3 text-xl">Use AI to ask questions about the new 676-page NBA CBA.</div>
        <div className="mt-2">Please donate to help us keep the tool online for everyone :)</div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded h-[40px] mt-4"
          onClick={() => window.open("https://donate.stripe.com/5kAeWqezzdn6gtWaEF")}
        >
          DUNK ON LEBRON
        </button>
      </div>

      {messages.length > 0 ? (
        <div className="flex flex-col mt-5 border-b-2 mb-20">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-[40px] flex justify-center mb-4"
            onClick={() => window.location.reload()}
          >
            Ask new question
          </button>

          {messages.map((m) => (
            <div
              key={m.id}
              className="flex border-t-2 py-4"
            >
              <div className="font-bold w-[60px]">{m.role === "user" ? "You" : "AI"}:</div>
              <div className="ml-2 whitespace-pre-wrap w-full">{m.content}</div>
            </div>
          ))}
        </div>
      ) : null}

      <form
        className="flex fixed bottom-0 sm:bottom-4"
        onSubmit={handleSubmit}
      >
        <input
          className="w-[280px] sm:w-[500px] border border-gray-300 rounded mb-8 shadow-xl p-2 text-black"
          placeholder="Ask a question about the new NBA CBA..."
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
