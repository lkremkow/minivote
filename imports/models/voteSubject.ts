export interface voteSubject {
  _id?: string,
  voting_event_id: string,
  question_number: number,
  question_text: string,
  question_instructions: string,
  show_question: boolean,
  show_results: boolean,
  voter_editable: boolean
};