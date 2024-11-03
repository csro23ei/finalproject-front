import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import './ChatPage.css';

const ChatPage: React.FC = () => {
  const { friendUsername } = useParams<{ friendUsername: string }>();
  const [messages, setMessages] = useState<any[]>(() => {
    const savedMessages = localStorage.getItem(`messages_${friendUsername}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [newMessage, setNewMessage] = useState<string>("");
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const stompClient = new Client({
      // Remove brokerURL when using webSocketFactory with SockJS
      webSocketFactory: () => new SockJS('http://localhost:8080/websocket'),
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          stompClient.subscribe(`/user/${user.username}/queue/messages`, (message) => {
            const incomingMessage = JSON.parse(message.body);
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages, incomingMessage];
              localStorage.setItem(`messages_${friendUsername}`, JSON.stringify(updatedMessages));
              return updatedMessages;
            });
          });
        }
      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [friendUsername]);

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
        <button onClick={() => {/* Send message code */}}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
