import { DeviceTag } from '../../setting/manage-tags/manage-tags-devices/class/device-tag';
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
    ip: string = "";
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
    tags: Array<DeviceTag> = [];
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
        this.tags = data.tags.map(item => new DeviceTag(item));
    }
    public setTags(data) {
        this.tags = data;
    }
    public setLabel(data) {
        this.label = data;
    }
    public setIconName(data) {
        this.iconName = data;
    }
    getLabelForEdit() {
        if (this.label) return this.label;
        return this.hostName || this.ip;
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