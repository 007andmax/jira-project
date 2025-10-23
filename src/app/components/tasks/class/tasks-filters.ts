import { User } from "../../users/class/user";
import { Task } from "./task";

export class TasksFilters {
    techUser: any;
    filter: string;
    archived: boolean = false;
    constructor() {
    }
    public setFilterData(data) {
        this.techUser = data.techUser;
        this.filter = data.filter;
        this.archived = data.archived;
    }
    public setTechUser(data) {
        this.techUser = data;
    }
    public setFilter(data) {
        this.filter = data;
    }
    public setArchived(data: boolean) {
        this.archived = data;
    }
    checkFilterUse(task: Task) {
        let selectedTechUser = true;
        let selectedFilter = true;
        let selectedIsArchive = true;
        if (this.techUser) {
            selectedTechUser = (task.assignedUsersIds.some(item => item === this.techUser.id));
        }
        if (this.filter) {
            if (this.filter == 'UPCOMING' || this.filter == 'OVERDUE') selectedFilter = (task.taskStatus == 'OPEN');
            if (this.filter == 'COMPLETED') selectedFilter = (task.taskStatus == 'CLOSED');
        }
        if (this.archived) {
            selectedIsArchive = (task.archivedAt != null);
        }
        return selectedTechUser && selectedFilter && selectedIsArchive;
    }
}