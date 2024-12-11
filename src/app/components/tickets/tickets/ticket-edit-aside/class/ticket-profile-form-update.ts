import { User } from 'src/app/components/users/class/user';
import { TicketProfileFormProduct } from './ticket-profile-form-product';
import { TicketProfileFormService } from './ticket-profile-form-service';

export class TicketProfileFormUpdate {
    noteType: string = "PUBLIC";
    note: string = "";
    type: string = "NOTE";
    shares = [];
    ticket: any;
    attachFileIds: any = [];
    products: Array<TicketProfileFormProduct> = [];
    services: Array<TicketProfileFormService> = [];
    techUser: User;
    otherRecipients = [];
    constructor() { }
    public setNoteType(data) {
        this.noteType = data;
    }
    public setChatMessage(data) {
        this.note = data;
    }
    public setTechUser(data) {
        this.techUser = data;
    }
    public getTechUser() {
        return this.techUser;
    }
    public getDataForClose() {
        return {
            note: "Ticket has been closed",
            type: "NOTE",
            shares: this.shares,
            ticket: this.ticket,
            attachFileIds: this.attachFileIds
        }
    }
    public getDataForUpdateNote() {
        return {
            noteType: this.noteType,
            note: this.note,
            type: this.type,
            shares: this.shares,
            ticket: this.ticket,
            attachFileIds: this.attachFileIds,
            otherRecipients: this.otherRecipients
        }
    }
    public getDataForUpdateProduct() {
        this.products.forEach(item => (item.user = { id: this.techUser.id }));
        return {
            products: this.products,
            type: this.type,
            shares: this.shares,
            ticket: this.ticket,
            otherRecipients: this.otherRecipients
        }
    }
    public getDataForUpdateService() {
        return {
            services: this.services.map(item => item.getDateForRequest(this.techUser)),
            type: this.type,
            shares: this.shares,
            ticket: this.ticket,
            otherRecipients: this.otherRecipients
        }
    }
    public clearShares() {
        this.shares = [];
    }
    public setType(data) {
        this.type = data;
    }
    public isValidateNote() {
        return this.type === "NOTE";
    }
    public isValidateProduct() {
        return this.type === "PRODUCT" && this.products.length > 0;
    }
    public isValidateService() {
        return this.type === "SERVICE" && this.services.length > 0;
    }
    public isValidateServiceUpdateAndClose() {
        let dateValidate = true;
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
        this.attachFileIds.push(id);
    }
    public removeFile(index) {
        this.attachFileIds.splice(index, 1);
    }
    public clearAttachments() {
        this.attachFileIds = [];
    }
    public setProducts(data) {
        this.products = data;
    }
    public setServices(data) {
        this.services = data;
    }
    public setShares(users) {
        this.shares = [];
        this.shares = users.filter(item => !item.isCustomEmail).map(item => ({ user: { id: item.id } }));
        this.otherRecipients = users.filter(item => item.isCustomEmail).map(item => item.recipient);
    }
    public toggleShares(user) {
        let findIndex = this.shares.findIndex(item => item.user.id === user.id);
        if (findIndex > -1) this.shares.splice(findIndex, 1);
        if (findIndex === -1) this.shares.push({ user: { id: user.id } });
    }
    public checkShares(user) {
        let find = this.shares.find(item => item.user.id === user.id);
        return (find) ? true : false;
    }
}