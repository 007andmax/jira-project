export class TasksStats {
    "created": number;
    "upcoming": number;
    "overdue": number;
    "completed": number;
    constructor(data) {
        this.created = data.created;
        this.upcoming = data.upcoming;
        this.overdue = data.overdue;
        this.completed = data.completed;
    }
}