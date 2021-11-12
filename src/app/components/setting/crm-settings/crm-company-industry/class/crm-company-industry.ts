export class CrmCompanyIndustry {
    id: string;
    name: string;
    usageCounter: number;
    isInitEdit: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.usageCounter = data.usageCounter;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
}