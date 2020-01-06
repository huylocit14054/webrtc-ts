import React from "react";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Realtime communication with WebRTC</h1>
      <div>
        <LocalVideo />
        {/* <RemoteVideo /> */}
      </div>
    </div>
  );
};

export default App;
