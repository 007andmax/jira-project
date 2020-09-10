import { Service } from 'src/ng2/app/interfaces/service/service';
import { DefaultServicesGlNumber } from './default-service-gl-number';
import { DefaultServicesCompany } from './default-service-company';
import { ServiceAgreement } from 'src/ng2/app/interfaces/service/service-agreement';
import { VersionedId } from 'src/ng2/app/interfaces/versioned-id';

export class DefaultServices implements Service {
    blockTimeServiceAgreement: any;
    canUseInTicket: boolean;
    commissionRate: number;
    createdAt: number;
    deletedAt: number;
    name: string;
    oldVersion: boolean;
    rate: number;
    serviceAgreement: ServiceAgreement;
    serviceContractServiceAgreement: any;
    taxes: import("../../../../interfaces/service/tax").Tax[];
    updatedAt: number;
    versionedId: VersionedId;
    billable: boolean;
    company: DefaultServicesCompany;
    glNumber: DefaultServicesGlNumber;
    isBasedOnDefault: boolean;
    isDefault: boolean;
    isServiceToTrack: boolean;
    isStub: boolean;
    originService: any;
    parentDefaultServiceId: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }

    }
    public onInitForAdd() {
        this.billable = true;
        this.isDefault = true;
        this.name = "";
        this.rate = 0;
        this.taxes = [];
    }
    public getDataForAdd() {
        return {
            billable: this.billable,
            glNumber: this.glNumber,
            isDefault: this.isDefault,
            name: this.name,
            rate: this.rate,
            taxIds: this.taxes.map((item => {
                return item.id;
            }))
        }
    }
    public getDataForUpdate() {
        return {
            id: this.versionedId.id,
            name: this.name,
            rate: this.rate,
            canUseInTicket: this.canUseInTicket,
            billable: this.billable,
            taxIds:  this.taxes.map((item => {
                return item.id;
            })),
            glNumber: this.glNumber,
            isDefault: this.isDefault,
        }
    }
}