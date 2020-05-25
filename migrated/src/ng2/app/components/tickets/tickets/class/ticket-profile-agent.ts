export class TicketProfileAgent {
    agentId: string;
    deviceId: string;
    deviceType: string;
    handler: any;
    hibernateLazyInitializer: any;
    iconName: string;
    id: string;
    label: string;
    netscanId: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                    this[key] = data[key];
            }
        }
     }
}