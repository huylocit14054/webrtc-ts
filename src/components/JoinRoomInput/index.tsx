import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ROUTES } from "constants/mediaStreamConstraints/routes";

const JoinRoomInput = () => {
  const [inputValue, onChangeInputValue] = useState("");
  const history = useHistory();

  return (
    <div>
      <input
        value={inputValue}
        onChange={event => onChangeInputValue(event.target.value)}
      />
      <button onClick={() => history.push(`${ROUTES.ROOMS}/${inputValue}`)}>
        Join Room
      </button>
    </div>
  );
};

export default JoinRoomInput;
