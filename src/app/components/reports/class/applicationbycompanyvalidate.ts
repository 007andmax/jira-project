export class ApplicationByCompanyValidate {
  company: boolean = true;
  constructor() {}

  public isValidateApplicationByCompany(company) {
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
