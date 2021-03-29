export class PasswordRecordCategories {
    id: string;
    name: string;
    default: boolean;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.default = data.default;
    }
}