export const STREAMING_MESSAGE = {
  GOT_USER_MEDIA: "got user media",
  OFFER: "offer",
  ANSWER: "answer",
  CANDIDATE: "candidate",
  BYE: "bye"
};

export type StreamingMessageObject = {
  sdp?: string;
  type: string;
  label?: number | null;
  id?: string | null;
  candidate?: string;
};
