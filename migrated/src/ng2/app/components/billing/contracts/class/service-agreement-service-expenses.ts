export class ServiceAgreementServiceExpenses {
    rate: number = 0;
    date: number;
    description: string;
    quantity: number;
    serviceExpenseDurationEnd: number;
    serviceExpenseDurationStart: number;
    serviceId: string;
    name: string;
    validate: boolean = true;
    validateDescription: boolean = true;
    constructor(data) {
        this.date = data.date;
        this.description = data.description;
        this.quantity = data.quantity;
        this.serviceExpenseDurationEnd = data.serviceExpenseDurationEnd;
        this.serviceExpenseDurationStart = data.serviceExpenseDurationStart;
        this.serviceId = data.serviceId;
        this.name = data.name;
    }
    public getDataForUpdate() {
        return {
            date: this.date,
            description: this.description,
            quantity: this.quantity,
            serviceExpenseDurationEnd: null,
            serviceExpenseDurationStart: null,
            serviceId: this.serviceId,
        }
    }
    public setData(data) {
        if (data) {
            this.name = data.name;
            this.description = "";
            this.serviceId = data.versionedId.id;
            this.rate = data.rate;
        } else {
            this.name = "";
            this.description = "";
            this.serviceId = "";
            this.rate = 0;
        }


        this.validate = true;
        this.quantity = 0;
        this.date = new Date().getTime();
    }

    public resetValidateDescription() {
        this.validateDescription = true;
    }
    public setQuantity(data) {
        this.quantity = data;
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
}