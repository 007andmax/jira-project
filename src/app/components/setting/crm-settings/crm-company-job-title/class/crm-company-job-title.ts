export class CrmCompanyJobTitle {
    id: string;
    name: string;
    isInitEdit: boolean = false;
    disableUpdate: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
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