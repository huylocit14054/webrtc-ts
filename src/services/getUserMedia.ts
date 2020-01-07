type GotLocalMediaStreamParams = {
  mediaStream: MediaStream;
  videoRef: React.RefObject<HTMLVideoElement>;
  callBack?: Function;
};

const gotLocalMediaStream = ({
  mediaStream,
  videoRef,
  callBack
}: GotLocalMediaStreamParams) => {
  videoRef.current && (videoRef.current.srcObject = mediaStream);
  console.log("Received local stream.");
  callBack && callBack({ mediaStream, videoRef });
};

const handleLocalMediaStreamError = (error: MediaStreamError) => {
  console.log("navigator.getUserMedia error: ", error);
};

type GetMediaDevicesParams = {
  mediaStreamConstraints: MediaStreamConstraints;
  videoRef: React.RefObject<HTMLVideoElement>;
  callBack?: Function;
};

export const getMediaDevices = async ({
  mediaStreamConstraints,
  videoRef,
  callBack = () => {}
}: GetMediaDevicesParams) => {
  try {
    const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia(
      mediaStreamConstraints
    );
    gotLocalMediaStream({ mediaStream, videoRef, callBack });
  } catch (error) {
    handleLocalMediaStreamError(error);
  }
};

export const handleConnection = async (
  event: RTCPeerConnectionIceEvent,
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection
) => {
  const peerConnection = event.target as RTCPeerConnection;
  const iceCandidate = event.candidate;
  console.log("handleConnection");

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(
      iceCandidate as RTCIceCandidateInit
    );
    const otherPeer = getOtherPeer(
      peerConnection,
      localPeerConnection,
      remotePeerConnection
    );
    try {
      await otherPeer.addIceCandidate(newIceCandidate);
    } catch (error) {}
  }
};

const getOtherPeer = (
  peerConnection: RTCPeerConnection,
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection
) => {
  return peerConnection === localPeerConnection
    ? remotePeerConnection
    : localPeerConnection;
};

const handleConnectionSuccess = (
  peerConnection: RTCPeerConnection,
  localPeerConnection: RTCPeerConnection
) => {
  console.log(
    `${getPeerName(
      peerConnection,
      localPeerConnection
    )} addIceCandidate success.`
  );
};

const getPeerName = (
  peerConnection: RTCPeerConnection,
  localPeerConnection: RTCPeerConnection
) => {
  return peerConnection === localPeerConnection
    ? "localPeerConnection"
    : "remotePeerConnection";
};

export const handleConnectionChange = (event: Event) => {
  const peerConnection = event.target;
  console.log("ICE state change event: ", event);
};

export const addICECandidate = (
  peerConnection: RTCPeerConnection,
  handleConnectionListener: (e: RTCPeerConnectionIceEvent) => void
) => {
  peerConnection.addEventListener("icecandidate", handleConnectionListener);
};

export const addICEConnectionStateChange = (
  peerConnection: RTCPeerConnection,
  handleConnectionChange: (e: Event) => void
) => {
  peerConnection.addEventListener(
    "iceconnectionstatechange",
    handleConnectionChange
  );
};

type CreateOfferParams = {
  offerOption: RTCOfferOptions;
  localPeerConnection: RTCPeerConnection;
  remotePeerConnection: RTCPeerConnection;
};
export const createOffer = async ({
  offerOption,
  localPeerConnection,
  remotePeerConnection
}: CreateOfferParams) => {
  try {
    const offerDescription: RTCSessionDescriptionInit = await localPeerConnection.createOffer(
      offerOption
    );
    console.log(`Offer from localPeerConnection:\n${offerDescription.sdp}`);

    console.log("localPeerConnection setLocalDescription start.");
    await localPeerConnection.setLocalDescription(offerDescription);
    setDescriptionSuccess(
      localPeerConnection,
      localPeerConnection,
      `setLocalDescription`
    );

    console.log("remotePeerConnection setRemoteDescription start.");
    await remotePeerConnection.setRemoteDescription(offerDescription);
    setDescriptionSuccess(
      remotePeerConnection,
      localPeerConnection,
      `setRemoteDescription`
    );
  } catch (error) {
    console.log("error", error);
  }
};

const setDescriptionSuccess = (
  peerConnection: RTCPeerConnection,
  localPeerConnection: RTCPeerConnection,
  functionName: string
) => {
  const peerName = getPeerName(peerConnection, localPeerConnection);
  console.log(`${peerName} ${functionName} complete.`);
};

type CreateAnswerParams = {
  localPeerConnection: RTCPeerConnection;
  remotePeerConnection: RTCPeerConnection;
};

export const createAnswer = async ({
  localPeerConnection,
  remotePeerConnection
}: CreateAnswerParams) => {
  try {
    const answerDescription: RTCSessionDescriptionInit = await remotePeerConnection.createAnswer();
    console.log(`Answer from remotePeerConnection:\n${answerDescription.sdp}.`);

    await remotePeerConnection.setLocalDescription(answerDescription);
    await localPeerConnection.setRemoteDescription(answerDescription);
  } catch (error) {
    console.log("error", error);
  }
};

type GotRemoteMediaStreamPrams = {
  event: MediaStreamEvent;
  videoRef: React.RefObject<HTMLVideoElement>;
};

export const gotRemoteMediaStream = ({
  event,
  videoRef
}: GotRemoteMediaStreamPrams) => {
  console.log("event", event);
  const mediaStream = event.stream;
  videoRef.current && (videoRef.current.srcObject = mediaStream);
  console.log("Remote peer connection received remote stream.");
};
