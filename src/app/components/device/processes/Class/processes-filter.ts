import { FilterListTop } from "src/class/list/filter-list-top";

export class ProcessesFilter {

  filterTop: Array<FilterListTop> = [
    new FilterListTop("pid", "ASC"),
    new FilterListTop("name", ""),
    new FilterListTop("cpu", "")
  ];
  constructor() {}

  public onFilter(field, service) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
      if (field === "pid") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterPid(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
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
    return service.Name||'';
  }

  public onFilterPid(service) {
    service.sort((a, b) =>
      this.getPid(a).toLowerCase() >
      this.getPid(b).toLowerCase()
        ? 1
        : this.getPid(b).toLowerCase() >
          this.getPid(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getPid(service) {
    return service.id || '';
  }
  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
