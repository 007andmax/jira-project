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
    public setLabel(data) {
        this.label = data;
    }
    public setIconName(data) {
        this.iconName = data;
    }
    public update(data) {
        this.agentId = data.agentId;
        this.agentVersion = data.agentVersion;
        this.antivirus = data.antivirus;
        this.createdAt = data.createdAt;
        this.externalIp = data.externalIp;
        this.hostName = data.hostName;
        this.iconName = data.iconName;
        this.id = data.id;
        this.ip = data.ip;
        this.isRegular = data.isRegular;
        this.label = data.label;
        this.master = data.master;
        this.offlineAt = data.offlineAt;
        this.online = data.online;
        this.system = data.system;
        this.type = data.type;
        this.uninstalledAt = data.uninstalledAt;
        this.updatedAt = data.updatedAt;
        this.userName = data.userName;
        this.remoteSessions = data.remoteSessions;
    }
}