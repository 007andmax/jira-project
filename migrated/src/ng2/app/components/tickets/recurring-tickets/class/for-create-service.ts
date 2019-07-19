import { VersionedId } from '../../../../interfaces/versioned-id';
import { Service } from 'src/ng2/app/interfaces/service/service';

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
}


