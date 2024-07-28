"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";


interface Message {
  username: string;
  text: string;
  roomId: string;
  socketID: string;
  messageId: string;
}


interface User {
  id: string;
  username: string;
}


const Chat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: string }>({});
  const [userId] = useState<string>(Math.random().toString(36).substring(7));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newRoomId, setNewRoomId] = useState<string>("");


  useEffect(() => {
    const newSocket = io("http://localhost:6161", {
      query: { userId },
    });
    setSocket(newSocket);


    newSocket.on("receive_message", (data: Message) => {
      setChatMessages((prevMessages) => [...prevMessages, data]);
    });


    newSocket.on("load_messages", (messages: Message[]) => {
      setChatMessages(messages);
    });


    newSocket.on(
      "user_typing",
      (data: { userId: string; username: string }) => {
        setTypingUsers((prevTypingUsers) => ({
          ...prevTypingUsers,
          [data.userId]: data.username,
        }));
      }
    );


    newSocket.on(
      "user_stop_typing",
      (data: { userId: string; username: string }) => {
        setTypingUsers((prevTypingUsers) => {
          const newTypingUsers = { ...prevTypingUsers };
          delete newTypingUsers[data.userId];
          return newTypingUsers;
        });
      }
    );


    return () => {
      newSocket.close();
    };
  }, [userId]);


  const createChat = async () => {
    try {
      const response = await axios.post(
        "http://localhost:6161/api/create-chat",
        { roomId: newRoomId }
      );
      console.log("Chat created:", response.data);
      setRoomId(newRoomId);
      setIsModalOpen(false);
      joinRoom(newRoomId);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };


  const joinRoom = async (roomId: string) => {
    if (socket && roomId && username) {
      socket.emit("join_room", roomId, username);
      // Load messages from the server
      try {
        const response = await axios.get<Message[]>(
          `http://localhost:3001/api/messages/${roomId}`
        );
        setChatMessages(response.data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    }
  };


  const sendMessage = () => {
    if (socket && message) {
      const messageData: Message = {
        username,
        text: message,
        roomId,
        socketID: socket.id!, // Use non-null assertion operator here
        messageId: Math.random().toString(36).substring(7),
      };
      socket.emit("send_message", messageData);
      setMessage("");
      socket.emit("stop_typing", { username });
    }
  };


  const handleTyping = () => {
    if (socket) {
      socket.emit("typing", { username });
    }
  };


  const handleStopTyping = () => {
    if (socket) {
      socket.emit("stop_typing", { username });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-0 right-0 m-2">
        <button
          className="p-2 bg-green-500 text-white rounded-md mr-2"
          onClick={() => setIsModalOpen(true)}
        >
          Create Chat
        </button>
      </div>
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Hajj Chat</h1>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Room ID"
          />
          <button
            className="p-2 text-sm w-[150px] bg-blue-500 text-white rounded-md"
            onClick={() => joinRoom(roomId)}
          >
            Join Room
          </button>
        </div>
        <div className="mb-4 p-4 border border-gray-300 rounded-md overflow-y-auto h-64 bg-gray-50">
          {chatMessages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.username}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            onKeyPress={handleTyping}
            onKeyUp={handleStopTyping}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {Object.values(typingUsers).map((username, index) => (
            <p key={index}>{username} is typing...</p>
          ))}
        </div>
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Create a New Chat</h2>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              value={newRoomId}
              onChange={(e) => setNewRoomId(e.target.value)}
              placeholder="Enter Room ID"
            />
            <div className="flex justify-end">
              <button
                className="p-2 bg-gray-500 text-white rounded-md mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="p-2 bg-green-500 text-white rounded-md"
                onClick={createChat}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Chat;



