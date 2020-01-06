import React from "react";
import LocalVideo from "./LocalVideo";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Realtime communication with WebRTC</h1>
      <LocalVideo />
    </div>
  );
};

export default App;
