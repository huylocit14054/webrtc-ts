export const MEDIA_STREAM_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: {
      min: 1280
    },
    height: {
      min: 720
    }
  }
};

export const OFFER_OPTIONS: RTCOfferOptions = {
  offerToReceiveVideo: true
};

export const PC_CONFIG = {
  iceServers: [
    {
      urls: "stun:stun.1.google.com:19302"
    }
  ]
};

export const SDP_CONSTRAINTS = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
};
