export class QuoteResult {
    message: string = '';
    show: boolean = true;
    constructor(message) {
        this.message = message;
    }
    public setShow (show) {
        this.show = show;
    }
    public getMessage() {
        return this.message;
    }
    public getShow() {
        return this.show;
    }
}