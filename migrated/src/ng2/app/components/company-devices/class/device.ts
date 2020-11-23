import { DeviceAntivirus } from './device-antivirus';
import { DeviceRemoteSessions } from './device-remote-sessions';
import { DeviceSystem } from './device-system';
import { DeviceTiming } from './device-timing';
import * as moment from "moment";

export class Device {
    agentId: string;
    agentVersion: string;
    antivirus: Array<DeviceAntivirus> = [];
    createdAt: string;
    externalIp: string;
    hostName: string;
    iconName: string;
    id: string;
    ip: string;
    isRegular: true
    label: string;
    master: boolean;
    offlineAt: string;
    online: boolean;
    system: DeviceSystem;
    type: string;
    uninstalledAt: string;
    updatedAt: string;
    userName: string;
    timing: DeviceTiming = new DeviceTiming();
    remoteSessions: Array<DeviceRemoteSessions> = [];
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
        this.remoteSessions = (data.remoteSessions) ? data.remoteSessions.map(item => new DeviceRemoteSessions(item)) : [];
        if (!this.online) {
            var currentTimeZone = new Date().getTimezoneOffset();
            let minutesDiff = currentTimeZone * 60 * 1000;
            let time = Date.now() + minutesDiff;
            this.timing.offline = (time - moment(this.offlineAt).valueOf());
        }
    }
}