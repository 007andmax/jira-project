import { FilterListTop } from "src/class/list/filter-list-top";

export class DeviceFilter {
  filterTop: Array<FilterListTop> = [new FilterListTop("Name", "ASC"),new FilterListTop("CompanyName", "ASC"), new FilterListTop("ManufactureName", "ASC")];
  constructor() {}

  public onFilter(field, devices) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
      if (field === "Name") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterName(devices);
        } else {
          this.filterTop[index].filter = "DESC";
          devices.reverse();
        }
      }
      else if( field == "CompanyName") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterCompanyName(devices);
        } else {
          this.filterTop[index].filter = "DESC";
          devices.reverse();
        }
      }
      else if(field == "ManufactureName"){
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterManufactureName(devices);
        } else {
          this.filterTop[index].filter = "DESC";
          devices.reverse();
        }
      }
    }
  }
  public onFilterName(devices) {
    devices.sort((a, b) =>
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

  public onFilterCompanyName(devices) {
    devices.sort((a, b) =>
      this.getCompanyNameDevice(a).toLowerCase() > this.getCompanyNameDevice(b).toLowerCase()
        ? 1
        : this.getCompanyNameDevice(b).toLowerCase() >
          this.getCompanyNameDevice(a).toLowerCase()
        ? -1
        : 0
    );
  }

  public onFilterManufactureName(devices) {
    devices.sort((a, b) =>
      this.getManufactureName(a).toLowerCase() > this.getManufactureName(b).toLowerCase()
        ? 1
        : this.getManufactureName(b).toLowerCase() >
          this.getManufactureName(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getManufactureName(manufacture) {
    return manufacture.ManufactureName;
  }

  private getCompanyNameDevice(devicebeta) {
    return devicebeta.CompanyName;
  }
}
