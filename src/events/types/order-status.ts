export enum OrderStatus {
    Created = 'created',                    // When Order is created but the ticket associated with the Order has not been reserved
    Cancelled = 'cancelled',                // When Order has been cancelled by the User, or the Ticket it is trying to reserve is already reserved, or the Payment deadline has been exceeded
    AwaitingPayment = 'awaiting:payment',   // When Order is created and the corresponding ticket has been successfully reserved
    Complete = 'complete'                   // When Order is created and the corresponding ticket has been successfully reserved & payment has been completed
}