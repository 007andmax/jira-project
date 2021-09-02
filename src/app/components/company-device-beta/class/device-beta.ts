import { FilterListTop } from "src/class/list/filter-list-top";

export class CompanyDeviceBetaFilter {
  filterTop: Array<FilterListTop> = [new FilterListTop("Name", "ASC")];
  constructor() {}

  public onFilter(field, devicesbeta) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
      if (field === "Name") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterName(devicesbeta);
        } else {
          this.filterTop[index].filter = "DESC";
          devicesbeta.reverse();
        }
      }
    }
  }
  public onFilterName(devicesbeta) {
    devicesbeta.sort((a, b) =>
      this.getNameDevice(a).toLowerCase() > this.getNameDevice(b).toLowerCase()
        ? 1
        : this.getNameDevice(b).toLowerCase() >
          this.getNameDevice(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getNameDevice(devicebeta) {
    return devicebeta.Name;
  }
  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
