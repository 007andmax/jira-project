import { User } from '../../../users/class/user';
import { TicketCreatedUser } from './ticket-created-user';

export class TicketAdd {
    assignedUser: string;
    attachFileIds: Array<string>;
    createdUser: TicketCreatedUser = new TicketCreatedUser();
    linkedAgentId: string;
    note: string;
    priorityLevel: string = 'MEDIUM';
    shares: [{ user: { id: "314c80e3-2316-4c5e-9c85-03c4a2bf4b06" } }]
    subject: string;
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