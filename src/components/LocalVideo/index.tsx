import React, { useRef, useEffect, useState } from "react";
import {
  getMediaDevices,
  handleConnection,
  handleConnectionChange,
  addICECandidate,
  addICEConnectionStateChange,
  createOffer,
  createAnswer,
  gotRemoteMediaStream
} from "services/getUserMedia";
import {
  MEDIA_STREAM_CONSTRAINTS,
  OFFER_OPTIONS
} from "contants/mediaStreamConstraints/mediaStreamConstraints";
import ActionButtons from "components/ActionButtons";

const LocalVideo = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isCallDisable, setIsCallDisable] = useState(true);
  const [isStartDisable, setIsStartDisable] = useState(false);
  const [isHangupDisable, setIsHangupDisable] = useState(true);
  const [localStream, setLocalStream] = useState({} as MediaStream);
  const localPeerConnection = new RTCPeerConnection();
  const remotePeerConnection = new RTCPeerConnection();

  const getMediaDevicesCallback = ({
    mediaStream
  }: {
    mediaStream: MediaStream;
  }) => {
    setLocalStream(mediaStream);
  };

  // function getOtherPeer(peerConnection) {
  //   return peerConnection === localPeerConnection
  //     ? remotePeerConnection
  //     : localPeerConnection;
  // }

  const handleConnectionListener = async (e: RTCPeerConnectionIceEvent) => {
    await handleConnection(e, localPeerConnection, remotePeerConnection);
  };

  useEffect(() => {
    addICECandidate(localPeerConnection, handleConnectionListener);
    addICEConnectionStateChange(localPeerConnection, handleConnectionChange);

    addICECandidate(remotePeerConnection, handleConnectionListener);
    addICEConnectionStateChange(remotePeerConnection, handleConnectionChange);
    remotePeerConnection.addEventListener("addstream", (event: any) =>
      gotRemoteMediaStream({ event, videoRef: remoteVideoRef })
    );
  }, []);

  const handleStartButton = async () => {
    setIsStartDisable(true);
    await getMediaDevices({
      mediaStreamConstraints: MEDIA_STREAM_CONSTRAINTS,
      videoRef: localVideoRef,
      callBack: getMediaDevicesCallback
    });
    setIsCallDisable(false);
  };

  const handleCallAction = async () => {
    setIsCallDisable(true);
    setIsHangupDisable(false);
    console.log("Starting call.");

    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();

    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}.`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}.`);
    }

    localStream
      .getTracks()
      .forEach(track => localPeerConnection.addTrack(track, localStream));

    await createOffer({
      offerOption: OFFER_OPTIONS,
      localPeerConnection,
      remotePeerConnection
    });

    await createAnswer({
      localPeerConnection,
      remotePeerConnection
    });
  };

  return (
    <>
      <video id="localVideo" autoPlay playsInline ref={localVideoRef}></video>
      <video id="remoteVideo" autoPlay playsInline ref={remoteVideoRef}></video>
      <ActionButtons
        isCallDisable={isCallDisable}
        isStartDisable={isStartDisable}
        isHangupDisable={isHangupDisable}
        handleStartButton={handleStartButton}
        handleOnCallButton={handleCallAction}
      />
    </>
  );
};

export default LocalVideo;
