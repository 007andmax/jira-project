export class DocumentCategoryEdit {
    id: string;
    name: string;
    newName: string;
    validate: boolean = true;
    constructor(id = null, name = null, newName = null) {
        this.id = id;
        this.name = name;
        this.newName = newName;
    }

    public isEditMode(id) {
        return this.id === id;
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