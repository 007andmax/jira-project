import { FilterListTop } from "src/class/list/filter-list-top";

export class ProcessesFilter {

  filterTop: Array<FilterListTop> = [
    new FilterListTop("pid", ""),
    new FilterListTop("name","ASC"),
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
      this.getPid(a) >
      this.getPid(b)
        ? 1
        : this.getPid(b) >
          this.getPid(a)
        ? -1
        : 0
    );
  }
  private getPid(service) {
    return service.PID;
  }

  public onFilterCpu(service) {
    service.sort((a, b) =>
      this.getCpu(a) >
      this.getCpu(b)
        ? 1
        : this.getCpu(b) >
          this.getCpu(a)
        ? -1
        : 0
    );
  }
  private getCpu(service) {
    return service.CPU;
  }

  public onFilterRam(service) {
    service.sort((a, b) =>
      this.getRam(a) >
      this.getRam(b)
        ? 1
        : this.getRam(b) >
          this.getRam(a)
        ? -1
        : 0
    );
  }
  private getRam(service) {
    return service.MemoryMB;
  }


  public onFilterMemory(service) {
    service.sort((a, b) =>
      this.getMemory(a) >
      this.getMemory(b)
        ? 1
        : this.getMemory(b) >
          this.getMemory(a)
        ? -1
        : 0
    );
  }
  private getMemory(service) {
    return service.MemoryPercent;
  }

  public onFilterDisk(service) {
    service.sort((a, b) =>
      this.getDisk(a) >
      this.getDisk(b)
        ? 1
        : this.getDisk(b) >
          this.getDisk(a)
        ? -1
        : 0
    );
  }
  private getDisk(service) {
    return service.DiskMB;
  }

  public onFilterNetwork(service) {
    service.sort((a, b) =>
      this.getNetwork(a) >
      this.getNetwork(b)
        ? 1
        : this.getNetwork(b) >
          this.getNetwork(a)
        ? -1
        : 0
    );
  }
  private getNetwork(service) {
    return service.Network;
  }


  public clearFilter() {
    this.filterTop.forEach((item) => (item.filter = ""));
  }
}
