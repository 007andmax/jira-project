import { ContractItem } from "../../billing/contracts/class/contract-item";
import { DetailContractInterval } from "./detail-contract-interval";
import { PrepaidServiceExpenseDto } from "./prepaid-service-expense-dto";
import * as moment from "moment";

export class DetailContractreport {
    companyId: string;
    agreements: Array<ContractItem> = [];
    intervals: Array<DetailContractInterval> = [];
    isDisabledAgreements: boolean = true;
    selectedAgreement: ContractItem = null;

    interval: string;
    blockRate: number;
    description: string;
    prepaidServiceExpenseDto: Array<PrepaidServiceExpenseDto> = [];
    rateExceeding: number;
    public setDataFromRequest(data) {
        this.interval = data.interval;
        this.blockRate = data.blockRate;
        this.description = data.description;
        this.prepaidServiceExpenseDto = data.prepaidServiceExpenseDto.map(item => new PrepaidServiceExpenseDto(item));
        this.rateExceeding = data.rateExceeding;
    }
    public getMonthInterval(date) {
        return moment(new Date(date)).format('MMMM');
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setIsDisabledAgreements(data) {
        this.isDisabledAgreements = data;
    }
    public setAgreements(data) {
        this.agreements = data;
    }
    public setSelectedAgreement(data) {
        this.selectedAgreement = data;
    }
    public setIntervals(data) {
        this.intervals = data;
    }
    public setInterval(data) {
        this.interval = data;
    }
    public getForRequest() {
        let data: any = {};
        data.agreementId = this.selectedAgreement.id;
        if (this.interval) data.interval = this.interval;
        return data;
    }
}