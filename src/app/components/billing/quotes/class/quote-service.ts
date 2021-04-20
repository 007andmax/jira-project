import { Service } from 'src/app/interfaces/service/service';
import { ServiceAgreement } from 'src/app/interfaces/service/service-agreement';
import { Tax } from 'src/app/interfaces/service/tax';
import { VersionedId } from 'src/app/interfaces/versioned-id';
import { GlNumber } from 'src/class/gl-number/gl-number';

export class QuoteService implements Service {
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
    taxes: Tax[];
    updatedAt: number;
    versionedId: VersionedId;
    billable: boolean;
    billableQuantity: number;
    description: string;
    discountAmount: number;
    discountSum: number;
    discountType: string;
    editedExpense: boolean;
    glNumber: GlNumber;
    isDefault: boolean;
    itemOrder: number;
    quantity: number;
    serviceExpense: boolean;
    sum: number;
    taxSum: number;
    totalSum: number;

    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }

    }
    public getDataForUpdate() {
        let service: Service = {
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
            versionedId: this.versionedId
        }
        return {
            description: this.description,
            discountType: this.discountType,
            item: service,
            itemOrder: this.itemOrder,
            quantity: this.quantity
        }
    }

}