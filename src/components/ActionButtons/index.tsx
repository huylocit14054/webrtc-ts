import React from "react";

type Props = {
  isCallDisable: boolean;
  isStartDisable: boolean;
  isHangupDisable: boolean;
  handleStartButton: () => void;
  handleOnCallButton: () => void;
};

const ActionButtons = ({
  isCallDisable,
  isStartDisable,
  isHangupDisable,
  handleStartButton,
  handleOnCallButton
}: Props) => {
  return (
    <div>
      <button
        onClick={handleStartButton}
        disabled={isStartDisable}
        id="startButton"
      >
        Start
      </button>
      <button
        onClick={handleOnCallButton}
        disabled={isCallDisable}
        id="callButton"
      >
        Call
      </button>
      <button disabled={isHangupDisable} id="hangupButton">
        Hang Up
      </button>
    </div>
  );
};

export default ActionButtons;
