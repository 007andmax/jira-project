export class UserDefaultSubscriptionItem {
    enabled: boolean;
    activated: boolean;
    constructor(data) {
        this.enabled = data.enabled;
        this.activated = data.activated;
    }
}