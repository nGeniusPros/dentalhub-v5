import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";

export const PatientChat = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      sender: string;
      content: string;
      timestamp: string;
    }>
  >([]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: "staff",
        content: message,
        timestamp: new Date().toISOString(),
      },
    ]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Patient Messages</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "staff" ? "justify-end" : "justify-start"} mb-4`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === "staff" ? "bg-primary text-white" : "bg-gray-100"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <Button onClick={handleSend}>
            <Icons.Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
