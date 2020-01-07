import React, { useState, useRef } from "react";
import MessageActionButtons from "components/MessegeActionButtons";
import {
  handleConnection,
  createOffer,
  createAnswer
} from "services/getUserMedia";

let localConnection: RTCPeerConnection | null = null;
let remoteConnection: RTCPeerConnection | null = null;
let sendChannel: RTCDataChannel;
let receiveChannel: RTCDataChannel;

const TextAreaInputs = () => {
  const sendAreaRef = useRef<HTMLTextAreaElement>(null);
  const [disableSendArea, setDisableSendArea] = useState(true);
  const [startButtonDisable, setStartButtonDisable] = useState(false);
  const [sendButtonDisable, setSendButtonDisable] = useState(true);
  const [closeButtonDisable, setCloseButtonDisable] = useState(true);
  const [sendAreaValue, onChangeSendAreaValue] = useState("");
  const [recieveAreaValue, onChangeReceiveAreaValue] = useState("");

  const createConnection = async () => {
    localConnection = new RTCPeerConnection();
    sendChannel = localConnection.createDataChannel("sendDataChannel");
    remoteConnection = new RTCPeerConnection();

    localConnection.onicecandidate = handleOnICECandidateConnection;
    sendChannel.onopen = handleOnOpenChannel;
    sendChannel.onclose = handleOnCloseChannel;
    console.log("sendChannel", sendChannel);

    remoteConnection.onicecandidate = handleOnICECandidateConnection;
    remoteConnection.ondatachannel = receiveChannelCallback;

    await createOffer({
      localPeerConnection: localConnection,
      remotePeerConnection: remoteConnection
    });

    await createAnswer({
      localPeerConnection: localConnection,
      remotePeerConnection: remoteConnection
    });
  };

  const handleOnICECandidateConnection = (event: RTCPeerConnectionIceEvent) => {
    if (!localConnection || !remoteConnection) {
      return;
    }
    handleConnection(event, localConnection, remoteConnection);
  };

  const handleOnOpenChannel = () => {
    if (!sendChannel) {
      return;
    }
    console.log("Send channel state is: " + sendChannel.readyState);

    setDisableSendArea(false);
    sendAreaRef.current && sendAreaRef.current.focus();
    setStartButtonDisable(true);
    setSendButtonDisable(false);
    setCloseButtonDisable(false);
  };

  const handleOnCloseChannel = () => {
    if (!sendChannel) {
      return;
    }
    console.log("Send channel state is: " + sendChannel.readyState);

    setDisableSendArea(true);
    setStartButtonDisable(false);
    setSendButtonDisable(true);
    setCloseButtonDisable(true);
  };

  const receiveChannelCallback = (event: RTCDataChannelEvent) => {
    console.log("Receive Channel Callback");
    receiveChannel = event.channel;
    receiveChannel.onmessage = onMessageReceived;
    receiveChannel.onopen = onReceiveChannelStateChange;
    receiveChannel.onclose = onReceiveChannelStateChange;
  };

  const onMessageReceived = (event: MessageEvent) => {
    console.log("Received Message");
    onChangeReceiveAreaValue(event.data);
  };

  const onReceiveChannelStateChange = () => {
    if (!receiveChannel) {
      return;
    }
    console.log("Receive channel state is: " + receiveChannel.readyState);
  };

  const sendData = () => {
    sendChannel && sendChannel.send(sendAreaValue);
  };

  const stopConnection = () => {
    console.log("Closing data channels");
    sendChannel && sendChannel.close();
    console.log("Closed data channel with label: " + sendChannel.label);
    receiveChannel && receiveChannel.close();
    console.log("Closed data channel with label: " + receiveChannel.label);
    localConnection?.close();
    remoteConnection?.close();
    localConnection = null;
    remoteConnection = null;
    console.log("Closed peer connections");
    onChangeReceiveAreaValue("");
    onChangeSendAreaValue("");
    setSendButtonDisable(true);
    setCloseButtonDisable(true);
    setStartButtonDisable(false);
    setDisableSendArea(true);
  };

  return (
    <div>
      <h1>Realtime communication with WebRTC</h1>
      <textarea
        id="dataChannelSend"
        disabled={disableSendArea}
        placeholder="Press Start, enter some text, then press Send."
        ref={sendAreaRef}
        value={sendAreaValue}
        onChange={e => onChangeSendAreaValue(e.target.value)}
      ></textarea>
      <textarea
        id="dataChannelReceive"
        disabled
        value={recieveAreaValue}
      ></textarea>
      <MessageActionButtons
        startButtonDisable={startButtonDisable}
        sendButtonDisable={sendButtonDisable}
        closeButtonDisable={closeButtonDisable}
        onStartClick={createConnection}
        onSendClick={sendData}
        onStopClick={stopConnection}
      />
    </div>
  );
};

export default TextAreaInputs;
