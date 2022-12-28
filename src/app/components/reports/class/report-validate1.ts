export class ReportValidate1 {
  company: boolean = true;
  constructor() {}

  public isValidateSoftwareSummary(company) {
    if (!company) this.company = false;
    return this.company;
  }

  public getCompany() {
    return this.company;
  }
  public resetCompany() {
    this.company = true;
  }
}
