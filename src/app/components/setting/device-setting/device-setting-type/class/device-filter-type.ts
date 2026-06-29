import { FilterListTop } from "src/class/list/filter-list-top";

export class DeviceFilterType {

    filterTop: Array<FilterListTop> = [
        new FilterListTop("name", "ASC")
    ];
    direction: string;
    constructor() { }

    public onFilter(field, service) {
        let index = this.filterTop.findIndex((item) => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === "name") {
                this.clearFilter();
                if (sort === "" || sort === "DESC") {
                    this.filterTop[index].filter = "ASC";
                    this.onFilterName(service);
                } else {
                    this.filterTop[index].filter = "DESC";
                    service.reverse();
                }
            }
            this.direction = this.filterTop[index].filter;
        }
    }



    private onFilterName(service) {
        service.sort((a, b) =>
            this.getName(a).toLowerCase() >
                this.getName(b).toLowerCase()
                ? 1
                : this.getName(b).toLowerCase() >
                    this.getName(a).toLowerCase()
                    ? -1
                    : 0
        );
    }

    private getName(service) {
        return service.name || '';
    }

    public clearFilter() {
        this.filterTop.forEach((item) => (item.filter = ""));
    }
}
