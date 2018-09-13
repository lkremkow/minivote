import {lfkAttendee} from './lfkAttendee';

export interface lfkEvent {
  _id?: string,
  title: string,
  description: string,
  location: string,
  latitude: number,
  longitude: number,
  date: string,
  start_time: string,
  end_time: string,
  attendees?: lfkAttendee[]
};