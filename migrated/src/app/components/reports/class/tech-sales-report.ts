import { TitleListType } from "../../tickets/tickets/tickets-header/class/title-list-type";
import { TechSalesItem } from "./tech-sales-item";

export class TechSalesReport {
    types: Array<TitleListType> = [new TitleListType("Billed time", "BILLED_TIME"),
    new TitleListType("Product sold", "PRODUCT_SOLD")];
    durations: Array<TitleListType> = [new TitleListType("Daily", "TODAY"),
    new TitleListType("Week", "WEEK"),
    new TitleListType("Month", "MONTH")];
    lines: Array<TechSalesItem> = [];
    selectedType = new TitleListType("Billed time", "BILLED_TIME");
    selectedDuration = new TitleListType("Daily", "TODAY");
    startDate: string = '';
    endDate: string = '';
    isDisabledDuration: boolean = false;
    constructor(data = null) {
        if (data) {
            this.lines = data.lines;
            this.selectedType = data.selectedType;
            this.selectedDuration = data.selectedDuration;

            this.startDate = data.startDate;
            this.endDate = data.endDate;
        }
    }
    public setDisabledDuration(data) {
        this.isDisabledDuration = data;
    }
    public getForRequest() {
        return {
            dateRangeType: (this.selectedDuration) ? this.selectedDuration.type : "CUSTOM",
            type: this.selectedType.type,
            endDate: (this.endDate !== '') ? this.endDate : undefined,
            startDate: (this.startDate !== '') ? this.startDate : undefined,
        }
    }
    public setDataFromRequest(data) {
        this.lines = (data.lines) ? data.lines.map(item => new TechSalesItem(item)) : [];
    }
    public setType(data) {
        this.selectedType = data;
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