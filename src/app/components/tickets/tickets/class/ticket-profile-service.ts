import { CurrentUser } from 'src/class/current-user/current-user';
import { CurrentUserCompany } from 'src/class/current-user/current-user-company';
import { Service } from 'src/app/interfaces/service/service';

export class TicketProfileService {
    billable: boolean;
    billableQuantity: number;
    commissionRate: number;
    completed: boolean;
    createdAt: number;
    date: number;
    deletedAt: number;
    description: string;
    discountAmount: number;
    discountSum: number;
    discountType: string;
    durationEnd: number;
    durationStart: number;
    editedExpense: boolean;
    id: string;
    isServiceExpense: boolean;
    item: Service;
    itemCompany: CurrentUserCompany;
    itemOrder: number;
    price: number;
    quantity: number;
    serviceAgreementIdForOtherContracts: string;
    serviceExpense: boolean;
    sum: number;
    taxSum: number;
    taxes: any;
    totalSum: number;
    updatedAt: number;
    user: CurrentUser;
    validateQuantity: boolean = true;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.taxes = this.item.taxes;
        }
    }
    /**
 * @description Set new value "user"
 * @param {CurrentUser} data - Object of Current User
 */
    public setUser(data) {
        this.user = data;
    }
    /**
* @description Set new value "date"
* @param {Number} day - day from DatePicker
* @param {Number} month - month from DatePicker
* @param {Number} year - year from DatePicker
* @param {Number} timeOffset - time offset from Current Tech Company
*/
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
    /**
* @description Set new value "completed"
* @param {Number} day - day from DatePicker
* @param {Number} month - month from DatePicker
* @param {Number} year - year from DatePicker
*/
    public setComplated(day, month, year) {
        let current = new Date();
        let dateDP = new Date(year, month - 1, day);
        if (current.getDate() === dateDP.getDate() && current.getMonth() === dateDP.getMonth() || dateDP.getTime() < current.getTime()) this.completed = true;
        if (dateDP.getTime() > current.getTime()) this.completed = false;
    }
    /**
* @description Set new value "durationStart"
* @param {Number} data - new value "durationStart"
*/
    public setDurationStart(data) {
        this.durationStart = data;
    }
    /**
* @description Set new value "durationEnd"
* @param {Number} data - new value "durationEnd"
*/
    public setDurationEnd(data) {
        this.durationEnd = data;
    }
    /**
* @description Set new value "quantity"
* @param {Number} data - new value "quantity"
*/
    public setQuantity(data) {
        this.quantity = data;
    }
    /**
* @description Set new value "billableQuantity"
* @param {Number} data - new value "billableQuantity"
*/
    public setBillableQuantity(data) {
        this.billableQuantity = data;
    }
    /**
* @description Set new value "completed"
* @param {Boolean} data - new value "completed"
*/
    public setCompleted(data) {
        this.completed = data;
    }
    public calculateQuantity() {
        let durationEnd = JSON.parse(JSON.stringify(this.durationEnd));
        if (this.durationStart - this.durationEnd > 0) durationEnd = this.durationEnd + 24 * 3600000;
        this.quantity = (durationEnd - this.durationStart) / 3600000 > 0 ? (durationEnd - this.durationStart) / 3600000 : 0;
        if (this.quantity > 24) this.quantity -= 24;
        this.setValidateQuantity(true);
    }
    public setValidateQuantity(data) {
        this.validateQuantity = data;
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
    public getDateForUpdate(id) {
        let user = (!this.user) ? { id: "" } : this.user;
        return {
            serviceExpense: {
                completed: this.completed,
                date: this.date,
                description: this.description,
                discountAmount: this.discountAmount,
                discountType: this.discountType,
                durationEnd: this.durationEnd,
                durationStart: this.durationStart,
                id: this.id,
                item: this.item,
                quantity: this.quantity,
                user: user,
                taxes: this.taxes
            },
            ticketUpdateId: id
        }
    }
}