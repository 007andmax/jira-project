import { TicketGlobalFilter } from "../../../class/ticket-global-filter";

export class TicketsFilterSaveValidate {
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
    public isValidate(filter: TicketGlobalFilter) {
        if (!filter.name || filter.name.length < 1) this.name = false;
        return this.name;
    }
}