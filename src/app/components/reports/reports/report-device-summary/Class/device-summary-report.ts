import { FilterListTop } from "src/class/list/filter-list-top";

export class DeviceSummaryReportFilter {
  filterTop: Array<FilterListTop> = [
    new FilterListTop("name", "ASC"),
    new FilterListTop("manufacturer", ""),
    new FilterListTop("model", ""),
  ];
  constructor() {}

  public onFilter(field, Device) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
      if (field === "name") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterName(Device);
        } else {
          this.filterTop[index].filter = "DESC";
          Device.reverse();
        }
      }
      if (field === "manufacturer") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterManufacturer(Device);
        } else {
          this.filterTop[index].filter = "DESC";
          Device.reverse();
        }
      }
      if (field === "model") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterModel(Device);
        } else {
          this.filterTop[index].filter = "DESC";
          Device.reverse();
        }
      }
    }
  }



  private onFilterModel(Device) {
    Device.sort((a, b) =>
      this.getDeviceModel(a).toLowerCase() >
      this.getDeviceModel(b).toLowerCase()
        ? 1
        : this.getDeviceModel(b).toLowerCase() >
          this.getDeviceModel(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getDeviceModel(Device) {
    return Device.Model;
  }

  private onFilterManufacturer(Device) {
    Device.sort((a, b) =>
      this.getManufacturer(a).toLowerCase() >
      this.getManufacturer(b).toLowerCase()
        ? 1
        : this.getManufacturer(b).toLowerCase() >
          this.getManufacturer(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getManufacturer(Device) {
    return Device.Manufacturer;
  }

  public onFilterName(Device) {
    Device.sort((a, b) =>
      this.getNameDevice(a).toLowerCase() >
      this.getNameDevice(b).toLowerCase()
        ? 1
        : this.getNameDevice(b).toLowerCase() >
          this.getNameDevice(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getNameDevice(Device) {
    return Device.Name;
  }
  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
