import React from "react";
import { Redirect, Switch } from "react-router";
import { Link, Route } from "react-router-dom";
import { ROUTES } from "constants/mediaStreamConstraints/routes";
import LocalVideo from "./LocalVideo";
import TextAreaInputs from "./TextAreaInputs";
import JoinRoomInput from "./JoinRoomInput";
import RoomDetail from "./RoomDetail";

const App: React.FC = () => {
  return (
    <div className="App">
      <Link to={ROUTES.LOCAL_VIDEO_STREAM}>Local Stream Video</Link>
      <Link to={ROUTES.LOCAL_TEXT_SEND}>Local Text Message</Link>
      <Link to={ROUTES.JOIN_ROOM}>Join Room</Link>
      <div>
        <Switch>
          <Route
            exact
            path={ROUTES.LOCAL_VIDEO_STREAM}
            component={LocalVideo}
          />
          <Route
            exact
            path={ROUTES.LOCAL_TEXT_SEND}
            component={TextAreaInputs}
          />
          <Route exact path={ROUTES.JOIN_ROOM} component={JoinRoomInput} />
          <Route path={`${ROUTES.ROOMS}/:name`} component={RoomDetail} />
          <Redirect from={ROUTES.HOME} to={ROUTES.LOCAL_VIDEO_STREAM} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
