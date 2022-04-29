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
          this.onFilterPaid(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
      if (field === "name") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterDescription(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
      if (field === "cpu") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterStatus(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
    }
  }



  private onFilterStatus(software) {
    software.sort((a, b) =>
      this.getStatus(a).toLowerCase() >
      this.getStatus(b).toLowerCase()
        ? 1
        : this.getStatus(b).toLowerCase() >
          this.getStatus(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getStatus(service) {
    return service.CPU;
  }

  private onFilterDescription(service) {
    service.sort((a, b) =>
      this.getDescription(a).toLowerCase() >
      this.getDescription(b).toLowerCase()
        ? 1
        : this.getDescription(b).toLowerCase() >
          this.getDescription(a).toLowerCase()
        ? -1
        : 0
    );
  }

  private getDescription(service) {
    return service.Name||'';
  }

  public onFilterPaid(service) {
    service.sort((a, b) =>
      this.getPaid(a).toLowerCase() >
      this.getPaid(b).toLowerCase()
        ? 1
        : this.getPaid(b).toLowerCase() >
          this.getPaid(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getPaid(service) {
    return service.id || '';
  }
  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
