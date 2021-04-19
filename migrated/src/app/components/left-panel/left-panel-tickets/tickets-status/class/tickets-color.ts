export class TicketsColor {
    completed: number = 0;
    inProgress: number = 1;
    onHold: number = 2;
    unassigned: number = 3;
    constructor(data) {
        if (data) {
            this.completed = data.completed;
            this.inProgress = data.inProgress;
            this.onHold = data.onHold;
            this.unassigned = data.unassigned;
        }
       
    }
}