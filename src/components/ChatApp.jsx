import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// 连接到后端服务器
const socket = io("http://54.82.75.121", {
    path: "/socket.io/", // 与后端匹配
  }); // 确保地址与后端一致

const ChatApp = () => {
  const [messages, setMessages] = useState([]); // 聊天消息存储
  const [message, setMessage] = useState("");  // 输入框中的消息

  useEffect(() => {
    // 监听来自后端的消息
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // 组件卸载时清理监听器
    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message); // 发送消息到后端
      console.log("Message sent:", message); // 调试日志
      setMessage(""); // 清空输入框
    }
  };

  return (
    <div>
      <h2>Chat System</h2>
      <div
        className="chat-box"
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "250px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index} style={{ margin: "5px 0" }}>
            {msg}
          </p>
        ))}
      </div>
      <form onSubmit={handleSendMessage} style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          style={{ width: "70%", padding: "10px", marginRight: "10px", marginLeft:"5px" }}
          required
        />
        <button type="submit" style={{ padding: "10px" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatApp;
