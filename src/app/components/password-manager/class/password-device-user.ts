export class PasswordDeviceUser {
    id: string;
    name: string;
    type: string;
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}