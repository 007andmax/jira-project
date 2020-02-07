import { reqGlNumber } from 'src/ng2/app/interfaces/reports/req-gl-number';
import { GlNumberItem } from './gl-number-item';

export class GlNumber {
    startDate: string = '';
    endDate: string = '';
    clientCompanyId: string;
    monthlyDetailed: boolean = false;
    dates: Array<string> = [];
    list: Array<GlNumberItem> = [];
    constructor() { }

    public clearDates() {
        this.dates = [];
    }
    public clearList() {
        this.list = [];
    }

    public resetDates() {
        this.startDate = '';
        this.endDate = '';
    }


    public getList() {
        return this.list;
    }
    public getDate() {
        return this.dates;
    }
    public addDate(data) {
        this.dates.push(data);
    }
    public addItem(data) {
        this.list.push(data);
    }
    public getForRequest() {
        let data: reqGlNumber = {
            startDate: this.startDate,
            endDate: this.endDate,
            clientCompanyId: this.clientCompanyId,
            monthlyDetailed: this.monthlyDetailed,
        }
        return data;

    }

    public  getMonthlyDetailed () {
        return this.monthlyDetailed;
    }

    public setStartDate(startDate) {
        this.startDate = startDate;
    };
    public setEndDate(endDate) {
        this.endDate = endDate;
    };
    public setClientCompanyId(clientCompanyId) {
        this.clientCompanyId = clientCompanyId;
    };
    public setMonthlyDetailed(monthlyDetailed) {
        this.monthlyDetailed = monthlyDetailed;
    };

}