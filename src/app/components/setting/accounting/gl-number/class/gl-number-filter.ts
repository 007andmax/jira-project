import { FilterListTop } from "src/class/list/filter-list-top";

export class GlNumberFilter {

    filterTop: Array<FilterListTop> = [
        new FilterListTop("glNumber", "ASC"),
        new FilterListTop("description", ""),
    ];
    direction!: string;
    constructor() { }

    public onFilter(field, service) {
        let index = this.filterTop.findIndex((item) => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === "glNumber") {
                this.clearFilter();
                if (sort === "" || sort === "DESC") {
                    this.filterTop[index].filter = "ASC";
                    this.onFilterGlNumber(service);
                } else {
                    this.filterTop[index].filter = "DESC";
                    service.reverse();
                }
            }
            if (field === "description") {
                this.clearFilter();
                if (sort === "" || sort === "DESC") {
                    this.filterTop[index].filter = "ASC";
                    this.onFilterDescription(service);
                } else {
                    this.filterTop[index].filter = "DESC";
                    service.reverse();
                }
            }
            this.direction = this.filterTop[index].filter;
        }
    }



    private onFilterGlNumber(service) {
        service.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
            1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
    }
    private onFilterDescription(service) {
        service.sort((a, b) =>
            a.description.toLowerCase() >
                b.description.toLowerCase()
                ? 1
                : b.description.toLowerCase() >
                    a.description.toLowerCase()
                    ? -1
                    : 0
        );
    }
    public clearFilter() {
        this.filterTop.forEach((item) => (item.filter = ""));
    }
}
