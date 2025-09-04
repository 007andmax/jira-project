import { User } from "../../users/class/user";

export class TasksFilters {
    techUser: User;
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
}