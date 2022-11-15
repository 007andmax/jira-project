export class GlNumber {
    id: string;
    glNumber: string = "";
    description: string = "";
    blockTime: boolean;
    serviceContract: boolean;
    isInitEdit: boolean = false;
    disableUpdate: boolean = false;
    isInitRequest: boolean = false;
    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.glNumber = data.glNumber;
            this.description = data.description;
            this.blockTime = data.blockTime;
            this.serviceContract = data.serviceContract;
        }
    }
    public setIsInitRequest(data) {
        this.isInitRequest = data;
    }
    public checkDublicate(list) {
        var duplicate = list.filter((item) => {
            return item.glNumber.toLowerCase() === this.glNumber.toLowerCase() && item.id !== this.id;
        });
        if (duplicate && duplicate[0]) {
            return this.disableUpdate = true;
        } else {
            return this.disableUpdate = false;
        }
    };
    public getDataForAdd() {
        return {
            description: this.description,
            glNumber: this.glNumber,
        }
    }
    public getDataForEdit() {
        return {
            id: this.id,
            description: this.description,
            glNumber: this.glNumber,
        }
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
}