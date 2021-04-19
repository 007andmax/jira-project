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
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    public setUser(data) {
        this.user = data;
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
    public setDurationStart(data) {
        this.durationStart = data;
    }
    public setDurationEnd(data) {
        this.durationEnd = data;
    }
    public setQuantity(data) {
        this.quantity = data;
    }
    public setBillableQuantity(data) {
        this.billableQuantity = data;
    }
    public setCompleted(data) {
        this.completed = data;
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
            },
            ticketUpdateId: id
        }
    }
}