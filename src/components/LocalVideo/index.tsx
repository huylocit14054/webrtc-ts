import React, { useRef, useEffect, useState } from "react";
import { getMediaDevices } from "services/getUserMedia";
import { MEDIA_STREAM_CONSTRAINTS } from "contants/mediaStreamConstraints/mediaStreamConstraints";
import ActionButtons from "components/ActionButtons";

const LocalVideo = () => {
  const localVideoRef = useRef(null);
  const [isCallDisable, setIsCallDisable] = useState(true);

  useEffect(() => {
    let localPeerConnection;
    localPeerConnection = new RTCPeerConnection();
    // localPeerConnection.addEventListener("icecandidate", handleConnection);
    // localPeerConnection.addEventListener(
    //   "iceconnectionstatechange",
    //   handleConnectionChange
    // );
    getMediaDevices({
      mediaStreamConstraints: MEDIA_STREAM_CONSTRAINTS,
      videoRef: localVideoRef
    });
  });

  return (
    <>
      <video id="localVideo" autoPlay playsinline ref={localVideoRef}></video>
      <ActionButtons isCallDisable={isCallDisable} />
    </>
  );
};

export default LocalVideo;
