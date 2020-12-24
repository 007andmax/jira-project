import { DashboardTechTicketsItem } from './dashboard-tech-tickets-item';
import * as moment from "moment";
import { TitleListType } from '../../tickets/tickets-header/class/title-list-type';
export class DashboardTechTickets {
    startDate: string;
    endDate: string;
    sort: string = "day";
    listTypes: Array<TitleListType> = [new TitleListType("OPEN", "OPEN"), new TitleListType("RT CLOSED", "RECURRING_CLOSED"), new TitleListType("CLOSED", "CLOSED")];
    list: Array<DashboardTechTicketsItem> = [];
    constructor() {

    }
    public onDayDashboard() {
        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(startDate.getDate() + 1);
        this.startDate = moment(startDate).format('YYYY-MM-DD');
        this.endDate = moment(endDate).format('YYYY-MM-DD');
    }
    public onMonthDashboard() {
        let startDate = new Date();
        let endDate = new Date();
        startDate.setDate(1);
        let lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
        endDate.setDate(lastDayOfMonth);
        this.startDate = moment(startDate).format('YYYY-MM-DD');
        this.endDate = moment(endDate).format('YYYY-MM-DD');
    }

    public setData(data) {
        this.list = [];
        for (const type in data) {
            for (const userId in data[type]) {
                let findIndex = this.list.findIndex(item => item.userId === userId);
                if (findIndex > -1) {
                    this.list[findIndex].addValue(type, data[type][userId]);
                } else {
                    this.list.push(new DashboardTechTicketsItem(userId));
                    this.list[this.list.length - 1].addValue(type, data[type][userId]);
                }
            }
        }
        console.log("this.list", this.list);
    }
}