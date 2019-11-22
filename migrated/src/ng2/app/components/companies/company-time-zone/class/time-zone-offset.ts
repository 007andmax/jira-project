export class TimeZoneOffset {
    timeOffset: string;
    name: string;
    displayName:string;
    constructor(timeOffset, name,zone) {
        this.timeOffset = String(timeOffset);
        this.name = `${zone}/${name}`;
    }
    public setDisplayName(data) {
        this.displayName= data;
    }
}