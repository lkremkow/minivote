export interface vote {
  _id?: string,
  voter_id: number,
  votable_item_id: string,
  vote: number,
  time_cast: Date
};