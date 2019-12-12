import { Subscriptions } from 'src/ng2/app/interfaces/user/subscriptions';

export class UserSubscription implements Subscriptions {
    id: string; invoice: boolean; ticket: boolean; ticketManager: boolean;
    constructor() { }
}