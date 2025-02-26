export class CreateRecurringTicketsService {
    serviceId: string;
    description: string;
    duration: number;
    discount: number;
    constructor(serviceId, description, duration, discountAmount) {
        this.serviceId = serviceId;
        this.description = description;
        this.duration = duration;
        this.discount = discountAmount;
    }
}