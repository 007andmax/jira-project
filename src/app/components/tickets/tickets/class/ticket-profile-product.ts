import { Product } from 'src/app/interfaces/product/product';
import { CurrentUserCompany } from 'src/class/current-user/current-user-company';
import { CurrentUser } from 'src/class/current-user/current-user';
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
    serialNumber: string;
    valdiateSaleCost: boolean = true;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.item.sale_str = (this.item.sale) ? this.item.sale.toFixed(2) : "0.00";
            this.item.cost_str = (this.item.cost) ? this.item.cost.toFixed(2) : "0.00";
            if (!this.item.taxes) this.item.taxes = [];
        }
    }
    /**
  * @description Set new value "user"
  * @param {CurrentUser} data - Object of CurrentUser
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
  * @param {Boolean} data - new value "completed"
  */
    public setCompleted(data) {
        this.completed = data;
    }
    /**
  * @description Return object for update ticket updates
  * @param {String} id - id ticket updates
  * @returns  {Object} This is the result
  */
    public getDateForUpdate(id) {
        let user = (!this.user) ? { id: "" } : this.user;
        let item = {};
        for (const key in this.item) if (this.item[key] && key !== "taxes") item[key] = this.item[key];
        return {
            productExpense: {
                completed: this.completed,
                date: this.date,
                discountAmount: this.discountAmount,
                discountType: this.discountType,
                id: this.id,
                item: item,
                quantity: this.quantity,
                serialNumber: this.serialNumber,
                user: user,
                taxes: this.taxes
            },
            ticketUpdateId: id
        }
    }
    /**
 * @description Set new value "item" and "itemOrder"
 * @param {Product} data - Obejct of Product
 * @param {Number} index - new value "itemOrder"
 */
    public setData(data, index) {
        this.item = data;
        this.itemOrder = index;
    }
    /**
 * @description Set new value "item.taxes"
 * @param {Product} data - Array Objects of Taxes
 */
    public setTexes(data) {
        this.taxes = data;
    }

}