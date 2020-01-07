import React from "react";
import { Redirect, Switch } from "react-router";
import { Link, Route } from "react-router-dom";
import { ROUTES } from "constants/mediaStreamConstraints/routes";
import LocalVideo from "./LocalVideo";
import TextAreaInputs from "./TextAreaInputs";

const App: React.FC = () => {
  return (
    <div className="App">
      <Link to={ROUTES.LOCAL_VIDEO_STREAM}>Local Stream Video</Link>
      <Link to={ROUTES.LOCAL_TEXT_SEND}>Local Text Message</Link>
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
          <Redirect from={ROUTES.HOME} to={ROUTES.LOCAL_VIDEO_STREAM} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
