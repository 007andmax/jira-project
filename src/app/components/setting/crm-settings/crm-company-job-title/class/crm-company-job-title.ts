export class CrmCompanyJobTitle {
    id: string;
    name: string;
    isInitEdit: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
}