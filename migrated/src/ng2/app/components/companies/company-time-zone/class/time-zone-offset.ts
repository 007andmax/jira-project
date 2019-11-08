export class TimeZoneOffset {
    offset: number;
    city: string;
    constructor(offset, city) {
        this.offset = offset;
        this.city = city;
    }
}