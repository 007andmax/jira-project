import { BillableProfileTicketProductExpense } from './billable-profile-ticket-product-expense';
import { BillableProfileTicketServiceExpense } from './billable-profile-ticket-service-expense';

export class InvoiceProfileTicket {
    id:string;
    closedAt: number;
    discountSum: number;
    number: string;
    productExpenses: Array<BillableProfileTicketProductExpense>;
    productsSum: number;
    serviceExpenses: Array<BillableProfileTicketServiceExpense>;
    servicesSum: number;
    subject: string;
    taxSum: number;
    totalSum: number;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    public getDateForUpdate(ticketUpdateId) {
        let productExpenses = [];
        this.productExpenses.forEach(item => {
            productExpenses.push({
                productExpense: {
                    completed: item.completed,
                    date: item.date,
                    discountAmount: item.discountAmount,
                    discountType: item.discountType,
                    id: item.id,
                    item: item.item,
                    quantity: item.quantity,
                    serialNumber: null,
                    taxes: item.taxes,
                    user: item.user,
                },
                ticketUpdateId: ticketUpdateId
            })
        });

        let serviceExpenses = [];
        this.serviceExpenses.forEach(item => {
            let taxes = item.taxes.map(tax => {
                return {id: tax.id};
            });
            serviceExpenses.push({
                serviceExpense: {
                    completed: item.completed,
                    date: item.date,
                    description: item.description,
                    discountAmount: item.discountAmount,
                    discountType: item.discountType,
                    durationEnd: item.durationEnd,
                    durationStart: item.durationStart,
                    id: item.id,
                    item: item.item,
                    quantity: item.quantity,
                    user: item.user,
                    taxes:taxes
                },
                ticketUpdateId: ticketUpdateId
            })
        });
        return [...productExpenses,...serviceExpenses];
    }
}