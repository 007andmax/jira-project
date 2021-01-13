export class CompanySetting {
    title: string;
    value: any;
    selected: boolean = false;
    constructor(title, value) {
        this.title = title;
        this.value = value;
    }
}