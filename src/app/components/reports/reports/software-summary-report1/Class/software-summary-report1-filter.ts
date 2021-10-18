import { FilterListTop } from "src/class/list/filter-list-top";

export class SoftwareSummaryReportFilter {
  filterTop: Array<FilterListTop> = [
    new FilterListTop("name", "ASC"),
    new FilterListTop("pulisher", ""),
    new FilterListTop("device", ""),
  ];
  constructor() {}

  public onFilter(field, software) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
      if (field === "name") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterName(software);
        } else {
          this.filterTop[index].filter = "DESC";
          software.reverse();
        }
      }
      if (field === "pulisher") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterPulisher(software);
        } else {
          this.filterTop[index].filter = "DESC";
          software.reverse();
        }
      }
      if (field === "device") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterdevice(software);
        } else {
          this.filterTop[index].filter = "DESC";
          software.reverse();
        }
      }
    }
  }



  private onFilterdevice(software) {
    software.sort((a, b) =>
      this.getVersionSoftware(a).toLowerCase() >
      this.getVersionSoftware(b).toLowerCase()
        ? 1
        : this.getVersionSoftware(b).toLowerCase() >
          this.getVersionSoftware(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getVersionSoftware(software) {
    return software.AssetNames;
  }

  private onFilterPulisher(software) {
    software.sort((a, b) =>
      this.getPublisherSoftware(a).toLowerCase() >
      this.getPublisherSoftware(b).toLowerCase()
        ? 1
        : this.getPublisherSoftware(b).toLowerCase() >
          this.getPublisherSoftware(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getPublisherSoftware(software) {
    return software.Publisher;
  }

  public onFilterName(software) {
    software.sort((a, b) =>
      this.getNameSoftware(a).toLowerCase() >
      this.getNameSoftware(b).toLowerCase()
        ? 1
        : this.getNameSoftware(b).toLowerCase() >
          this.getNameSoftware(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getNameSoftware(software) {
    return software.DisplayName;
  }
  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
