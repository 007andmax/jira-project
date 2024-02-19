import { ContractItem } from "../../billing/contracts/class/contract-item";
import { DetailContractInterval } from "./detail-contract-interval";
import { PrepaidServiceExpenseDto } from "./prepaid-service-expense-dto";
import * as moment from "moment";

export class DetailContractreport {
    companyId: string;
    companyName: string;
    type: string;
    agreements: Array<ContractItem> = [];
    intervals: Array<DetailContractInterval> = [];
    isDisabledAgreements: boolean = true;
    isDisabledIntervals: boolean = true;
    selectedAgreement: ContractItem = null;
    intervalAgreement: Array<number> = [];
    interval: string;
    blockRate: number;
    description: string;
    prepaidServiceExpenseDto: Array<PrepaidServiceExpenseDto> = [];
    rateExceeding: number;

    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.agreements = data.agreements.map(item => new ContractItem(item));
            this.intervals = data.intervals.map(item => new DetailContractInterval(item.title, item.startDate, item.endDate));
            this.selectedAgreement = new ContractItem(data.selectedAgreement);
            this.prepaidServiceExpenseDto = data.prepaidServiceExpenseDto.map(item => new PrepaidServiceExpenseDto(item));
        }
    }

    /**
   * @description Set new values fields from request to get report
   * @param {Object} data - new value fields
  */
    public setDataFromRequest(data) {
        this.interval = data.interval;
        this.blockRate = data.blockRate;
        this.description = data.description;
        this.prepaidServiceExpenseDto = data.prepaidServiceExpenseDto.map(item => new PrepaidServiceExpenseDto(item));
        this.rateExceeding = data.rateExceeding;
        this.companyName = data.companyName;
        this.type = data.type;
    }
    /**
   * @description Return parse field "type"
   * @returns {String} This is the result
  */
    public getParseType() {
        return this.type.replace("_", " ").toLocaleLowerCase()
    }
    /**
   * @description Return parse field "intervalAgreement"
   * @returns {Number} This is the result
  */
    public getParseIntervalAgreement(i) {
        return this.intervalAgreement[i] + 1;
    }
    /**
  * @description Return parse field "duration" 
  * @param {Number} quantity - value of "quantity"
  * @returns {String} This is the result
 */
    public getDuration(quantity) {
        var timeInMinutes = quantity * 60,
            hours = Math.floor(timeInMinutes / 60),
            minutes = Math.round(timeInMinutes - (hours * 60));
        return `${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`
    }
    /**
  * @description Return parse field "date" 
  * @param {Number} date - value of Date
  * @returns {String} This is the result
 */
    public getDateInterval(date) {
        return moment(new Date(date)).format('DD MMM YYYY');
    }
    /**
  * @description Set new value filed "companyId"
  * @param {String} data - new value
 */
    public setCompanyId(data) {
        this.companyId = data;
    }
    /**
  * @description Set new value filed "isDisabledAgreements"
  * @param {Boolean} data - new value
 */
    public setIsDisabledAgreements(data) {
        this.isDisabledAgreements = data;
    }
    /**
  * @description Set new value filed "isDisabledIntervals"
  * @param {Boolean} data - new value
 */
    public setIsDisabledIntervals(data) {
        this.isDisabledIntervals = data;
    }
    /**
  * @description Set new value filed "isDisabledIntervals"
  * @param {Array<ContractItem>} data - Array Objects ContractItem
 */
    public setAgreements(data) {
        this.agreements = data;
    }
    /**
 * @description Set new value filed "selectedAgreement"
 * @param {ContractItem} data - Object ContractItem
*/
    public setSelectedAgreement(data) {
        this.selectedAgreement = data;
    }
    /**
 * @description Set new value filed "selectedAgreement"
 * @param {Array<DetailContractInterval>} data - Array Objects DetailContractInterval
*/
    public setIntervals(data) {
        this.intervals = data;
    }
    /**
* @description Set new value filed "intervalAgreement"
* @param {String} data - new value
*/
    public setIntervalAgreement(data) {
        this.intervalAgreement = data;
    }
    /**
* @description Return object for request to get report
* @returns {Object} This is the result
*/
    public getForRequest() {
        let data: any = {};
        data.agreementId = this.selectedAgreement.id;
        if (this.intervalAgreement.length > 0) data.intervals = this.intervalAgreement;
        return data;
    }

    /**
* @description Return object for request to get report
* @returns {Object} This is the result
*/
    public getForExportRequest() {
        console.log("this.selectedAgreement", this.selectedAgreement);
        return { "startDate": moment(this.selectedAgreement.startDate).format('YYYY-MM-DD'), "endDate": moment(this.selectedAgreement.endDate).format('YYYY-MM-DD') };
    }
}