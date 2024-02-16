export class UserGlobalFilter {
    "id": string;
    "name": string;
    "global": boolean;
    "forMarketing": boolean;
    "jobTitles": Array<string> = [];
    "companies": Array<string> = [];
    "industries": Array<string> = [];
    "tags": Array<string> = [];
    "customSubscriptions": Array<string> = [];
    "ticketSubscription": boolean;
    "ticketManagerSubscription": boolean;
    "invoiceSubscription": boolean;
    "hasAccess": boolean;
    "modified": boolean;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }

    public getDataForRequest(add) {
        let data: any = {
            "name": this.name,
            "global": this.global,

            "jobTitles": this.jobTitles,
            "companies": this.companies,
            "ticketSubscription": this.ticketSubscription,
            "ticketManagerSubscription": this.ticketManagerSubscription,
            "invoiceSubscription": this.invoiceSubscription,
            "industries": this.industries,
            "tags": this.tags,
            "customSubscriptions": this.customSubscriptions,
            "hasAccess": this.hasAccess
        };
        if (add) data.forMarketing = this.forMarketing;
        return data;
    }
}