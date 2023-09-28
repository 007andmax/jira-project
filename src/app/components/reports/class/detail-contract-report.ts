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
    intervalAgreement: string;
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
        this.companyName = data.companyName;
        this.type = data.type;
    }
    public getParseType() {
        return this.type.replace("_", " ").toLocaleLowerCase()
    }
    public getParseIntervalAgreement() {
        return Number(this.intervalAgreement) + 1;
    }
    public getDuration(quantity) {
        var timeInMinutes = quantity * 60,
            hours = Math.floor(timeInMinutes / 60),
            minutes = Math.round(timeInMinutes - (hours * 60));
        return `${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`
    }
    public getDateInterval(date) {
        return moment(new Date(date)).format('DD MMM YYYY');
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setIsDisabledAgreements(data) {
        this.isDisabledAgreements = data;
    }
    public setIsDisabledIntervals(data) {
        this.isDisabledIntervals = data;
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
    public setIntervalAgreement(data) {
        this.intervalAgreement = data;
    }
    public getForRequest() {
        let data: any = {};
        data.agreementId = this.selectedAgreement.id;
        if (this.intervalAgreement) data.interval = this.intervalAgreement;
        return data;
    }
}