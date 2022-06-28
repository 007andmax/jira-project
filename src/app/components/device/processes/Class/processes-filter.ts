import { FilterListTop } from "src/class/list/filter-list-top";

export class ProcessesFilter {

  filterTop: Array<FilterListTop> = [
    new FilterListTop("pid", "ASC"),
    new FilterListTop("name", ""),
    new FilterListTop("cpu", ""),
    new FilterListTop("ram",""),
    new FilterListTop("memory",""),
    new FilterListTop("disk",""),
    new FilterListTop("network",""),
  ];
  constructor() {}

  public onFilter(field, service) {
    let index = this.filterTop.findIndex((item) => item.field === field);
    if (index > -1) {
      let sort = this.filterTop[index].filter;
      if (field === "pid") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterPid(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
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
      if (field === "cpu") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterCpu(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
      if (field === "ram") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterRam(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
      if (field === "memory") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterMemory(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
      if (field === "disk") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterDisk(service);
        } else {
          this.filterTop[index].filter = "DESC";
          service.reverse();
        }
      }
      if (field === "network") {
        this.clearFilter();
        if (sort === "" || sort === "DESC") {
          this.filterTop[index].filter = "ASC";
          this.onFilterNetwork(service);
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
    return service.Name||'';
  }

  public onFilterPid(service) {
    service.sort((a, b) =>
      this.getPid(a).toLowerCase() >
      this.getPid(b).toLowerCase()
        ? 1
        : this.getPid(b).toLowerCase() >
          this.getPid(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getPid(service) {
    return service.id || '';
  }

  public onFilterCpu(service) {
    service.sort((a, b) =>
      this.getCpu(a).toLowerCase() >
      this.getCpu(b).toLowerCase()
        ? 1
        : this.getCpu(b).toLowerCase() >
          this.getCpu(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getCpu(service) {
    return service.id || '';
  }

  public onFilterRam(service) {
    service.sort((a, b) =>
      this.getRam(a).toLowerCase() >
      this.getRam(b).toLowerCase()
        ? 1
        : this.getRam(b).toLowerCase() >
          this.getRam(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getRam(service) {
    return service.id || '';
  }


  public onFilterMemory(service) {
    service.sort((a, b) =>
      this.getMemory(a).toLowerCase() >
      this.getMemory(b).toLowerCase()
        ? 1
        : this.getMemory(b).toLowerCase() >
          this.getMemory(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getMemory(service) {
    return service.id || '';
  }

  public onFilterDisk(service) {
    service.sort((a, b) =>
      this.getDisk(a).toLowerCase() >
      this.getDisk(b).toLowerCase()
        ? 1
        : this.getDisk(b).toLowerCase() >
          this.getDisk(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getDisk(service) {
    return service.id || '';
  }

  public onFilterNetwork(service) {
    service.sort((a, b) =>
      this.getNetwork(a).toLowerCase() >
      this.getNetwork(b).toLowerCase()
        ? 1
        : this.getNetwork(b).toLowerCase() >
          this.getNetwork(a).toLowerCase()
        ? -1
        : 0
    );
  }
  private getNetwork(service) {
    return service.id || '';
  }


  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
