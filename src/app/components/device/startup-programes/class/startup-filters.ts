import { FilterListTop } from "src/class/list/filter-list-top";

export class StartupFilter {

  filterTop: Array<FilterListTop> = [
    new FilterListTop("Name", "ASC"),
    new FilterListTop("Command", ""),
    new FilterListTop("User", "")
  ];
  constructor() { }

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
      if (field === "Command") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterCommand(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
      if (field === "User") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterUser(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
    }
  }

  private onFilterUser(software) {
    software.sort((a, b) =>
      this.getUser(a).toLowerCase() >
        this.getUser(b).toLowerCase()
        ? 1
        : this.getUser(b).toLowerCase() >
          this.getUser(a).toLowerCase()
          ? -1
          : 0
    );
  }
  private getUser(service) {
    return service.User || '';
  }

  private onFilterCommand(service) {
    service.sort((a, b) =>
      this.getCommand(a).toLowerCase() >
        this.getCommand(b).toLowerCase()
        ? 1
        : this.getCommand(b).toLowerCase() >
          this.getCommand(a).toLowerCase()
          ? -1
          : 0
    );
  }

  private getCommand(service) {
    return service.Command || '';
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
