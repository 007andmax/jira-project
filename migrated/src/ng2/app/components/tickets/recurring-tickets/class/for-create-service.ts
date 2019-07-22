import { VersionedId } from '../../../../interfaces/versioned-id';
import { Service } from 'src/ng2/app/interfaces/service/service';
import { ServiceRecurringTicket } from '../interfaces/service-recurring-ticket';

export class ForCreateService implements Service  {
    blockTimeServiceAgreement: any;
    canUseInTicket: boolean;
    commissionRate: number;
    createdAt: number;
    deletedAt: any;
    name: string;
    oldVersion: boolean;
    rate: number;
    serviceAgreement: any;
    serviceContractServiceAgreement: any;
    taxes: any;
    updatedAt: any;
    versionedId: VersionedId;
    description:string = '';
    quantity:number;
    duration:number;
    isDropDownShowServices:boolean = false;
    constructor () {}

    public setDataFromEdit (data:ServiceRecurringTicket) {
        this.duration = data.duration;
        this.description = data.serviceDescription;
        this.blockTimeServiceAgreement = data.service.blockTimeServiceAgreement;
        this.canUseInTicket = data.service.canUseInTicket;
        this.commissionRate = data.service.commissionRate;
        this.createdAt = data.service.createdAt;
        this.deletedAt = data.service.deletedAt;
        this.name = data.service.name;
        this.oldVersion = data.service.oldVersion;
        this.rate = data.service.rate;
        this.serviceAgreement = data.service.serviceAgreement;
        this.serviceContractServiceAgreement = data.service.serviceContractServiceAgreement;
        this.taxes = data.service.taxes;
        this.updatedAt = data.service.updatedAt;
        this.versionedId = data.service.versionedId;
    }
}


