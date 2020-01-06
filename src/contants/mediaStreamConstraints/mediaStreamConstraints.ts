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
