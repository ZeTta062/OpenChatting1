import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// ES modules
import { io } from "socket.io-client";

function App() {
  const [count, setCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [userInput, setUserInput] = useState("");
  const [frontSocket, setFrontSocket] = useState(null);

  function connectToChatServer() {
    console.log('connectToChatServer');
    const _frontSocket = io('http://localhost:3000', {
      autoConnect : false,
      query: {
        username: username,
      },
    });
    _frontSocket.connect();
    setFrontSocket(_frontSocket);
  }
  
  function disconnectToChatServer() {
    console.log('disconnectToChatServer');
    frontSocket?.disconnect();
  }

  function onConnected() {
    console.log("front on Connected");
    setIsConnected(true);
  }

  function onDisconnected() {
    console.log("front on Disconnected");
    setIsConnected(false);
  }  

  function onMessageReceived(msg) {
    console.log("onMessageReceived");
    console.log(msg);

    setMessages(previous => [...previous, msg]);
  }

  function sendMessageToChatServer() {
    console.log(`front send Message To ChatServer / ${userInput}`);
    frontSocket?.emit("new_message", {username: username, message: userInput}, (response) => {
      console.log(response);
    })
  }  

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth"
    })
  }, [messages]);

  useEffect(() => {
    frontSocket?.on("connect", onConnected); 
    frontSocket?.on("disconnect", onDisconnected); 
    frontSocket?.on("new_message", onMessageReceived); 

    return () => {
      frontSocket?.off("connect", onConnected);
      frontSocket?.off("disconnect", onDisconnected); 
      frontSocket?.on("new_message", onMessageReceived); 
    };
  }, [frontSocket]);

  const messageList = messages.map((aMsg, index) => 
    <li key={index}>
      {aMsg.username} : {aMsg.message}
    </li>
  );

  return (
    <div className='Main'>
      <h1>유저: {username}</h1>
      <h2>접속상태: {isConnected ? "🟢온라인" : "⚫오프라인"}</h2>
      <div className='card'>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={() => connectToChatServer()}>
            접속
        </button>
        <button onClick={() => disconnectToChatServer()}>
          접속 종료
        </button>
      </div>

      <div className='card'>
        <input value={userInput} onChange={(e) => setUserInput(e.target.value)} />
        <button onClick={() => sendMessageToChatServer()}>
          보내기
        </button>
      </div>
      <ul>
        {messageList}
      </ul>
    </div>
  )
}

export default App
