export class DocumentHistory {
    actionDate: string;
    historyType: string;
    userId: string;
    userName: string;
    constructor(data) {
        this.actionDate = data.actionDate;
        this.historyType = data.historyType;
        this.userId = data.userId;
        this.userName = data.userName;
    }
}