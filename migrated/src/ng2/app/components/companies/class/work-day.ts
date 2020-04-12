export class WorkDay {
    dayOfWeek: string;
    endTime: number;
    startTime: number;
    constructor (dayOfWeek,startTime,endTime) {
        this.dayOfWeek = dayOfWeek;
        this.endTime = startTime;
        this.startTime = endTime;
    }
}