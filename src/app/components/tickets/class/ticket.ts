import { Tag } from 'src/app/interfaces/tag/tag';
import { TicketsPriority } from '../../setting/ticket-settings-page/tickets-priority/class/tickets-priority';
import { MultiAssignedUsers } from './multi-assigned-users';
import * as moment from 'moment';

export class Ticket {
    assignedUserId: string;
    attachmentsCount: number;
    closedAt: number;
    companyId: string;
    createdAt: number;
    createdUserId: string;
    deletedAt: number;
    id: string;
    markedAsSpamAt: boolean;
    multiAssignedUsers: Array<MultiAssignedUsers>;
    number: string;
    previewNote: string;
    priorityLevel: TicketsPriority;
    reportedAsSpamAt: number;
    sourceName: string;
    spamMarkerId: string;
    spamReporterId: string;
    status: string;
    subject: string;
    ticketSource: string;
    trash: boolean;
    unread: boolean;
    userCompanies: Array<string>;
    customStatus: string;
    isCompanyDeleted: boolean;
    selected: boolean = false;
    tags: Array<Tag> = [];
    "totalTimeWorked": number;
    "totalProductsPrice": number;
    "companyServiceType": string;
    updatesCount: number;
    lastUpdatedAt: number;
    lastUpdatedAt_text: string;
    constructor(data) {
        this.assignedUserId = data.assignedUserId;
        this.attachmentsCount = data.attachmentsCount;
        this.closedAt = data.closedAt;
        this.companyId = data.companyId;
        this.createdAt = data.createdAt;
        this.createdUserId = data.createdUserId;
        this.deletedAt = data.deletedAt;
        this.id = data.id;
        this.markedAsSpamAt = data.markedAsSpamAt;
        this.multiAssignedUsers = (data.multiAssignedUsers) ? data.multiAssignedUsers.map(item => {
            return new MultiAssignedUsers(item);
        }) : [];
        this.number = data.number;
        this.previewNote = data.previewNote;
        this.priorityLevel = new TicketsPriority(data.priorityLevel);
        this.reportedAsSpamAt = data.reportedAsSpamAt;
        this.sourceName = data.sourceName;
        this.spamMarkerId = data.spamMarkerId;
        this.spamReporterId = data.spamReporterId;
        this.status = data.status;
        this.subject = data.subject;
        this.ticketSource = data.ticketSource;
        this.trash = data.trash;
        this.unread = data.unread;
        this.userCompanies = data.userCompanies;
        this.customStatus = data.customStatus;
        this.isCompanyDeleted = data.isCompanyDeleted;
        this.tags = data.tags;
        this.totalTimeWorked = data.totalTimeWorked;
        this.totalProductsPrice = data.totalProductsPrice;
        this.companyServiceType = data.companyServiceType;
        this.updatesCount = data.updatesCount;
        this.lastUpdatedAt = data.lastUpdatedAt;
        if (data.lastUpdatedAt) this.lastUpdatedAt_text = new Date().getTime() - data.lastUpdatedAt < 3600000 ? moment(new Date().getTime() - data.lastUpdatedAt).format('m') + " mins ago" : new Date().getTime() - data.lastUpdatedAt < 3600000 * 24 ? moment(new Date().getTime() - data.lastUpdatedAt).format('H') + "h " + moment(new Date().getTime() - data.lastUpdatedAt).format('m') + " mins ago" : moment(new Date().getTime() - data.lastUpdatedAt).format('D') + " days ago";
        if (!data.lastUpdatedAt) this.lastUpdatedAt_text = "N/A";
    }
    public setAssignedUserId(id) {
        this.assignedUserId = id;
    }
    public checkDisableSelect(list) {
        if (this.status == 'IN_PROGRESS' || this.status == 'ON_HOLD' || this.status == null || this.customStatus != null) {
            return (list.length > 0 ? list[0].companyId != this.companyId : false);
        } else {
            return true;
        }
    }
}