import { FilterListTop } from "src/class/list/filter-list-top";

export class SoftwareFilter {
  filterTop: Array<FilterListTop> = [
    new FilterListTop("name", "ASC"),
    new FilterListTop("pulisher", ""),
    new FilterListTop("version", ""),
    new FilterListTop("install", ""),
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
      if (field === "version") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterVersion(software);
        } else {
          this.filterTop[index].filter = "DESC";
          software.reverse();
        }
      }
      if (field === "install") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterInstall(software);
        } else {
          this.filterTop[index].filter = "DESC";
          software.reverse();
        }
      }
    }
  }

  private onFilterInstall(software) {
    software.sort((a, b) =>
      this.getInstallSoftware(a).toLowerCase() >
      this.getInstallSoftware(b).toLowerCase()
        ? 1
        : this.getInstallSoftware(b).toLowerCase() >
          this.getInstallSoftware(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getInstallSoftware(software) {
    return software.InstallDate;
  }

  private onFilterVersion(software) {
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
    return software.DisplayVersion;
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
