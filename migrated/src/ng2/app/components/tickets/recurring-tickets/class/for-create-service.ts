import { VersionedId } from '../../../../interfaces/versioned-id';
import { Service } from 'src/ng2/app/interfaces/service/service';
import { ServiceRecurringTicket } from '../interfaces/service-recurring-ticket';

export class ForCreateService implements Service {
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
    description: string = '';
    quantity: number;
    duration: number;
    noValid: boolean = false;
    errors: Array<String>;
    constructor(data = null) {
        if (!data) return;
        this.blockTimeServiceAgreement = data.blockTimeServiceAgreement;
        this.canUseInTicket = data.canUseInTicket;
        this.commissionRate = data.commissionRate;
        this.createdAt = data.createdAt;
        this.deletedAt = data.deletedAt;
        this.name = data.name;
        this.oldVersion = data.oldVersion;
        this.rate = data.rate;
        this.serviceAgreement = data.serviceAgreement;
        this.serviceContractServiceAgreement = data.serviceContractServiceAgreement;
        this.taxes = data.taxes;
        this.updatedAt = data.updatedAt;
        this.versionedId = data.versionedId;
        this.description = data.description;
        this.quantity = data.quantity;
        this.duration = data.duration;

    }
    public setDescription (description) {
        this.description = description;
    }
    public onInitCopyCrete(data) {
        this.description = data.serviceDescription;
        //   this.duration = data.duration;
    }
    public setName(name) {
        this.name = name;
    }
    public setVersionedId(versionedId) {
        this.versionedId = versionedId;
    }
    public setDuration (data) {
        this.duration = data;
    }
    public setDataFromEdit(data: ServiceRecurringTicket, errors: Array<String>) {
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
        if (errors.length > 0) {
            this.errors = errors;
            this.noValid = true;
        }
    }
}


