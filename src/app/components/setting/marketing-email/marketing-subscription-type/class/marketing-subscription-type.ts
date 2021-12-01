export class MarketingSubscriptionType {
    id: string;
    name: string;
    usersCount: number;
    isInitEdit: boolean = false;
    disableUpdate: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.usersCount = data.usersCount | 0;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
    public onUpdate(data) {
        this.name = data.name;
        this.usersCount = data.usersCount | this.usersCount;
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