export class TimeZoneOffset {
    offset: number;
    city: string;
    constructor(offset, city) {
        this.offset = Number(offset);
        this.city = city;
    }
}