import { User } from '../../../users/class/user';
import { TicketCreatedUser } from './ticket-created-user';
import { TicketShareUser } from './ticket-share-user';

export class TicketAdd {
    assignedUser: string;
    attachFileIds: Array<string>;
    createdUser: TicketCreatedUser = new TicketCreatedUser();
    linkedAgentId: string;
    note: string = "";
    priorityLevel: string = 'MEDIUM';
    shares: Array<TicketShareUser> = [];
    subject: string = '';
    ticketAssignTo: User;
    constructor() {}
    public clearAssignedUser () {
        this.assignedUser = null;
    }
    public clearDeviceId() {
        this.linkedAgentId = null;
    }
    public setAttachFileIds (data){
        this.attachFileIds = data;
    }
}