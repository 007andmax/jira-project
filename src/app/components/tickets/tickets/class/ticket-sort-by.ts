export class TicketSortBy {
    sortBy: string;
    sortDirection: string;

    constructor(sortBy: string, sortDirection: string) {
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }
}