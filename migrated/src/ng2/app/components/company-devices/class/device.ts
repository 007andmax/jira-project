import { DeviceAntivirus } from './device-antivirus';
import { DeviceSystem } from './device-system';

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
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}