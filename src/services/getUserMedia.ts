type GotLocalMediaStreamParams = {
  mediaStream: MediaStream;
  videoRef: React.RefObject<HTMLVideoElement>;
  callBack: Function;
};

const gotLocalMediaStream = ({
  mediaStream,
  videoRef,
  callBack = () => {}
}: GotLocalMediaStreamParams) => {
  videoRef.current && (videoRef.current.srcObject = mediaStream);
  callBack();
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
