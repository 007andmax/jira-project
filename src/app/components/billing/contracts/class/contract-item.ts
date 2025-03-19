import { ContractItemCompany } from './contract-item-company';

export class ContractItem {
    subtotalExcludingTax: number;
    billType: string;
    companyId: string;
    companyName: string;
    customInterval: any;
    description: string;
    endDate: number;
    id: string;
    includedHours: any;
    interval: string;
    reviewDate: number;
    startDate: number;
    status: string;
    type: string;
    taxSum: number;
    enableInvoiceAutoCreate: boolean;
    manualCreateBillableItem: boolean;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
    /**
  * @description Return parse field "startDate"
  * @returns {Number} This is the result
 */
    public getStartDateByMilliseconds() {
        return new Date(this.startDate).getTime();
    }
    /**
 * @description Return parse field "reviewDate"
 * @returns {Number} This is the result
*/
    public getReviewDateByMilliseconds() {
        return new Date(this.reviewDate).getTime();
    }
    /**
 * @description Return parse field "endDate"
 * @returns {Number} This is the result
*/
    public getEndDateByMilliseconds() {
        return new Date(this.endDate).getTime();
    }
}