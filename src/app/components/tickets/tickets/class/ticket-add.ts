import { TicketsPriority } from 'src/app/components/setting/ticket-settings-page/tickets-priority/class/tickets-priority';
import { User } from '../../../users/class/user';
import { TicketCreatedUser } from './ticket-created-user';
import { TicketShareUser } from './ticket-share-user';

export class TicketAdd {
    assignedUser: string;
    attachFileIds: Array<string>;
    createdUser: TicketCreatedUser = new TicketCreatedUser();
    linkedAgentId: string;
    note: string = "";
    priorityLevel: TicketsPriority = new TicketsPriority();
    shares: Array<TicketShareUser> = [];
    subject: string = '';
    ticketAssignTo: User;
    preloaderDevices: boolean = false;
    constructor() { }
    public getPreloaderDevices() {
        return this.preloaderDevices;
    }
    public setPreloaderDevices(data) {
        this.preloaderDevices = data;
    }
    public clearAssignedUser() {
        this.assignedUser = null;
    }
    public clearDeviceId() {
        this.linkedAgentId = null;
    }
    public setAttachFileIds(data) {
        this.attachFileIds = data;
    }
    public onAddSharedUsers(users) {
        let selectedusers = users.filter(item => item.selected);
        this.shares = selectedusers.map((item) => {
            return new TicketShareUser(item.id);
        })
    }
    public getDataForRequest() {
        return {
            priorityId: this.priorityLevel.id,
            assignedUser: this.assignedUser,
            attachFileIds: this.attachFileIds,
            createdUser: this.createdUser,
            linkedAgentId: this.linkedAgentId,
            note: this.note,
            shares: this.shares,
            subject: this.subject,
            ticketAssignTo: this.ticketAssignTo
        }
    }
}