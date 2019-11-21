export class TimeZoneOffset {
    timeOffset: string;
    name: string;
    displayName:string;
    constructor(timeOffset, name) {
        this.displayName = "";
        this.timeOffset = String(timeOffset);
        this.name = name;
    }
}