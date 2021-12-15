export class UsersFilterSubscriptionsItem {
    id: string;
    type: string;
    name: string;
    enabled: boolean = false;
    constructor(id, type, name) {
        this.id = id;
        this.type = type;
        this.name = name;
    }
}