export enum OrderStatus {
    Created   = 'Created',     // When Order is created and the corresponding ticket has been successfully reserved. But awaiting payment
    Cancelled = 'Cancelled',   // When Order has been cancelled by the User or the Payment deadline has been exceeded
    Completed = 'Completed'    // When Order is created and the corresponding ticket has been successfully reserved & payment has been completed
}