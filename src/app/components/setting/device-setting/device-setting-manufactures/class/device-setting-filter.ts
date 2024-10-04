import { FilterListTop } from "src/class/list/filter-list-top";

export class DeviceSettingFilter {

  filterTop: Array<FilterListTop> = [
    new FilterListTop("name", "ASC"),
  ];
  constructor() { }

  public onFilter(field, service) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
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
      a.name.toLowerCase() >
        b.name.toLowerCase()
        ? 1
        : b.name.toLowerCase() >
          a.name.toLowerCase()
          ? -1
          : 0
    );
  }
  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
