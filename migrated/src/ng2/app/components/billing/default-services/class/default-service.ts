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
            blockTimeServiceAgreement: this.blockTimeServiceAgreement,
            canUseInTicket: this.canUseInTicket,
            commissionRate: this.commissionRate,
            createdAt: this.createdAt,
            deletedAt: this.deletedAt,
            name: this.name,
            oldVersion: this.oldVersion,
            rate: this.rate,
            serviceAgreement: this.serviceAgreement,
            serviceContractServiceAgreement: this.serviceContractServiceAgreement,
            taxes: this.taxes,
            updatedAt: this.updatedAt,
            versionedId: this.versionedId,
            billable: this.billable,
            company: this.company,
            glNumber: this.glNumber,
            isBasedOnDefault: this.isBasedOnDefault,
            isDefault: this.isDefault,
            isServiceToTrack: this.isServiceToTrack,
            isStub: this.isStub,
            originService: this.originService,
            parentDefaultServiceId: this.parentDefaultServiceId,
            id: this.versionedId.id
        }
    }
}