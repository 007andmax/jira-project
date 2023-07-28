export class UserDefaultSubscriptionItem {
    enabled: boolean;
    activated: boolean;
    isExist: boolean = true;
    constructor(data) {
        this.enabled = data.enabled;
        this.activated = data.activated;

    }
    /**
* @description Set new value field 'isExist'
* @param {boolean} data - New value field 'isExist'
*/
    public setIsExist(data) {
        this.isExist = data;
    }
}