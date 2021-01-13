import { CurrentUser } from "src/ng2/class/current-user/current-user";
import { DefaultServicesCompany } from "../../billing/default-services/class/default-service-company";
import { RemoteSessionClientUser } from "./remote-sessions-client-user";

export class RemoteSession {
    clientCompany: DefaultServicesCompany;
    clientUser: RemoteSessionClientUser;
    createdAt: number;
    deletedAt: number;
    deviceId: string;
    duration: number;
    endedAt: number;
    externalIp: string;
    hostName: string;
    id: string;
    internalIp: string;
    key: string;
    oneTime: boolean;
    online: boolean;
    performer: CurrentUser;
    sessionId: string;
    startedAt: number;
    status: string;
    ticket: null
    userName: string;
    version: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}