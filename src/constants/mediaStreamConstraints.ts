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

type PcConfigType = {
  iceServers: Array<{
    urls: string;
    credential?: string;
  }>;
};

export const PC_CONFIG: PcConfigType = {
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

export const TURN_URL =
  "https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913";
