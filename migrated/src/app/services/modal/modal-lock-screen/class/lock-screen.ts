export class LockScreen {
    code: string;
    unlocking: boolean = false;
    codeSent: boolean = false;
    constructor() { }
    public isUnlocking() {
        return this.unlocking;
    }
    public isCodeSent() {
        return this.codeSent;
    }
    public setCodeSent(data) {
        this.codeSent = data;
    }
    public setUnlocking(data) {
        this.unlocking = data;
    }
}