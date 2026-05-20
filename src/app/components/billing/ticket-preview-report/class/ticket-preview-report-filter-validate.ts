export class TicketPreviewReportFilterValidate {
    date: boolean = true;

    public setDate(data) {
        this.date = data;
    }
    public getDate() {
        return this.date;
    }
    public isValidate(status, date) {
        if (status.type == "PENDING_REVIEW") this.date = true;
        if (status.type != "PENDING_REVIEW" && !date.dateFrom && !date.dateTo) this.date = false;
        return this.date;
    }

}