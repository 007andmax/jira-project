import * as moment from "moment";

export class DetailedContractServiceExpensesItem {
    date: number;
    description: string;
    exceedingQuantity: number;
    name: string;
    quantity: number;
    serviceExpenseDurationEnd: number;
    serviceExpenseDurationStart: number;
    serviceId: string;
    sum: number;
    ticketNumber: string;
    user: string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    public getDurationParticalForBlockTime() {
        return this.getDuration(this.quantity - this.exceedingQuantity);
    }
    public getDuration(quantity) {
        var timeInMinutes = quantity * 60,
            hours = Math.floor(timeInMinutes / 60),
            minutes = Math.round(timeInMinutes - (hours * 60));
        return `${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`
    }
    public getParseDate() {
        let date = new Date(this.date);
        let typeTime = (date.getHours() > 12) ? "PM" : "AM",
            hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours(),
            minutes = (date.getMinutes() > 10) ? date.getMinutes() : "0" + date.getMinutes();

        return `${moment((date) ? new Date(date) : new Date()).format('DD/MM/YYYY')} ${(hours > 10) ? hours : "0" + hours}:${minutes} ${typeTime}`;
    }
}