export class TimeZoneOffset {
    offset: number;
    cities: Array<String>;
    constructor(offset, cities) {
        this.offset = offset;
        this.cities = cities;
    }
}