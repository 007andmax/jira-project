export class TicketsColor {
    completed: number;
    inProgress: number;
    onHold: number;
    unassigned: number;
    constructor(data) {
        this.completed = data.completed;
        this.inProgress = data.inProgress;
        this.onHold = data.onHold;
        this.unassigned = data.unassigned;
    }
}