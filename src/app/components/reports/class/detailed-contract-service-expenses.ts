import { DetailedContractServiceExpensesItem } from "./detailed-contract-service-expenses-item";

export class DetailedContractServiceExpenses {
    BLOCK_TIME: Array<DetailedContractServiceExpensesItem> = [];
    EXCEEDING: Array<DetailedContractServiceExpensesItem> = [];
    PARTIAL: Array<DetailedContractServiceExpensesItem> = [];
    DEFAULT: Array<DetailedContractServiceExpensesItem> = [];
    startDate: number;
    constructor(data) {
        if (data.BLOCK_TIME) this.BLOCK_TIME = data.BLOCK_TIME.map(item => new DetailedContractServiceExpensesItem(item));
        if (data.EXCEEDING) this.EXCEEDING = data.EXCEEDING.map(item => new DetailedContractServiceExpensesItem(item));
        if (data.PARTIAL) this.PARTIAL = data.PARTIAL.map(item => new DetailedContractServiceExpensesItem(item));
        if (data.DEFAULT) this.DEFAULT = data.DEFAULT.map(item => new DetailedContractServiceExpensesItem(item));
        this.startDate = data.startDate;
    }
}