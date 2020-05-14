import { Product } from 'src/ng2/app/interfaces/product/product';
import { CurrentUserCompany } from 'src/ng2/class/current-user/current-user-company';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import * as moment from "moment";
export class TicketProfileProduct {
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
    item: Product;
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
              //  if (this.hasOwnProperty(key)) {
                    this[key] = data[key];
                    
               // }
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
     public setCompleted (data) {
        this.completed = data;
    }
    public getDateForUpdate(id) {
        let user = (!this.user) ? {id:""} : this.user;
        return {
            productExpense: {
                completed: this.completed,
                date: this.date,
                discountAmount: this.discountAmount,
                discountType: this.discountType,
                id: this.id,
                item: this.item,
                quantity: this.quantity,
                serialNumber: null,
                user: user,
            },
            ticketUpdateId: id
        }
    }
}