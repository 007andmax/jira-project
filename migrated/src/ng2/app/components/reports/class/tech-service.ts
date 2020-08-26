import { TechServiceItem } from './tech-service-item';

export class TechService {
    startDate: string = '';
    endDate: string = '';
    techUserId: string;
    lines: Array<TechServiceItem> = [];
    totalQuantity: number = 0;
    constructor(data = null) {
        if (data) {
            this.startDate = data.startDate;
            this.endDate = data.startDate;
            this.techUserId = data.techUserId;
            this.lines = data.lines;
            this.totalQuantity = data.totalQuantity;
        }
    }
    public setData (data) {
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.techUserId = data.techUserId;
        this.lines = data.lines.map(item => {
            return new TechServiceItem(item);
        });
        this.totalQuantity = data.totalQuantity;
    }
    public setTechUserId (data) {
        this.techUserId = data;
    }
    public setList(data) {
        this.lines = data.map(item => {
            return new TechServiceItem(item);
        })
    }
    public setTotalQuantity(data) {
        this.totalQuantity = data;
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