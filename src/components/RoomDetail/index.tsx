import React, { useEffect } from "react";
import socketIOClient from "socket.io-client";
import { useParams } from "react-router";

const endpoint = process.env.SOCKET_URL || "http://127.0.0.1:4001";

const RoomDetail = () => {
  const { name } = useParams();

  const onCreatedRoom = (room: string, clientId: String) => {
    console.log(`Room ${room} Created and Joined by ${clientId}`);
  };

  const onFullRoom = (room: string) => {
    console.log("Message from client: Room " + room + " is full :^(");
  };

  const onIpaddr = (ipaddr: string) => {
    console.log("Message from client: Server IP address is " + ipaddr);
  };

  const onJoinedRoom = (room: string, clientId: string) => {
    console.log(` ${clientId} joined ${room}`);
  };

  const onLog = (array: any) => {
    console.log.apply(console, array);
  };

  useEffect(() => {
    const socket = socketIOClient(endpoint);
    socket.emit("create or join", name);
    socket.on("created", onCreatedRoom);
    socket.on("full", onFullRoom);
    socket.on("ipaddr", onIpaddr);
    socket.on("joined", onJoinedRoom);
    socket.on("log", onLog);
  }, []);

  return (
    <div>
      <h1>Room {name}</h1>
    </div>
  );
};

export default RoomDetail;
