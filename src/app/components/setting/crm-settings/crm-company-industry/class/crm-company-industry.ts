export class CrmCompanyIndustry {
    id: string;
    name: string;
    usageCounter: number;
    isInitEdit: boolean = false;
    disableUpdate: boolean = false;
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
    public checkDublicate(list) {
        var duplicate = list.filter((item) => {
            return item.name.toLowerCase() === this.name.toLowerCase() && item.id !== this.id;
        });
        if (duplicate && duplicate[0]) {
            return this.disableUpdate = true;
        } else {
            return this.disableUpdate = false;
        }
    };
}