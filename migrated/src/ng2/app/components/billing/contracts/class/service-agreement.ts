import { ContractsHourlyService } from '../contracts-aside/class/contracts-hourly-service';

export class ServiceAgreement {
    amount: number;
    billType: any;
    blockRate: number;
    blockTimeServices: any;
    companyId: string;
    contractWithBlockTime: boolean;
    customBillingDate: any;
    customInterval: any;
    description: string;
    enableTimeRollover: boolean;
    endDate: number;
    glNumber: any;
    id: string;
    includedHours: number;
    interval: String;
    invoiceAsSingleItem: boolean;
    maxRolloverHours: any;
    productExpenses: any;
    rateExceeding: number;
    reviewDate: number;
    serviceContractServices: any;
    serviceContractServicesToTrack: any;
    serviceExpenses: any;
    services: Array<ContractsHourlyService> = [];
    shares: any;
    startDate: number;
    status:string;
    taxIds: Array<String> = [];
    type: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
}