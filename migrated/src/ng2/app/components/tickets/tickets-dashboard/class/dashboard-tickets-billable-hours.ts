import * as moment from 'moment';
import { DashboardTicketsBillableHoursItem } from './dashboard-tickets-billable-hours-item';

export class DashboardTicketsBillableHours {
    startDate: string;
    endDate: string;
    totalQuantity: number;
    lines: Array<DashboardTicketsBillableHoursItem> = [];
    counters = [];
    constructor() {
        this.startDate = moment(new Date()).format('YYYY-MM-DD');
        this.endDate = moment(new Date()).format('YYYY-MM-DD');
    }
    public getDataForRequest() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
        }
    }
    public onSetDates(value) {
        let startDate = new Date();
        let endDate = new Date();
        if (value === "TODAY") {
            this.startDate = moment(new Date()).format('YYYY-MM-DD');
            this.endDate = moment(new Date()).format('YYYY-MM-DD');
        }
        if (value === "WEEK") {
            startDate = this.getMonday(new Date());
            endDate.setDate(startDate.getDate() + 6);
            this.startDate = moment(startDate).format('YYYY-MM-DD');
            this.endDate = moment(endDate).format('YYYY-MM-DD');
        }
        if (value === "CURRENT_MONTH") {
            startDate.setDate(1);
            let lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
            endDate.setDate(lastDayOfMonth);
            this.startDate = moment(startDate).format('YYYY-MM-DD');
            this.endDate = moment(endDate).format('YYYY-MM-DD');
        }
        if (value === "LAST_MONTH") {
            startDate.setDate(1);
            startDate.setMonth(startDate.getMonth() - 1);
            endDate.setMonth(endDate.getMonth() - 1);
            let lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
            endDate.setDate(lastDayOfMonth);
            this.startDate = moment(startDate).format('YYYY-MM-DD');
            this.endDate = moment(endDate).format('YYYY-MM-DD');
        }
        if (value === "YEAR_TO_DATE") {
            startDate = new Date(startDate.getFullYear(), 0, 1);
            this.startDate = moment(startDate).format('YYYY-MM-DD');
            this.endDate = moment(endDate).format('YYYY-MM-DD');
        }
    }
    private getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }
    public setData(data) {
        this.totalQuantity = data.totalQuantity;
        this.lines = [];
        let maxValue = Math.max.apply(Math, Object.keys(data.lines).map((o) => data.lines[o]));
        Object.keys(data.lines).forEach((item, index) => {
            this.lines.push(new DashboardTicketsBillableHoursItem(item, Math.ceil((data.lines[item]) * 100) / 100, data.lines[item] / maxValue * 100));
        });
        this.counters = [0];
        if (this.lines.length > 0) {
            let count = (maxValue < 10) ? 5 : 10;
            for (let i = 1; i <= count; i++) {
                this.counters.push(Math.round(maxValue / count * i));
            }
        }
    }
}