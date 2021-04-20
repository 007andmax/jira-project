import * as moment from "moment";
export class DeviceRemoteSessions {
    startedAt: string;
    id: string;
    agentConnectedAt: number;
    userId: string;
    constructor(data) {
        this.startedAt = data.startedAt;
        this.id = data.id;
        var currentTimeZone = new Date().getTimezoneOffset();
        let minutesDiff = currentTimeZone * 60 * 1000;
        let time = Date.now() + minutesDiff;
        if (moment(data.startedAt).valueOf() > time) {
            this.agentConnectedAt = 0;
        } else {
            this.agentConnectedAt = (time - moment(data.startedAt).valueOf());
        }
        this.userId = data.userId;
    }
}