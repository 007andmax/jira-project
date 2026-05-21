export class TicketPreviewReportFilterValidate {
    date: boolean = true;

    public setDate(data) {
        this.date = data;
    }
    public getDate() {
        return this.date;
    }
    public isValidate(status, date) {
        if (status.length == 1 && status[0].type == "PENDING_REVIEW") this.date = true;
        if ((status.length == 1 && status[0].type != "PENDING_REVIEW" || status.length > 1) && !date.dateFrom && !date.dateTo) this.date = false;
        return this.date;
    }

}