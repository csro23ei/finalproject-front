import React, { useState } from "react";

const AiChatPage: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleSend = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
  
      // Process the response as you have it
      const contentType = res.headers.get("content-type");
  
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
        setResponse(data.response || "No response from AI");
      } else {
        data = await res.text();
        setResponse(data);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Error communicating with AI");
    }
  };
  

  return (
    <div>
      <h2>Chat with AI</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={handleSend}>Send</button>
      <div>
        <h3>AI's Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default AiChatPage;
