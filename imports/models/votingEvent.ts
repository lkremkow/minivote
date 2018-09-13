import { voteSubject } from "./voteSubject";

export interface votingEvent {
  _id?: string,
  public_id: string,
  title: string,
  introduction: string,
  start_time: number,
  end_time: number,
  show_vote_subjects: boolean,
  votes_open: boolean,
  show_final_result: boolean
};