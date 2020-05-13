import { Service } from 'src/ng2/app/interfaces/service/service';
import * as moment from "moment";
export class TicketProfileFormService {
    completed: boolean = true;
    date: string = new Date().toISOString();
    description: string
    discountType: "PERCENT"
    durationEnd: number;
    durationStart: number;
    item: Service;
    itemOrder: number;
    quantity: number = 1;

    constructor(data = null) {
        if (data) {
            for (const key in data) {
                //  if (this.hasOwnProperty(key)) {
                this[key] = data[key];

                // }
            }
        } else {
            this.durationStart = new Date().getTime();
            this.durationEnd = new Date().getTime();
        }

    }
    public getDateTime() {
        return new Date(this.date).getTime();
    }
    public setItem(data) {
        this.item = data;
    }
    public setIndexOrder(index) {
        this.itemOrder = index;
    }
    public setDurationStart(data) {
        this.durationStart = data;
    }
    public setDurationEnd(data) {
        this.durationEnd = data;
    }
    public setItemOrder(data) {
        this.itemOrder = data;
    }
    public setDescription(data) {
        this.description = data;
    }
    public setDate(day, month, year, timeOffset) {
        let current = new Date();
        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.date = moment(finalDate).format();
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.date = moment(finalDate).format();
        }
    }
    public calculateQuantity() {
        let durationEnd = 0;
        if (this.durationStart - this.durationEnd > 0) durationEnd = this.durationEnd + 24 * 3600000;
        this.quantity = (durationEnd - this.durationStart) / 3600000 > 0 ? (durationEnd - this.durationStart) / 3600000 : 0;
        if (this.quantity > 24) this.quantity -= 24;
    }
    public setQuantity(data) {
        this.quantity = data;
    }
}