export class UserRole {
    "id": string;
    "name": string;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
}