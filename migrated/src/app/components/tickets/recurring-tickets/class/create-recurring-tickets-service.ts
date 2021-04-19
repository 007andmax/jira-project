export class CreateRecurringTicketsService {
    serviceId:string;
    description: string;
    duration: number;
    constructor (serviceId,description,duration) {
        this.serviceId = serviceId;
        this.description = description;
        this.duration = duration;
    }
}