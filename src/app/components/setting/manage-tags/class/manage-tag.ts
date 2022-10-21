export class ManageTag {
    colorCode: number;
    id: string;
    usedCounter: number;
    word: string;
    isInitEdit: boolean = false;
    disableUpdate: boolean = false;
    selected: boolean = false;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
}