export interface voter {
  _id?: string,
  voter_id: number,
  secret?: string,
  alias?: string,
  title?: string,
  unique_session_id?: number,
  expires?: number
};