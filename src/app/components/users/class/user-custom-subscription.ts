export class UserCustomSubscription {
    id: string;
    name: string;
    usersCount: number;
    activated: boolean;

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.usersCount = data.usersCount;
        this.activated = data.activated;

    }
}