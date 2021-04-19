import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfileService } from './ticket-profile-service';
import { TicketProfileProduct } from './ticket-profile-product';
import { TicketProfileShare } from './ticket-profile-share';

export class TicketProfileUpdate {
    attachments: [];
    createdAt: number;
    createdByEmail: string;
    id: string;
    note: string;
    notifyTicketCreator: boolean;
    products: Array<TicketProfileProduct> = [];
    services: Array<TicketProfileService> = [];
    shares: Array<TicketProfileShare> = [];
    type: string;
    unread: boolean;
    updateSource: string;
    updatedAt: number;
    user: CurrentUser;
    constructor(data) {
        this.attachments = data.attachments;
        this.createdAt = data.createdAt;
        this.createdByEmail = data.createdByEmail;
        this.id = data.id;
        this.note = data.note;
        this.notifyTicketCreator = data.notifyTicketCreator;
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
        this.user = new CurrentUser(data.user);
    }
}