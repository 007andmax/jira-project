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

    /**
 * @description Return Boolean "preloaderDevices"
 * @returns  {Boolean} This is the result
*/
    public getPreloaderDevices() {
        return this.preloaderDevices;
    }
    /**
 * @description Set new value "preloaderDevices"
 * @param {Boolean} data - new value "preloaderDevices"
*/
    public setPreloaderDevices(data) {
        this.preloaderDevices = data;
    }
    /**
 * @description Clear value field "assignedUser"
*/
    public clearAssignedUser() {
        this.assignedUser = null;
    }
    /**
 * @description Clear value field "linkedAgentId"
*/
    public clearDeviceId() {
        this.linkedAgentId = null;
    }
    /**
* @description Set new value field "attachFileIds"
* @param {Array<string>} data - Array Objects String
*/
    public setAttachFileIds(data) {
        this.attachFileIds = data;
    }
    /**
* @description Set new value field "shares"
* @param {Array<User>} users - Array Objects User
*/
    public onAddSharedUsers(users) {
        let selectedusers = users.filter(item => item.selected);
        this.shares = selectedusers.map((item) => {
            return new TicketShareUser(item.id);
        })
    }
    /**
* @description Return Object for request Add Ticket
* @returns  {Object} This is the result
*/
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