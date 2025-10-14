import { User } from "../../users/class/user";
import { Task } from "./task";

export class TasksFilters {
    techUser: any;
    filter: string;
    constructor() {
    }
    public setFilterData(data) {
        this.techUser = data.techUser;
        this.filter = data.filter;
    }
    public setTechUser(data) {
        this.techUser = data;
    }
    public setFilter(data) {
        this.filter = data;
    }
    checkFilterUse(task: Task) {
        let selectedTechUser = true;
        let selectedFilter = true;
        if (this.techUser) {
            selectedTechUser = (task.assignedUsersIds.some(item => item === this.techUser.id));
        }
        if (this.filter) {
            if (this.filter == 'UPCOMING' || this.filter == 'OVERDUE') selectedFilter = (task.taskStatus == 'OPEN');
            if (this.filter == 'COMPLETED') selectedFilter = (task.taskStatus == 'CLOSED');
        }
        return selectedTechUser && selectedFilter;
    }
}