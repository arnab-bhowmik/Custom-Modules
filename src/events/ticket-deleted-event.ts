import { Subjects } from './subjects';

export interface TicketDeletedEvent {
  subject: Subjects.TicketDeleted;
  data: {
    id:        string;
    version:   number;
    title:     string;
    price:     number;
    userId:    string;
    userEmail: string;
  };
}