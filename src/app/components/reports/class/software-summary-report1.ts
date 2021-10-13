export class SoftwareSummaryReport1 {

  companyId: string;
  deviceId: string;
  softwareSummarySoft: any;

  constructor(data = null) {
    if (data != null) {
        this.companyId = data.companyId;
        this.deviceId = data.deviceId;
        this.softwareSummarySoft = data.softwareSummarySoft;
    }
}
public setCompanyId(data) {
  this.companyId = data;
}

public setDeviceId(data) {
  this.deviceId = data;
}

public setSoftwareSoft(data) {
  this.softwareSummarySoft = data;
}

}
