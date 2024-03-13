import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id:         string;
        version:    number;
        userId:     string;
        userEmail:  string;
        status:     OrderStatus;
        expiresAt:  string;
        rzpOrderId: string;
        ticket:     {
            id:         string;
            title:      string;
            price:      number;
            userId:     string;
            userEmail:  string;
            version:    number;
        }
    }
}