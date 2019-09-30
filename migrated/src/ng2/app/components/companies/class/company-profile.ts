import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';

import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';

export class CompanyProfile {
    addresses:  Array<CompanyAndress>;
agentLinkToEmail: any
clientIndustry: any
clientType: string
contacts: Array<CompanyAndressContact>
defaultPaymentMethod: any
domain: string
login: string
maxAgents: number
name: string
password: string
removeOfflineTime: number
services: [{versionedId: {id: "190e9621-d092-4fdf-87ac-b120ad753756", version: 0}, createdAt: 1512137161555,…},…]
workingDays: [{dayOfWeek: "MONDAY", startTime: 0, endTime: 0}, {dayOfWeek: "TUESDAY", startTime: 0, endTime: 0},…]
}