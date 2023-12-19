import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfileService } from './ticket-profile-service';
import { TicketProfileProduct } from './ticket-profile-product';
import { TicketProfileShare } from './ticket-profile-share';

export class TicketProfileUpdate {
    attachments: [];
    createdAt: number;
    id: string;
    note: string;
    performerEmail: string;
    products: Array<TicketProfileProduct> = [];
    services: Array<TicketProfileService> = [];
    shares: Array<TicketProfileShare> = [];
    type: string;
    unread: boolean;
    updateSource: string;
    updatedAt: number;
    user: CurrentUser;
    userUpdate: CurrentUser;
    noteType: string;
    otherRecipients: Array<string> = [];
    constructor(data) {
        this.attachments = data.attachments;
        this.createdAt = data.createdAt;
        this.id = data.id;
        this.note = data.note;
        this.products = data.products.map(item => {
            return new TicketProfileProduct(item);
        })
        this.services = data.services.map(item => {
            return new TicketProfileService(item);
        })
        this.shares = data.shares.map(item => {
            return new TicketProfileShare(item);
        });
        this.type = data.type;
        this.unread = data.unread;
        this.updateSource = data.updateSource;
        this.updatedAt = data.updatedAt;
        if (data.user) this.user = new CurrentUser(data.user);
        this.noteType = data.noteType;
        if (this.services.length > 0) this.userUpdate = new CurrentUser(this.services[0].user);
        if (this.products.length > 0) this.userUpdate = new CurrentUser(this.products[0].user);
        this.performerEmail = data.performerEmail;
        this.otherRecipients = data.otherRecipients;
    }
    public setUserUpdate(data) {
        this.userUpdate = data;
    }
}