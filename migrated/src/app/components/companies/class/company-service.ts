import { Service } from 'src/app/interfaces/service/service';
import { ServiceAgreement } from 'src/app/interfaces/service/service-agreement';
import { Tax } from 'src/app/interfaces/service/tax';
import { VersionedId } from 'src/app/interfaces/versioned-id';
import { Company } from 'src/app/interfaces/quote/company';

export class CompanyService implements Service {
    billable: boolean;
    blockTimeServiceAgreement: any;
    canUseInTicket: boolean;
    commissionRate: number;
    company: Company;
    createdAt: number;
    deletedAt: number;
    isBasedOnDefault: boolean;
    isDefault: boolean;
    isServiceToTrack: boolean;
    isStub: boolean
    name: string;
    oldVersion: boolean;
    originService: any;
    parentDefaultServiceId: any;
    rate: number;
    serviceAgreement: ServiceAgreement;
    serviceContractServiceAgreement: any;
    taxes: Array<Tax>;
    updatedAt: number;
    versionedId: VersionedId;
    constructor() { }


}