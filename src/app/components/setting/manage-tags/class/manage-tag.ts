export class ManageTag {
    colorCode: number;
    id: string;
    usedCounter: number;
    word: string;
    isInitEdit: boolean = false;
    disableUpdate: boolean = false;
    selected: boolean = false;
    isInitRequest: boolean = false;
    isUniqueness: boolean = true;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    public setIsUniqueness(data) {
        this.isUniqueness = data;
    }
    public setIsInitRequest(data) {
        this.isInitRequest = data;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
}