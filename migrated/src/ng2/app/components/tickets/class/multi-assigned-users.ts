export class MultiAssignedUsers {
    avatar: boolean;
    firstName: string;
    id: string;
    lastName: string;
    constructor(data) {
        this.avatar = data.avatar;
        this.firstName = data.firstName;
        this.id = data.id;
        this.lastName = data.lastName;
    }
}