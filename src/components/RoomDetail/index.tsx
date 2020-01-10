import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import { useParams } from "react-router";
import {
  getMediaDevices,
  handleRemoteTrackAdded,
  createOffer,
  createAnswer
} from "services/getUserMedia";
import {
  MEDIA_STREAM_CONSTRAINTS,
  SDP_CONSTRAINTS
} from "constants/mediaStreamConstraints";
import {
  StreamingMessageObject,
  STREAMING_MESSAGE
} from "constants/messageType";

const endpoint = process.env.SOCKET_URL || "https://c23b5732.ngrok.io";
console.log("endpoint", endpoint);
const socket = socketIOClient(endpoint, { transports: ["websocket"] });
let pc: RTCPeerConnection;

const RoomDetail = () => {
  const { name: roomName } = useParams();
  const [isInitiator, setIsInitiator] = useState(false);
  const [isChannelReady, setIsChannelReady] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [serverResponseMessage, setServerResponseMessage] = useState<
    StreamingMessageObject
  >({
    type: ""
  });
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // socket actions handler
  const onCreatedRoom = (room: string, clientId: String) => {
    setIsInitiator(true);
    console.log(`Room ${room} Created and Joined by ${clientId}`);
    console.log("This peer is the initiator of room " + room + "!");
  };

  const onFullRoom = (room: string) => {
    console.log("Message from client: Room " + room + " is full :^(");
  };

  const onIpaddr = (ipaddr: string) => {
    console.log("Message from client: Server IP address is " + ipaddr);
  };

  const onJoinRoom = (room: string) => {
    console.log("Another peer made a request to join room " + room);
    setIsChannelReady(true);
  };

  const onJoinedRoom = (room: string, clientId: string) => {
    console.log(`${clientId} joined ${room}`);
    setIsChannelReady(true);
  };

  const onLog = (array: any) => {
    console.log.apply(console, array);
  };

  const sendMessage = (message: StreamingMessageObject) => {
    console.log("Client sending message: ", message);
    socket.emit("message", roomName, message);
  };

  const onMessageReceive = (message: StreamingMessageObject) => {
    console.log("Client received message:", message.type);
    setServerResponseMessage(message);
  };

  // functions
  const accessMediaOnJoin = () => {
    getMediaDevices({
      mediaStreamConstraints: MEDIA_STREAM_CONSTRAINTS,
      videoRef: localVideoRef,
      callBack: gotStream
    });
  };

  const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    console.log("icecandidate event: ", event);
    const candidateEvent = event.candidate;
    if (candidateEvent) {
      const { sdpMLineIndex, sdpMid, candidate } = candidateEvent;
      sendMessage({
        type: STREAMING_MESSAGE.CANDIDATE,
        label: sdpMLineIndex,
        id: sdpMid,
        candidate: candidate
      });
    } else {
      console.log("End of candidates.");
    }
  };

  const createPeerConnection = () => {
    try {
      pc = new RTCPeerConnection();
      pc.onicecandidate = handleIceCandidate;
      pc.ontrack = event => {
        console.log("On Track");
        handleRemoteTrackAdded({ event, videoRef: remoteVideoRef });
      };
      localStream?.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      console.log("Created RTCPeerConnection");
    } catch (e) {
      console.log("Failed to create PeerConnection, exception: " + e.message);
    }
  };

  const doCall = async () => {
    console.log("Sending offer to peer");
    const offerDescription = await createOffer({
      offerOption: SDP_CONSTRAINTS,
      localPeerConnection: pc
    });
    offerDescription && sendMessage(offerDescription);
  };

  const maybeStart = async () => {
    console.log(
      ">>>>>>> maybeStart() ",
      isStarted,
      localStream,
      isChannelReady
    );

    if (!isStarted && isChannelReady && localStream) {
      console.log(">>>>>> creating peer connection");
      createPeerConnection();
      setIsStarted(true);
      if (isInitiator) {
        await doCall();
      }
    }
  };

  const gotStream = ({ mediaStream }: { mediaStream: MediaStream }) => {
    setLocalStream(mediaStream);
    sendMessage({ type: STREAMING_MESSAGE.GOT_USER_MEDIA });
  };

  const doAnswer = async () => {
    console.log("Sending answer to peer.");
    const answerDescription = await createAnswer({ remotePeerConnection: pc });
    answerDescription && sendMessage(answerDescription);
  };

  const setRemoteDescription = async () => {
    console.log("setRemoteDescription");
    await pc.setRemoteDescription(
      serverResponseMessage as RTCSessionDescriptionInit
    );
  };

  useEffect(() => {
    socket.on("log", onLog);
    socket.on("created", onCreatedRoom);
    socket.on("join", onJoinRoom);
    socket.on("joined", onJoinedRoom);
    socket.on("full", onFullRoom);
    socket.on("ipaddr", onIpaddr);
    socket.on("message", onMessageReceive);
    socket.emit("create or join", roomName);
    accessMediaOnJoin();

    return () => {
      // Removing the listener before un-mounting the component
      // in order to avoid addition of multiple listener at the time revisit
      socket.off("log");
      socket.off("created");
      socket.off("join");
      socket.off("joined");
      socket.off("full");
      socket.off("ipaddr");
      socket.off("message");
    };
  }, []);

  const handleGotUserMediaMessage = async () => {
    await maybeStart();
  };

  const handleGotOfferMessage = async () => {
    if (!isInitiator && !isStarted) {
      await maybeStart();
    }
    await setRemoteDescription();
    await doAnswer();
  };

  const handleGotAnswerMessage = async () => {
    await setRemoteDescription();
  };

  const handleGotCandidateMessage = async () => {
    const { label, candidate } = serverResponseMessage;
    var newCandidate = new RTCIceCandidate({
      sdpMLineIndex: label,
      candidate: candidate
    });
    await pc.addIceCandidate(newCandidate);
    console.log("Add ICE candidate success");
  };

  const setDataBasedOnReceivedMessage = async () => {
    if (serverResponseMessage.type === STREAMING_MESSAGE.GOT_USER_MEDIA) {
      await handleGotUserMediaMessage();
    } else if (serverResponseMessage.type === STREAMING_MESSAGE.OFFER) {
      await handleGotOfferMessage();
    } else if (
      serverResponseMessage.type === STREAMING_MESSAGE.ANSWER &&
      isStarted
    ) {
      await handleGotAnswerMessage();
    } else if (
      serverResponseMessage.type === STREAMING_MESSAGE.CANDIDATE &&
      isStarted
    ) {
      await handleGotCandidateMessage();
    }
  };

  // run effect whenever received new message
  useEffect(() => {
    setDataBasedOnReceivedMessage();
  }, [serverResponseMessage, isInitiator, isChannelReady, localStream]);

  return (
    <div>
      <h1>Room {roomName}</h1>
      <video id="localVideo" autoPlay playsInline ref={localVideoRef}></video>
      <video id="remoteVideo" autoPlay playsInline ref={remoteVideoRef}></video>
    </div>
  );
};

export default RoomDetail;
