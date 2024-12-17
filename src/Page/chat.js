import React, { useState, useEffect, use } from "react";
import io from "socket.io-client";
import "../Style/App.css"; // Add styles for a WhatsApp-like look
import axios from "axios";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState("pinka");
  const [users, setUser] = useState([]);
  const [seleted, setSeleted] = useState("");
  const [receiver_id, setReceiver_id] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [messages, setMessages] = useState([]);


  const SOCKET_SERVER_URL = "https://bingo-nodejs.onrender.com";

  // const SOCKET_SERVER_URL = "https://bingo-game-backend-vn8z.onrender.com"

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
   
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        const response = await axios.get(`https://bingo-nodejs.onrender.com/api/v1/auth/get-user`);
        console.log("User data fetched successfully:", response.data.data);
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    const currentUserData = localStorage.getItem("login_user");
    const data = currentUserData ? JSON.parse(currentUserData) : null;

    if (!data || !data.data || !data.data._id) {
      console.error("Invalid current user data:", currentUserData);
      return;
    }

    console.log("Connecting to chat server...");
    newSocket.emit("joinChatRoom", { userId: data.data._id });

    newSocket.on("receiveMessage", (data) => {
      console.log("Message received:", data);
      setMessages((prevMessages) => {
        console.log("Previous messages:", prevMessages);
        const updatedMessages = [...prevMessages, ...data];
        console.log("Updated messages:", updatedMessages);
        return updatedMessages;
      });
    });

    setSocket(newSocket);

    fetchUserData();

    console.log("Socket setup complete");

    // return () => {
    //   console.log("Disconnecting socket...");
    //   newSocket.disconnect();
    // };
  }, []);


  const sendMessageChatSocket = () => {
    if (!input.trim()) return;
    let currentUserData = localStorage.getItem("login_user");
    let data = JSON.parse(currentUserData);

    const newMessage = {
      sender_id: data.data._id,
      receiver_id: receiver_id,
      message: input,
    };

    if (socket) {
      socket.emit("sendMessage", newMessage);
    }

    setInput("");
  };
  // console.log("serder all smessages", messages);

  const btnUserClick = (user) => {
    console.log("user data === >", user);
    setSeleted(user.name);
    setReceiver_id(user._id);
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>Users</h3>
        {users.map((user, index) => (
          <div
            key={index}
            className="user-item"
            onClick={() => btnUserClick(user)}
          >
            <strong>{user.name}</strong>
          </div>
        ))}
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h2>Chat with {seleted}</h2>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            console.log("check user message ==== >", messages),
            <div
              key={index}
              className={`chat-message ${msg.sender === currentUser ? "sent" : "received"
                }`}
            >
              <p>
                <strong>{msg.message}</strong>
                {/* <strong>{msg.senderMsg}:</strong> {msg.text} */}
              </p>
              <span className="timestamp">
                {new Date(new Date().toISOString()).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessageChatSocket}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
