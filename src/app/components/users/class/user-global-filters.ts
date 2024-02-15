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
}