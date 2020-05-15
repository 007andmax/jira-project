import { TicketProfileFormProduct } from './ticket-profile-form-product';
import { TicketProfileFormService } from './ticket-profile-form-service';

export class TicketProfileFormUpdate {
    note: string = "";
    type: string = "NOTE";
    shares = [];
    ticket: any;
    attachments: any = [];
    products: Array<TicketProfileFormProduct> = [];
    services: Array<TicketProfileFormService> = [];
    constructor() { }
    public setChatMessage(data) {
        this.note = data;
    }
    public getDataForClose() {
        return {
            note: "Ticket has been closed",
            type: "NOTE",
            shares: this.shares,
            ticket: this.ticket,
            attachments: this.attachments
        }
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
    public getDataForUpdateService() {
        return {
            services: this.services,
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
    public isValidateService() {
        return this.type === "SERVICE" && this.services.length > 0;
    }
    public isValidateServiceUpdateAndClose() {
        let dateValidate  = true;
        let currentDate = new Date().getTime();
        this.services.forEach(item => {
            if (item.date > currentDate) dateValidate = false;
        }) 
        return this.type === "SERVICE" && this.services.length > 0 && dateValidate;
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
    public setServices(data) {
        this.services = data;
    }
}