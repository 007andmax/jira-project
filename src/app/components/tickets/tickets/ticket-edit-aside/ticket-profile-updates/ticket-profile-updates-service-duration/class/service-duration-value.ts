export class ServiceDurationValue {
    value: number;
    selected: boolean = false;
    constructor(value, selected = false) {
        this.value = value;
        this.selected = selected;

    }
    public setSelected(data) {
        this.selected = data;
    }
}