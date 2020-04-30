import { TicketProfileFormProduct } from './ticket-profile-form-product';

export class TicketProfileFormUpdate {
    note: string = "";
    type: string = "NOTE";
    shares = [];
    ticket: any;
    attachments: any = [];
    products: Array<TicketProfileFormProduct> = [];
    constructor() { }
    public setChatMessage(data) {
        this.note = data;
    }
    public getDataForUpdateNote() {
        return {
            note: this.note,
            type: this.type,
            shares: this.shares,
            ticket: this.ticket,
            attachments: this.attachments
        }
    }
    public getDataForUpdateProduct() {
        return {
            products: this.products,
            type: this.type,
            shares: this.shares,
            ticket: this.ticket,

        }
    }
    public setType(data) {
        this.type = data;
    }
    public isValidateNote() {
        return this.type === "NOTE" && this.note.length > 0;
    }
    public isValidateProduct() {
        return this.type === "PRODUCT" && this.products.length > 0;
    }
    public setTicketId(id) {
        this.ticket = { id: id };
    }
    public addFile(id) {
        this.attachments.push({ file: { id: id } });
    }
    public removeFile(index) {
        this.attachments.splice(index, 1);
    }
    public setProducts(data) {
        this.products = data;
    }
}