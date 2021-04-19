export class DeviceStatus {
    companyId: string;
    agentIds: Array<string>;
    actions: Array<string>;
    constructor(companyId, agentIds, actions) {
        this.companyId = companyId;
        this.agentIds = agentIds;
        this.actions = actions;
    }
}