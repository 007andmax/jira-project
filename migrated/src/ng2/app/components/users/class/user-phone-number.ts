export class UserPhoneNumber {
    id: string;
    number: string;
    typeNumber: string;
    priority: number;
    constructor(id, number, typeNumber, priority) {
        this.id = id;
        this.number = number;
        this.typeNumber = typeNumber;
        this.priority = priority;
    }
}