export enum OrderStatus {
    Created   = 'created',     // When Order is created and the corresponding ticket has been successfully reserved. But awaiting payment
    Cancelled = 'cancelled',   // When Order has been cancelled by the User or the Payment deadline has been exceeded
    Completed = 'completed'    // When Order is created and the corresponding ticket has been successfully reserved & payment has been completed
}