import React, { useState } from "react";
import './AiChat.css';

// Define message type with specific keys
interface Message {
  type: 'ai' | 'user';
  text: string;
}

const AiChatPage: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]); // Array to hold messages

  // Function to simulate slow typing effect
  const typeWriter = (text: string, delay: number = 50) => {
    let index = 0;
    
    // Initialize an empty AI message
    const aiMessage: Message = { type: 'ai', text: '' }; 

    // Add the AI message to the messages array
    setMessages((prev) => [...prev, aiMessage]); // Add the initial empty AI message

    const interval = setInterval(() => {
      if (index < text.length) {
        aiMessage.text += text.charAt(index); // Append each character
        
        // Update the last message in state
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = { type: 'ai', text: aiMessage.text }; // Update the last message
          return updatedMessages;
        });
        index++;
      } else {
        clearInterval(interval); // Stop the interval when done
      }
    }, delay);
  };

  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    // Add user's message
    setMessages((prev) => [...prev, { type: 'user', text: input }]);
    const userInput = input;
    setInput(""); // Clear input after sending

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      const contentType = res.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
        const aiResponse = data.response || "No response from AI";
        typeWriter(aiResponse); // Call typeWriter to display response slowly
      } else {
        data = await res.text();
        typeWriter(data); // Call typeWriter for non-JSON response
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      typeWriter("Error communicating with AI");
    }
  };

  return (
    <div className="ai-chat-container">
      <h2>Chat with AI</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={handleSend}>Send</button>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.type === 'ai' ? 'ai-response' : 'user-message'}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiChatPage;
