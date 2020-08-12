export class TechService {
    startDate: string = '';
    endDate: string = '';
    techUserId:string;
    constructor() { }
    public setTechUserId (data) {
        this.techUserId = data;
    }
    public getForRequest() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
            techUserId: this.techUserId,
        };
    }
    public resetDates() {
        this.startDate = '';
        this.endDate = '';
    }
    public setStartDate(startDate) {
        this.startDate = startDate;
    };
    public setEndDate(endDate) {
        this.endDate = endDate;
    };
}