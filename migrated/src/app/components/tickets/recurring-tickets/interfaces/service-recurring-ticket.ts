import { Service } from 'src/app/interfaces/service/service';

export class ServiceRecurringTicket {
    id: String;
    service: Service;
    duration: number;
    serviceDescription: string;
}