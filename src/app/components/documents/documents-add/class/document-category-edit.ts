export class DocumentCategoryEdit {
    id: string;
    name: string;
    newName: string;

    constructor(id = null, name = null, newName = null) {
        this.id = id;
        this.name = name;
        this.newName = newName;
    }

    public isEditMode(id) {
        return this.id === id;
    }

}