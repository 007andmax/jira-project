import { Service } from 'src/app/interfaces/service/service';
import { NonContractServicesGlNumber } from './non-contract-service-gl-number';
import { NonContractServicesCompany } from './non-contract-service-company';
import { ServiceAgreement } from 'src/app/interfaces/service/service-agreement';
import { VersionedId } from 'src/app/interfaces/versioned-id';

export class NonContractServices implements Service {
    blockTimeServiceAgreement: any;
    canUseInTicket: boolean;
    commissionRate: number;
    createdAt: number;
    deletedAt: number;
    name: string;
    oldVersion: boolean;
    rate: number = 0;
    rate_str: string = "0.00";
    serviceAgreement: ServiceAgreement;
    serviceContractServiceAgreement: any;
    taxes: import("../../../../interfaces/service/tax").Tax[];
    updatedAt: number;
    versionedId: VersionedId;
    billable: boolean;
    company: NonContractServicesCompany;
    glNumber: NonContractServicesGlNumber;
    isBasedOnDefault: boolean;
    isDefault: boolean;
    isServiceToTrack: boolean;
    isStub: boolean;
    originService: any;
    parentDefaultServiceId: string;
    discountType: string;
    discountAmount: number;
    descriptionValidate: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.rate_str = this.rate.toFixed(2);
        }

    }

    public onInitForAdd() {
        this.billable = true;
        this.isDefault = true;
        this.name = "";
        this.rate = 0;
        this.rate_str = "0.00";
        this.taxes = [];
    }

    public getDataForAddDefault() {
        return {
            basedOnDefault: true,
            billable: this.billable,
            isDefault: this.isDefault,
            name: this.name,
            rate: this.rate,
            taxIds: this.taxes.map((item => {
                return item.id;
            }))
        }
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
    public setVersionedId(data) {
        this.versionedId = data;
    }
    public getDataForUpdate() {
        return {
            id: this.versionedId.id,
            name: this.name,
            rate: this.rate,
            canUseInTicket: this.canUseInTicket,
            billable: this.billable,
            taxIds: this.taxes.map((item => {
                return item.id;
            })),
            glNumber: this.glNumber,
            isDefault: this.isDefault,
        }
    }
}