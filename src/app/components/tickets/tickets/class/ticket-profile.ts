import { TicketProfileShare } from './ticket-profile-share'
import { CurrentUser } from 'src/class/current-user/current-user'
import { Tag } from 'src/app/interfaces/tag/tag'

import { TicketProfileAgent } from './ticket-profile-agent';
import { TicketProfileAttachment } from './ticket-profile-attachment';
import { CurrentUserCompany } from 'src/class/current-user/current-user-company';
import { TicketProfileUpdate } from './ticket-profile-update';

export class TicketProfile {
    agent: TicketProfileAgent;
    assignPerformer: CurrentUser;
    assignedAt: number;
    assignedUser: CurrentUser;
    assignedUserId: string;
    attachments: Array<TicketProfileAttachment> = [];
    billable: false;
    closedAt: number;
    closedBy: number;
    company: CurrentUserCompany;
    companyId: string;
    createdAt: number;
    createdUser: CurrentUser;
    createdUserId: string;
    deletePerformer: any;
    deletedAt: number;
    hasAttachments: boolean;
    hasInvoice: boolean;
    hasNewUpdates: boolean;
    hashSum: any;
    id: string;
    isBillable: boolean;
    isReassigned: boolean;
    markedAsSpamAt: any;
    multiAssignedUsers: Array<CurrentUser> = [];
    note: string;
    number: string;
    order: boolean;
    previewNote: string;
    priorityLevel: string;
    reassigned: boolean;
    reportedAsSpamAt: any;
    sharedToCurrentUserAt: any;
    shares: Array<TicketProfileShare> = [];
    sourceName: string;
    spamMarker: any;
    spamReporter: any;
    status: string;
    subject: string;
    tags: Array<Tag> = [];
    ticketSource: string;
    trash: boolean;
    unloadedUpdates: number;
    unread: boolean;
    updates: Array<TicketProfileUpdate> = [];
    userCompanies: Array<string> = [];
    customStatus: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.agent = new TicketProfileAgent(data.agent);
            this.assignPerformer = new CurrentUser(data.assignPerformer);
            this.assignedUser = (data.assignedUser) ? new CurrentUser(data.assignedUser) : null;
            this.attachments = data.attachments.map(item => {
                return new TicketProfileAttachment(item);
            })
            this.createdUser = (data.createdUser) ? new CurrentUser(data.createdUser) : null;
            this.multiAssignedUsers = data.multiAssignedUsers.map(item => {
                return new CurrentUser(item);
            })
            this.shares = data.shares.map(item => {
                return new TicketProfileShare(item);
            })
            this.tags = data.tags.map(item => {
                let tag: any = {
                    colorCode: item.colorCode,
                    usedCounter: item.usedCounter,
                    word: item.word,
                    id: item.id
                }
                return tag;
            })
            this.updates = data.updates.map(item => {
                return new TicketProfileUpdate(item);
            })
        }
    }
    public setUserCompanies(data) {
        this.userCompanies = data;
    }
    public addAttachment(data) {
        this.attachments.push(new TicketProfileAttachment(data));
    }
    public addUpdate(data) {
        this.updates.unshift(new TicketProfileUpdate(data));
    }
    public removeUpdate(data) {
        let index = this.updates.findIndex(item => item.id === data.id);
        if (index > -1) this.updates.splice(index, 1);
    }
    public setUpdate(data) {
        let index = this.updates.findIndex(item => item.id === data.id);
        if (index > -1) this.updates[index] = new TicketProfileUpdate(data);
    }
    public update(data) {
        for (const key in data) {
            this[key] = data[key];
        }
        if (data.agent) this.agent = new TicketProfileAgent(data.agent);
        if (data.assignPerformer) this.assignPerformer = new CurrentUser(data.assignPerformer);
        this.assignedUser = (data.assignedUser) ? new CurrentUser(data.assignedUser) : null;
        if (data.attachments) this.attachments = data.attachments.map(item => {
            return new TicketProfileAttachment(item);
        })
        if (data.createdUser) this.createdUser = new CurrentUser(data.createdUser);
        if (data.multiAssignedUsers) this.multiAssignedUsers = data.multiAssignedUsers.map(item => {
            return new CurrentUser(item);
        })
        if (data.shares) this.shares = data.shares.map(item => {
            return new TicketProfileShare(item);
        })
        if (data.tags) this.tags = data.tags.map(item => {
            let tag: any = {
                colorCode: item.colorCode,
                usedCounter: item.usedCounter,
                word: item.word,
                id: item.id
            }
            return tag;
        })
        if (data.updates) this.updates = data.updates.map(item => {
            return new TicketProfileUpdate(item);
        })
    }

}