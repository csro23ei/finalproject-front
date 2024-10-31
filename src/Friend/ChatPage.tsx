import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ChatPage: React.FC = () => {
  const { friendUsername } = useParams<{ friendUsername: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadMessages = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        try {
          const response = await fetch(
            `http://localhost:8080/chat/history/${user.username}/${friendUsername}`
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      }
    };
    loadMessages();
  }, [friendUsername]);

  const handleSendMessage = async () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const messageData = {
        senderId: user.username,
        recipientId: friendUsername,
        content: newMessage,
      };
      const response = await fetch("http://localhost:8080/chat/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });
      if (response.ok) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...messageData, timestamp: new Date().toISOString() },
        ]);
        setNewMessage("");
      } else {
        console.error("Failed to send message");
      }
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>Chat with {friendUsername}</h2>
      <div>
        <h3>Messages</h3>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>
                {message.senderId ===
                JSON.parse(localStorage.getItem("user") || "{}").username
                  ? "You"
                  : message.senderId}
                :
              </strong>
              {message.content}
              <span> ({new Date(message.timestamp).toLocaleTimeString()})</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
