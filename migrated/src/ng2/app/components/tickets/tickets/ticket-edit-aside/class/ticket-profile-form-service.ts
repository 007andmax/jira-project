import { Service } from 'src/ng2/app/interfaces/service/service';

export class TicketProfileFormService {
    completed: boolean = true;
    date: number = new Date().getTime();
    description: string
    discountType: "PERCENT"
    durationEnd: number;
    durationStart: number;
    item: Service;
    itemOrder: number;
    quantity: number = 0;

    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        } else {
            let currentDate = new Date();
            this.durationStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes()).getTime();
            this.durationEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes()).getTime();
        }

    }
    public getDateTime() {
        return new Date(this.date).getTime();
    }
    public getDateTimeWithTimeOffset(currentCompany) {
        // getting milliseconds of a date, after calculating timeOffSet of the tech user and timeOffset of the technical company
        let currentTimeOffset = new Date().getTimezoneOffset() * 60000;
        currentTimeOffset = (currentTimeOffset < 0) ? -currentTimeOffset : currentTimeOffset;
        let companyTimeOffset = currentCompany.addresses[0].timeZone.timeOffset;
        companyTimeOffset = (companyTimeOffset < 0) ? -companyTimeOffset : companyTimeOffset;
        let timeOffset = (currentTimeOffset > companyTimeOffset) ? currentTimeOffset - companyTimeOffset : companyTimeOffset - currentTimeOffset;
        return new Date(this.date).getTime() + timeOffset;
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
            this.date = finalDate.getTime();
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.date = finalDate.getTime();
        }
    }
    public setComplated(day, month, year) {
        let current = new Date();
        let dateDP = new Date(year, month - 1, day);
        if (current.getDate() === dateDP.getDate() && current.getMonth() === dateDP.getMonth() || dateDP.getTime() < current.getTime()) this.completed = true;
        if (dateDP.getTime() > current.getTime()) this.completed = false;
    }
    public calculateQuantity() {
        let durationEnd = JSON.parse(JSON.stringify(this.durationEnd));
        if (this.durationStart - this.durationEnd > 0) durationEnd = this.durationEnd + 24 * 3600000;
        this.quantity = (durationEnd - this.durationStart) / 3600000 > 0 ? (durationEnd - this.durationStart) / 3600000 : 0;
        if (this.quantity > 24) this.quantity -= 24;
    }
    public setQuantity(data) {
        this.quantity = data;
    }
}