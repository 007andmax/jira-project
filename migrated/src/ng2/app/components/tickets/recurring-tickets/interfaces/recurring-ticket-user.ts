export interface RecurringTicketUser {
    id: string;
    firstName:string;
    lastName: string;
    primaryEmail: string;
    deletedAt: number;
    online: boolean;
    disabledWelcomeWizard: boolean;
    myTicketUpdated: any;
    default: boolean;
    contact: boolean;
    owner: boolean;
    emailVerified: boolean;
}