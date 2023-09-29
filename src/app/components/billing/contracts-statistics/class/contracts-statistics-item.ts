export class ContractStatisticsItem {
    "description": string;
    "interval": string;
    "companyName": string;
    "type": string;
    "quantity": number;
    "quantityLeft": number;
    "quantityUsed": number;
    "otherQuantity": number;
    "quantityExceeding": number;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
    public getDuration(quantity) {
        var timeInMinutes = quantity * 60,
            hours = Math.floor(timeInMinutes / 60),
            minutes = Math.round(timeInMinutes - (hours * 60));
        return `${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`
    }
    public getParseTypeAndInterval() {
        return `${this.type} - ${this.interval}`.replace("_", " ").toLocaleLowerCase()
    }
}