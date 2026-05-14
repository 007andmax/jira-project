export class TicketPreviewServicesCompany {
    companyId: string;
    services: any = [];
    constructor(companyId, services) {
        this.companyId = companyId;
        this.services = services;
    }
}