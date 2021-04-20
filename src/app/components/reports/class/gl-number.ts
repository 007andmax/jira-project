import { reqGlNumber } from 'src/app/interfaces/reports/req-gl-number';
import { GlNumberItem } from './gl-number-item';
import * as moment from "moment";

export class GlNumber {
    startDate: string = '';
    endDate: string = '';
    clientCompanyId: string;
    monthlyDetailed: boolean = false;
    dates: Array<string> = [];
    list: Array<GlNumberItem> = [];
    response: any;
    constructor() { }

    public setResponse(data) {
        this.response = data;
    }
    public setDataFromObject(data) {
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.clientCompanyId = data.clientCompanyId;
        this.monthlyDetailed = data.monthlyDetailed;
        this.dates = data.dates;
        this.list = data.list;
        this.response = data.response;
    }

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
    public getDataObject() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
            clientCompanyId: this.clientCompanyId,
            monthlyDetailed: this.monthlyDetailed,
            dates: this.dates,
            list: this.list,
            response: this.response
        }
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

    public setDatesForMonthly() {
        let firstDateYear = new Date();
        firstDateYear.setMonth(0);
        firstDateYear.setDate(1);
        this.setStartDate(moment(firstDateYear).format('YYYY/MM/DD'));
        this.setEndDate(moment(new Date()).format('YYYY/MM/DD'));
    }

    public getMonthlyDetailed() {
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