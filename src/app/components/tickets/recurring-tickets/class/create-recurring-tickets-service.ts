export class CreateRecurringTicketsService {
    serviceId: string;
    description: string;
    duration: number;
    discountType: string;
    discountAmount: string;
    constructor(serviceId, description, duration, discountType, discountAmount) {
        this.serviceId = serviceId;
        this.description = description;
        this.duration = duration;
        this.discountType = discountType;
        this.discountAmount = discountAmount;
    }
}