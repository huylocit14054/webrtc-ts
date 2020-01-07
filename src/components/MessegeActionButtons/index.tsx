import React from "react";

type Props = {
  startButtonDisable: boolean;
  sendButtonDisable: boolean;
  closeButtonDisable: boolean;
  onStartClick: () => void;
  onSendClick: () => void;
  onStopClick: () => void;
};

const MessageActionButtons = ({
  startButtonDisable,
  sendButtonDisable,
  closeButtonDisable,
  onStartClick,
  onSendClick,
  onStopClick
}: Props) => {
  return (
    <div>
      <button
        disabled={startButtonDisable}
        id="startButton"
        onClick={onStartClick}
      >
        Start
      </button>
      <button
        onClick={onSendClick}
        disabled={sendButtonDisable}
        id="sendButton"
      >
        Send
      </button>
      <button
        onClick={onStopClick}
        disabled={closeButtonDisable}
        id="closeButton"
      >
        Stop
      </button>
    </div>
  );
};

export default MessageActionButtons;
