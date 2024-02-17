import { Subjects } from './subjects';

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id:       string;
    version:  number;
    status:    string;
    price:    number;
    userId:   string;
  };
}
