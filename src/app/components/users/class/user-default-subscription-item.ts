export class UserDefaultSubscriptionItem {
    enabled: boolean;
    activated: boolean;
    isExist: boolean = true;
    constructor(data) {
        this.enabled = data.enabled;
        this.activated = data.activated;

    }
    public setSsExist(data) {
        this.isExist = data;
    }
}