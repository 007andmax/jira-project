import { FilterListTop } from "src/class/list/filter-list-top";

export class DeviceSettingFilter {

  filterTop: Array<FilterListTop> = [
    new FilterListTop("Name", "ASC"),
    new FilterListTop("Counter", ""),
    new FilterListTop("ManufactureName", ""),
  ];
  constructor() { }

  public onFilter(field, service) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
      if (field === "Counter") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterCount(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
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
      if (field === "ManufactureName") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterDeviceManufacturer(service);
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
    return service.Name || '';
  }

  public onFilterCount(service) {
    service.sort((a, b) =>
      this.getCount(a) >
        this.getCount(b)
        ? 1
        : this.getCount(b) >
          this.getCount(a)
          ? -1
          : 0
    );
  }
  private getCount(service) {
    return service.Counter;
  }

  private onFilterDeviceManufacturer(service) {
    service.sort((a, b) =>
      this.getManufacturerName(a).toLowerCase() >
        this.getManufacturerName(b).toLowerCase()
        ? 1
        : this.getManufacturerName(b).toLowerCase() >
          this.getManufacturerName(a).toLowerCase()
          ? -1
          : 0
    );
  }

  private getManufacturerName(service) {
    return service.ManufactureName || '';
  }


  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
