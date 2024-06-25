export class ProductType {
    "id": string;
    "title": string;
    isInitEdit: boolean = false;
    disableUpdate: boolean = false;
    selected: boolean = false;
    isInitRequest: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
    }
    public setIsInitRequest(data) {
        this.isInitRequest = data;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
    public checkDublicate(list) {
        var duplicate = list.filter((item) => {
            return item.title.toLowerCase() === this.title.toLowerCase() && item.id !== this.id;
        });
        if (duplicate && duplicate[0]) {
            return this.disableUpdate = true;
        } else {
            return this.disableUpdate = false;
        }
    };
}