export class DocumentCategoryAdd {
    validate: boolean = true;
    categoryName: string = "";
    constructor() {

    }
    public setValidate(data) {
        this.validate = data;
    }
    public getValidate() {
        return this.validate;
    }
    public isValidate(find) {
        console.log("find", find);
        if (find) this.validate = false;
        return this.validate;
    }
}