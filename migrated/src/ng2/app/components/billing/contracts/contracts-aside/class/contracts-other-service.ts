export class ContractsOtherService {
    rate:number = 0;
    name: string = "";
    date: number;
    description: string;
    quantity: number;
    serviceId: string;
    validate:boolean = true;
    validateDescription:boolean = true;
    constructor(date, description, quantity, serviceId) {
        this.date = date;
        this.description = description;
        this.quantity = quantity;
        this.serviceId = serviceId;
    }
    public setData (data) {
        this.name = data.name;
        this.description = "";
        this.quantity = 0;
        this.date = new Date().getTime();
        this.serviceId = data.versionedId.id;
        this.validate = true;
        this.rate = data.rate;
    }
    public getDataForCrate() {
        return {
            date: this.date,
            description: this.description,
            quantity: this.quantity,
            serviceId: this.serviceId,
        }
    }
    public resetValidateDescription () {
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