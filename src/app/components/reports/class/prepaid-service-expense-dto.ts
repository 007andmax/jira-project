import { DetailedContractServiceExpenses } from "./detailed-contract-service-expenses";

export class PrepaidServiceExpenseDto {
    endDate: number;
    quantity: number;
    quantityExceeding: number;
    quantityLeft: number;
    serviceExpenses: DetailedContractServiceExpenses;
    startDate: number;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
        this.serviceExpenses = new DetailedContractServiceExpenses(data.serviceExpenses);
    }
}