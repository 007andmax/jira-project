import { MultiAssignedUsers } from './multi-assigned-users';

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
    priorityLevel: string;
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
        this.priorityLevel = data.priorityLevel;
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
    }
    public setAssignedUserId(id) {
        this.assignedUserId = id;
    }
}