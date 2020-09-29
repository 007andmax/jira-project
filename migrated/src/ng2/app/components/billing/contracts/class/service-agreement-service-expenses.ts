export class ServiceAgreementServiceExpenses {
    date: number;
    description: string;
    quantity: number;
    serviceExpenseDurationEnd: number;
    serviceExpenseDurationStart: number;
    serviceId: string;
    constructor(data) {
        this.date = data.date;
        this.description = data.description;
        this.quantity = data.quantity;
        this.serviceExpenseDurationEnd = data.serviceExpenseDurationEnd;
        this.serviceExpenseDurationStart = data.serviceExpenseDurationStart;
        this.serviceId = data.serviceId;
    }
}