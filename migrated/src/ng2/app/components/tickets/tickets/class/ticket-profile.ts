import { TicketProfileShare } from './ticket-profile-share'
import { CurrentUser } from 'src/ng2/class/current-user/current-user'
import { Tag } from 'src/ng2/app/interfaces/tag/tag'

import { TicketProfileAgent } from './ticket-profile-agent';
import { TicketProfileAttachment } from './ticket-profile-attachment';
import { CurrentUserCompany } from 'src/ng2/class/current-user/current-user-company';
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
    updates: Array<TicketProfileUpdate>;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                //  if (this.hasOwnProperty(key)) {
                this[key] = data[key];

                // }
            }
            this.agent = new TicketProfileAgent(data.agent);
            this.assignPerformer = new CurrentUser(data.assignPerformer);
            this.assignedUser = new CurrentUser(data.assignedUser);
            this.attachments = data.attachments.map(item => {
                return new TicketProfileAttachment(item);
            })
            this.createdUser = new CurrentUser(data.createdUser);
            this.multiAssignedUsers = data.multiAssignedUsers.map(item => {
                return new CurrentUser(item);
            })
            this.shares = data.shares.map(item => {
                return new TicketProfileShare(item);
            })
            this.tags = data.tags.map(item => {
                let tag: Tag = {
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

}