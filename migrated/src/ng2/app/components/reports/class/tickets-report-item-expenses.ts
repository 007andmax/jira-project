import { Tax } from 'src/ng2/app/interfaces/service/tax';

export class TicketsReportItemExpenses {
    name: string;
    price: number;
    quantity: number;
    totalQuantity: number;
    orderItem: number;
    billable: boolean;
    ilc: string;
    manufacture: string;
    isServiceExpense: boolean;
    taxes: Array<Tax>;
    description:string;
    constructor(data) {
        if (data) {
            this.name = data.name;
            this.price = data.price;
            this.quantity = data.quantity;
            this.totalQuantity = data.totalQuantity;
            this.orderItem = data.orderItem;
            this.billable = data.billable;
            this.ilc = data.ilc;
            this.manufacture = data.manufacture;
            this.isServiceExpense = data.isServiceExpense;
            this.taxes = data.taxes;
            this.description = data.description;
        }
    }
}