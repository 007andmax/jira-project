export class DeviceSummaryReport {
  companyId: string;
  deviceName: string;

  constructor(data = null) {
    if (data != null) {
      this.companyId = data.companyId;
      this.deviceName = data.deviceName;
    }
  }
  public setCompanyId(data) {
    this.companyId = data;
  }

  public setDeviceName(data) {
    this.deviceName = data;
  }
}
