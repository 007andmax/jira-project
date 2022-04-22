export class CategoryValdiate {
    name: boolean = true;

    nameIsExist: boolean = false;
    textErrorNameExist: string;
    constructor() { }
    public getName() {
        return this.name;
    }
    public setNameExist(data) {
        this.nameIsExist = data;
    }
    public getNameIsExist() {
        return this.nameIsExist;
    }
    public getTextErrorNameExist() {
        return this.textErrorNameExist;
    }
    public setTextErrorNameExist(data) {
        this.textErrorNameExist = data;
    }
    public checkValidName(name) {
        if (!name || name.length === 0) {
            this.name = false;
        } else {
            this.name = true;
        }
    }

    public isValidate(name) {
        if (name.length === 0) this.name = false;
        return this.name && !this.nameIsExist;
    }


}