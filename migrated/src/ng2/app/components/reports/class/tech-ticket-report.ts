import { TitleListType } from "../../tickets/tickets/tickets-header/class/title-list-type";
import { TechSalesItem } from "./tech-sales-item";
import { TechTicketItem } from "./tech-ticket-item";

export class TechTicketReport {

    durations: Array<TitleListType> = [new TitleListType("Daily", "TODAY"),
    new TitleListType("Week", "WEEK"),
    new TitleListType("Month", "MONTH")];
    lines: Array<TechTicketItem> = [];

    selectedDuration = new TitleListType("Daily", "TODAY");
    startDate: string = '';
    endDate: string = '';
    totalClosed: number;
    totalCreated: number;
    constructor(data = null) {
        if (data) {
            this.lines = data.lines;
            this.selectedDuration = data.selectedDuration;
            this.totalClosed = data.totalClosed;
            this.totalCreated = data.totalCreated;
            this.startDate = data.startDate;
            this.endDate = data.endDate;
        }
    }

    public getForRequest() {
        return {
            dateRangeType: (this.selectedDuration) ? this.selectedDuration.type : "CUSTOM",
            type: "BILLED_TIME",
            endDate: (this.endDate !== '') ? this.endDate : undefined,
            startDate: (this.startDate !== '') ? this.startDate : undefined,
        }
    }
    public setDataFromRequest(data) {
        this.lines = (data.lines) ? data.lines.map(item => new TechTicketItem(item)) : [];
    }

    public setDuration(data) {
        this.selectedDuration = data;
    }
    public setStartDate(startDate) {
        this.startDate = startDate;
    };
    public setEndDate(endDate) {
        this.endDate = endDate;
    };
    public resetDates() {
        this.startDate = '';
        this.endDate = '';
    }
    public resetDuration() {
        this.selectedDuration = null;
    }
    public setDefaultDuration() {
        this.selectedDuration = new TitleListType("Daily", "TODAY");
    }
}