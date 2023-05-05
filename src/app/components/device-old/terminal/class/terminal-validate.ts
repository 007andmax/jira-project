export class TerminalValidate {
    category: boolean = true;
    type: boolean = true;
    constructor() { }

    public getCategory() {
        return this.category;
    }
    public getType() {
        return this.type;
    }
    public resetCategory() {
        this.category = true;
    }
    public resetType() {
        this.type = true;
    }
    public isValidate(data) {
        if (data.category == '') this.category = false;
        if (data.type == '') this.type = false;
        return this.category && this.type;
    }
}