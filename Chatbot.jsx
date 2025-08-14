import { useState } from "react";
import { endpoints } from "../api";
import { marked } from "marked";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const res = await fetch(endpoints.chatbot(input));
    const data = await res.json();
    const botMsg = { sender: "bot", text: data.markdown };
    setMessages((m) => [...m, botMsg]);
  };

  return (
    <>
      <button
        className="chat-fab bg-indigo-600 p-4 rounded-full shadow-lg"
        onClick={() => setOpen((o) => !o)}
      >
        💬
      </button>
      {open && (
        <div className="chat-window flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.sender === "user"
                    ? "text-right text-blue-300"
                    : "text-left text-green-300"
                }
                dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
              />
            ))}
          </div>
          <div className="p-2 flex gap-2">
            <input
              className="flex-1 bg-gray-800 p-2 rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button
              className="bg-indigo-500 px-4 py-2 rounded"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
