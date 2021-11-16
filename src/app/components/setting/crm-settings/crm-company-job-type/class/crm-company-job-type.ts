export class CrmCompanyJobType {
    id: string;
    name: string;
    usageCounter: number;
    isInitEdit: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.usageCounter = data.usageCounter | 0;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
    public onUpdate(data) {
        this.name = data.name;
        this.usageCounter = data.usageCounter | this.usageCounter;
    }
}