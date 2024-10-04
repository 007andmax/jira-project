import { UserGlobalFilter } from "../../class/user-global-filters";

export class UserFilterSaveValidate {
    name: boolean = true;


    public getName() {
        return this.name;
    }
    public checkValidName(name) {
        if (!name || name.length < 1) {
            this.name = false;
        } else {
            this.name = true;
        }
    }
    public isValidate(filter: UserGlobalFilter) {
        if (!filter.name || filter.name.length < 1) this.name = false;
        return this.name;
    }
}