import { voteSubject } from "./voteSubject";

export interface votingEvent {
  _id?: string,
  public_id: string,
  title: string,
  introduction: string,
  start_time: number,
  end_time: number,
  vote_subjects?: voteSubject[],
};