import React from "react";

type Props = {
  isCallDisable: boolean;
};

const ActionButtons = ({ isCallDisable }: Props) => {
  return (
    <div>
      <button disabled={isCallDisable} id="startButton">
        Start
      </button>
      <button id="callButton">Call</button>
      <button id="hangupButton">Hang Up</button>
    </div>
  );
};

export default ActionButtons;
