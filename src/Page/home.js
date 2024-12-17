import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../Style/App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const SOCKET_SERVER_URL = "https://bingo-nodejs.onrender.com"; // Replace with your server's URL

function App() {
  const [socket, setSocket] = useState(null);
  const [log, setLog] = useState("");
  const [data, setData] = useState("");
  const [receiver_id, setReceiver_id] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [getCurrentUserData, setGetCurrentUserData] = useState({});
  const navigate = useNavigate();

  // console.log("log", log);
  // console.log("data", data);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("connect", () => {
      if (newSocket.connected) {
        addLog(`Connected with ID: ${newSocket.id}`);
      }
    });

    newSocket.on("roomJointed", (data) => {
      console.log("roomJointed ===== >", data.message);
      setData(data.message);
      addLog(data.message);
    });
    let temData = "chat test message.......";

    newSocket.on("receiveMessage", (sender_id) => {
      console.log("receiveMessage === >", temData);
      setData(data.message);
      addLog(data.message);
    });
    setSocket(newSocket);

    let currentUserData = localStorage.getItem("login_user");
   let data = (JSON.parse(currentUserData));
   setGetCurrentUserData(data);
    console.log("get getCurrentUserData from local storage 1 === >",getCurrentUserData)

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const redirectChatPage = () => {
    navigate("/chat");
  };

  const addLog = (message) => {
    setLog((prevLog) => `${prevLog}\n${message}`);
  };

  const connectSocket = () => {
    if (socket) {
      socket.connect();
      addLog(`Socket connected: ${socket.id}`);
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      addLog("Socket connection closed");
    }
  };

  const joinRoom = () => {
    console.log("Joining room...");
    const id = socket.id;
    if (socket) {
      socket.emit("joinRoom", { id }, (response) => {
        // You can handle response here if needed
        addLog(response.message || "Successfully requested to join room");
      });
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit("leaveRoom", {}, (response) => {
        addLog(response.message || "Left the room successfully");
      });
    }
  };

  const onLoginBtn = async () => {
    try {
      const response = await axios.post(
        `${SOCKET_SERVER_URL}/api/v1/auth/login`,
        { email: emailInputValue },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response:", response.data);
      if (response.data.statusCode == 200) {
        console.log("response succesfully", response.data);
        localStorage.setItem("login_user", JSON.stringify(response.data));
      }
      // console.log("current user data first log === >",isUserLogin)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error:",
          error.response?.status,
          error.response?.data
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleInputChange = (event) => {
    setEmailInputValue(event.target.value);
  };

  // const chatSocket = () => {
  //   console.log("chat start.....", socket.id);
  //   setSender_id(socket.id);
  //   const data2 = {
  //     sender_id: sender_id,
  //     receiver_id: "XTo1-yH90tXuTaAoAAAG",
  //     message: "Hello, how are you?",
  //   };
  //   if (socket) {
  //     socket.emit("sendMessage", data2, (response) => {
  //       // You can handle response here if needed
  //       addLog(response.message || "Successfully send message");
  //     });
  //   }
  // };
  console.log("get getCurrentUserData from local storage 2 === >",!getCurrentUserData)
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Socket.IO React Testing</h1>
      <div style={{ margin: "10px" }}>
        <button onClick={() => connectSocket()}>connect</button>
        <button onClick={() => disconnectSocket()}>Disconnect</button>
        <button onClick={() => leaveRoom()}>Leave Room</button>
      </div>
      <h2>Logs</h2>
      <textarea
        value={log}
        readOnly
        rows={10}
        style={{
          width: "80%",
          marginTop: "20px",
          borderRadius: "5px",
          padding: "10px",
        }}
      />
      `
      {getCurrentUserData ? ( 
        <div style={{ marginLeft: "68rem" }}>
          <button className="chat-btn" onClick={() => redirectChatPage()}>
            chat
          </button>
        </div>
      ) : (
        <div style={{ marginLeft: "68rem" }}>
          <input
            className="chat-btn"
            style={{ width: "14rem" }}
            placeholder="login with user email............"
            onChange={handleInputChange}
          ></input>
          <button
            style={{ marginTop: "1rem", padding: ".2rem", width: "6rem" }}
            onClick={onLoginBtn}
          >
            submit
          </button>
        </div>
      )}
      `
    </div>
  );
}

export default App;
