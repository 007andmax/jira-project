import { TimeZoneOffset } from './time-zone-offset';

export class TimeZone {
    zone: string;
    offsets: Array<TimeZoneOffset> = [];
    constructor(zone, offsets) {
        this.zone = zone;
        for (var prop in offsets) {
            offsets[prop].forEach(element => {
                this.offsets.push(new TimeZoneOffset(prop, element,zone));
            });
           
        }
    }
}