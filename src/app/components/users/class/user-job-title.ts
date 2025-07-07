export class UserJobTitle {
    id: string;
    name: string;
    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
        }

    }
    public getDataForUpdate() {
        return { id: this.id }
    }
}