export class GlNumber {
    id: string;
    glNumber: string = "";
    description: string = "";
    blockTime: boolean;
    serviceContract: boolean;
    isInitEdit: boolean = false;
    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.glNumber = data.glNumber;
            this.description = data.description;
            this.blockTime = data.blockTime;
            this.serviceContract = data.serviceContract;
        }
    }
    public getDataForAdd() {
        return {
            description: this.description,
            glNumber: this.glNumber,
        }
    }
}