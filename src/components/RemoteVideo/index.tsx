import React, { useRef, useEffect, useState } from "react";
import { getMediaDevices, handleConnection } from "services/getUserMedia";
import { MEDIA_STREAM_CONSTRAINTS } from "contants/mediaStreamConstraints/mediaStreamConstraints";
import ActionButtons from "components/ActionButtons";

const RemoteVideo = () => {
  const remoteVideoRef = useRef(null);
  const [isCallDisable, setIsCallDisable] = useState(true);
  const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection());

  const enableCallButton = () => {
    setIsCallDisable(false);
  };

  // function getOtherPeer(peerConnection) {
  //   return peerConnection === localPeerConnection
  //     ? remotePeerConnection
  //     : localPeerConnection;
  // }

  useEffect(() => {
    console.log("localPeerConnection", peerConnection);
    peerConnection.addEventListener("icecandidate", e =>
      handleConnection(e, peerConnection)
    );
    // localPeerConnection.addEventListener(
    //   "iceconnectionstatechange",
    //   handleConnectionChange
    // );
  });

  return (
    <>
      <video id="remote" autoPlay playsInline ref={remoteVideoRef}></video>
      <ActionButtons isCallDisable={isCallDisable} />
    </>
  );
};

export default RemoteVideo;
