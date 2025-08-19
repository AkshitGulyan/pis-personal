import { useState, useRef } from "react";
import { fetchChatbotResponse } from "../api";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(400); // default panel width
  const resizing = useRef(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetchChatbotResponse(input);
      const botMessage = { role: "bot", content: response.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Resize logic
  const handleMouseDown = () => {
    resizing.current = true;
  };
  const handleMouseMove = (e) => {
    if (!resizing.current) return;
    setWidth(window.innerWidth - e.clientX);
  };
  const handleMouseUp = () => {
    resizing.current = false;
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500"
      >
        💬
      </button>

      {/* Side Panel */}
      {open && (
        <div
          className="fixed top-0 right-0 h-full bg-gray-900 text-white shadow-lg flex flex-col z-40"
          style={{ width: `${width}px` }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Resize Handle */}
          <div
            className="absolute left-0 top-0 h-full w-2 cursor-col-resize bg-gray-700 opacity-50"
            onMouseDown={handleMouseDown}
          ></div>

          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex justify-between">
            <h2 className="text-lg font-bold">AI Copilot</h2>
            <button onClick={() => setOpen(false)} className="text-red-400">
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-right"
                    : "bg-gray-700 text-left"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-gray-400">Thinking...</div>}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none"
              placeholder="Ask something..."
            />
            <button
              onClick={handleSend}
              className="ml-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
