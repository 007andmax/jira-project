export class GlNumber {
    id: string;
    glNumber: string;
    description: string;
    blockTime: boolean;
    serviceContract: boolean;
    constructor(data) {
        this.id = data.id;
        this.glNumber = data.glNumber;
        this.description = data.description;
        this.blockTime = data.blockTime;
        this.serviceContract = data.serviceContract;
    }
}