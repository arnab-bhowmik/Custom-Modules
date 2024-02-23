import { Subjects } from './subjects';

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    rzpPaymentId: string;
    orderId: string;
    version: number;
  };
}
