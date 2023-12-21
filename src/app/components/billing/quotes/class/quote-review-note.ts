import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfileUpdate } from '../../../tickets/tickets/class/ticket-profile-update';

export class QuoteReviewNotes extends TicketProfileUpdate {
    public getUserNames() {
        return `${this.user.firstName} ${this.user.lastName}`;
    }
    public getTextSentFrom() {
        return `Sent from - ${this.user ? this.getUserNames() + ',' + this.user.primaryEmail : this.performerEmail}`
    }
}