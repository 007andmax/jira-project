export class UserCustomSubscription {
    id: string;
    name: string;
    usersCount: number;
    activated: boolean;
    isExist: boolean = true;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.usersCount = data.usersCount;
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