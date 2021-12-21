import { FilterListTop } from "src/class/list/filter-list-top";

export class ServiceFilter {

  filterTop: Array<FilterListTop> = [
    new FilterListTop("Name", "ASC"),
    new FilterListTop("Description", ""),
    new FilterListTop("Status", "")
  ];
  constructor() {}

  public onFilter(field, service) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
      if (field === "Name") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterName(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
      if (field === "Description") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterDescription(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
      if (field === "Status") {
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
    return service.Started ? "Runnig" : "Stopped";
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
    return service.Description||'';
  }

  public onFilterName(service) {
    service.sort((a, b) =>
      this.getNameSoftware(a).toLowerCase() >
      this.getNameSoftware(b).toLowerCase()
        ? 1
        : this.getNameSoftware(b).toLowerCase() >
          this.getNameSoftware(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getNameSoftware(service) {
    return service.Name || '';
  }
  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
