export interface votableItem {
  _id?: string,
  vote_subject_id: string,
  title: string,
  description: string,
  author: string,
  vote_score: number,
  modified_on: number
};