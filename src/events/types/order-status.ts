export enum OrderStatus {
    Created = 'created',                    // When Order is created irrespective of whether the ticket associated with the Order has been reserved or not
    Cancelled = 'cancelled',                // When Order has been cancelled by the User or the Payment deadline has been exceeded
    AwaitingPayment = 'awaiting:payment',   // When Order is created and the corresponding ticket has been successfully reserved. But awaiting payment
    Complete = 'complete'                   // When Order is created and the corresponding ticket has been successfully reserved & payment has been completed
}