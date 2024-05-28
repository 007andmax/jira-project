import { Product } from 'src/app/interfaces/product/product';
import { TicketProfileFormItemProduct } from './ticket-profile-form-item-product';
import { Tax } from 'src/class/taxes/tax';

export class TicketProfileFormProduct {
    item: TicketProfileFormItemProduct = new TicketProfileFormItemProduct();
    itemOrder: number;
    quantity: number = 1;
    serialNumber: string;
    discountAmount: number;
    discountType: string = "PERCENT";
    completed: boolean = true;
    valdiateSaleCost: boolean = true;
    taxes: Array<Tax> = [];
    user: any;
    date: number = new Date().getTime();
    constructor(data = null) {
        if (data) {
            this.item = new TicketProfileFormItemProduct(data.item);
            this.itemOrder = data.itemOrder;
            this.quantity = data.quantity;
            this.serialNumber = data.serialNumber;
            this.discountAmount = data.discountAmount;
            this.discountType = data.discountType;
            this.completed = data.completed;
            this.valdiateSaleCost = data.valdiateSaleCost;
            let taxes = [...data.taxes, ...this.item.taxes];
            taxes = taxes.filter((item, pos) => taxes.findIndex(accountItem => accountItem.id == item.id) == pos);
            this.taxes = taxes;
        }
    }
    public getDataForAdd() {
        let item = {};
        for (const key in this.item) if (this.item[key] != null && this.item[key] != undefined && key !== "taxes") item[key] = this.item[key];
        let taxes = this.taxes.map(item => ({
            id: item.id,
            name: item.name,
            rate: item.rate,
        }));
        return {
            item: item,
            itemOrder: this.itemOrder,
            quantity: this.quantity,
            serialNumber: this.serialNumber,
            discountAmount: this.discountAmount,
            discountType: this.discountType,
            completed: this.completed,
            taxes: taxes,
            date: this.date
        }
    }
    public setTexes(data) {
        this.taxes = data;
    }
    public setData(data, index) {
        this.item = new TicketProfileFormItemProduct(data);
        this.itemOrder = index;
        this.taxes = [...this.item.taxes];
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
    public setItemOrder(data) {
        this.itemOrder = data;
    }
}