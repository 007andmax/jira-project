export class PasswordRecordLink {
    actionDate: string;
    historyType: string;
    userId: string;
    userName: string;

    deviceId: string;
    deviceLabel: string;
    constructor(data) {
        this.actionDate = data.actionDate;
        this.historyType = data.historyType;
        this.userId = data.userId;
        this.userName = data.userName;

        this.deviceId = data.deviceId;
        this.deviceLabel = data.deviceLabel;
    }
}