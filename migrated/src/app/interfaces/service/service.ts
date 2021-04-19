import { Tax } from './tax';
import { VersionedId } from '../versioned-id';
import { ServiceAgreement } from './service-agreement';

export interface Service {
    blockTimeServiceAgreement: any;
    canUseInTicket: boolean;
    commissionRate: number;
    createdAt: number;
    deletedAt: number
    name: string;
    oldVersion: boolean;
    rate: number;
    serviceAgreement: ServiceAgreement;
    serviceContractServiceAgreement: any;
    taxes: Array<Tax>;
    updatedAt: number
    versionedId: VersionedId;
}