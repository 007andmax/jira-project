export class MarketingSubscriptionType {
    id: string;
    name: string;
    subscribedCount: number;
    unsubscribedCount: number;
    isInitEdit: boolean = false;
    disableUpdate: boolean = false;
    subscribed: boolean;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.subscribedCount = data.subscribedCount | 0;
        this.unsubscribedCount = data.unsubscribedCount | 0;
    }
    public setSubscribed(data) {
        this.subscribed = data;
    }
    public getSubscribed() {
        return this.subscribed;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
    public onUpdate(data) {
        this.name = data.name;
        this.subscribedCount = data.subscribedCount | this.subscribedCount;
        this.unsubscribedCount = data.unsubscribedCount | this.unsubscribedCount;
    }
    public checkDublicate(list) {
        var duplicate = list.filter((item) => {
            return item.name.toLowerCase() === this.name.toLowerCase() && item.id !== this.id;
        });
        if (duplicate && duplicate[0]) {
            return this.disableUpdate = true;
        } else {
            return this.disableUpdate = false;
        }
    };
}