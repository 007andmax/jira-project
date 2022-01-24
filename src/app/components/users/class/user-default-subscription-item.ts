export class UserDefaultSubscriptionItem {
    enabled: boolean;
    activated: boolean;
    isExist: boolean = true;
    constructor(data) {
        this.enabled = data.enabled;
        this.activated = data.activated;

    }
    public setIsExist(data) {
        this.isExist = data;
    }
}