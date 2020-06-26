export class BillableTaimer {
    minutes: number = 0;
    seconds: number = 0;
    isFinished: boolean = false;
    constructor(miliseconds) {
        let date = new Date(miliseconds);
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
    }
    public getTimeText() {
        return `${(this.minutes < 10) ? '0' + this.minutes : this.minutes}:${(this.seconds < 10) ? '0' + this.seconds : this.seconds}`
    }
}