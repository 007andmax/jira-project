import { ContractsHourlyService } from './contracts-hourly-service';

export class ContractsBlockTimeDefaultService extends ContractsHourlyService {

    validate:boolean = true;
    validateDuplicated:boolean = true;
}