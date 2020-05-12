import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { CurrentUserCompany } from 'src/ng2/class/current-user/current-user-company';
import { Service } from 'src/ng2/app/interfaces/service/service';

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
                //  if (this.hasOwnProperty(key)) {
                this[key] = data[key];

                // }
            }
        }
    }
    public setUser(data) {
        this.user = data;
    }
    public setDate(data) {
        this.date = data;
    }
    public setCompleted (data) {
        this.completed = data;
    }
    public getDateForUpdate(id) {
        let user = (!this.user) ? {id:""} : this.user;
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