export class HardwareSummaryReport {
    companyId: string;
    deviceId: string;
    devices: any = [];
    preloaderDevices: boolean = false;
    hardwareSummaryWithDevice = true;
    hardwareSummaryWithOperationSystem = true;
    hardwareSummaryWithCpu = true;
    hardwareSummaryWithRam = true;
    hardwareSummaryWithDisk = true;
    hardwareSummaryWithWarrenty = true;
    hardwareSummaryWithSerialNumber = true;
    list = [];
    constructor(data = null) {
        if (data) {
            this.companyId = data.companyId;
            this.deviceId = data.deviceId;
            this.devices = data.devices;
            this.hardwareSummaryWithDevice = data.hardwareSummaryWithDevice;
            this.hardwareSummaryWithOperationSystem = data.hardwareSummaryWithOperationSystem;
            this.hardwareSummaryWithCpu = data.hardwareSummaryWithCpu;
            this.hardwareSummaryWithRam = data.hardwareSummaryWithRam;
            this.hardwareSummaryWithDisk = data.hardwareSummaryWithDisk;
            this.hardwareSummaryWithWarrenty = data.hardwareSummaryWithWarrenty;
            this.hardwareSummaryWithSerialNumber = data.hardwareSummaryWithSerialNumber;
            this.list = [];

            if (this.deviceId) {
                this.list = this.devices && this.devices.filter((item) => item.id === this.deviceId);
            } else {
                this.list = this.devices;
            }
            console.log("this.list", this.list);
            this.list.sort((a, b) => ((a.label || a.hostName).toLowerCase() > (b.label || b.hostName).toLowerCase()) ? 1 : (((b.label || b.hostName).toLowerCase() > (a.label || a.hostName).toLowerCase()) ? -1 : 0));
            /*  if ($scope.softwareSummarySoft) {
                  const type = $scope.softwareSummarySoft.type;
                  const name = $scope.softwareSummarySoft.name;
                  reportTransformedSoftwareSummaryDataInside = reportTransformedSoftwareSummaryDataInside.filter(function (item) {
                      if (type === 'publisher') {
                          return item.publisher === name;
                      } else {
                          return item.softwareTitle === name;
                      }
                  });
              }*/
        }
    }

    public setPreloaderDevices(data) {
        this.preloaderDevices = data;
    }
    public setDevices(data) {
        this.devices = data;
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setDeviceId(data) {
        this.deviceId = data;
    }
}