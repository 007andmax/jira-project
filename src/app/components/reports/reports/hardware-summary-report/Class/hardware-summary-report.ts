import { FilterListTop } from "src/class/list/filter-list-top";

export class HardwareSummaryReportFilter {
  filterTop: Array<FilterListTop> = [
    new FilterListTop("company", "ASC"),
    new FilterListTop("device", "ASC"),
  ];
  constructor() {}

  public onFilter(field, Device) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
      if (field === "company") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterName(Device);
        } else {
          this.filterTop[index].filter = "DESC";
          Device.reverse();
        }
      }

      if (field === "device") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterName(Device);
        } else {
          this.filterTop[index].filter = "DESC";
          Device.reverse();
        }
      }
    }
  }

  public onFilterName(Device) {
    Device.sort((a, b) =>
      this.getNameDevice(a).toLowerCase() > this.getNameDevice(b).toLowerCase()
        ? 1
        : this.getNameDevice(b).toLowerCase() >
          this.getNameDevice(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getNameDevice(Device) {
    return Device.CompanyName || '';
  }
  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }

  public onFilterDevice(Device) {
    Device.sort((a, b) =>
      this.getDevice(a).toLowerCase() > this.getDevice(b).toLowerCase()
        ? 1
        : this.getDevice(b).toLowerCase() >
          this.getDevice(a).toLowerCase()
        ? -1
        : 0
    );
  }

  private getDevice(Device) {
    return Device.Name || '';
  }
}
