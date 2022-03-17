export class CategoryValdiate {
    name: boolean = true;

    nameIsExist: boolean = false;

    constructor() { }
    public getName() {
        return this.name;
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
        return this.name;
    }


}