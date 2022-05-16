export class PaymentsReport {
    startDate: string = '';
    endDate: string = '';
    constructor() { }


    public getForRequest() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
        };
    }
    public setStartDate(startDate) {
        this.startDate = startDate;
    };
    public setEndDate(endDate) {
        this.endDate = endDate;
    };
}