import { Product } from 'src/ng2/app/interfaces/product/product';
import { CurrentUserCompany } from 'src/ng2/class/current-user/current-user-company';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';

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
}