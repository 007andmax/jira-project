import { Injectable } from "@angular/core";
import { environment } from "src/ng2/environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CompanyProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGroupedLocales() {
    return this.http.get(`${this.apiUrl}addresses/getGroupedLocales`);
  }

  getCompanyProfile() {
    return this.http.get(`${this.apiUrl}settings/companyProfile/`);
  }

  current() {
    return this.http.get(`${this.apiUrl}company/current`);
  }

  basic(compBasic: any) {
    return this.http.put(
      `${this.apiUrl}settings/companyProfile/basic`,
      compBasic
    );
  }

  isCompanyNameUnique(id: string, name: string) {
    // https://dev.quicktech.com/company/isCompanyNameUnique?id=73221c72-f87c-4519-8235-c4b57ad1cc19&name=Active+Information+Systems
    return this.http.get(
      `${this.apiUrl}company/isCompanyNameUnique?id=${id}&name=${name}`
    );
  }

  getLocalByName(local: any) {
    // https://dev.quicktech.com/addresses/getLocaleByName
    // Asia/Calcutta
    return this.http.post(`${this.apiUrl}addresses/getLocaleByName`, local);
  }

  updateWizard(wizard: any) {
    // {"id":"14396605-5817-46f2-a474-8e2bd4dfcc40","createdAt":1566395254176,"updatedAt":1568114370581,"deletedAt":null,"addStaff":true,"emailSettings":false,"rates":false,"companySettings":true,"setupClient":false}
    return this.http.put(
      `${this.apiUrl}settings/userProfile/updateWizard`,
      wizard
    );
  }

  addresses(address: any) {
    // {"addresses":[{"id":"e84d6119-b890-4777-9363-10d12bb19790","address":"Vijapur Road, Pramod Nagar, Anand Nagar, Solapur, Maharashtra, India","country":"India","longCity":"Solapur","longState":"Maharashtra","shortCity":"Solapur","shortState":"MH","postalCode":"","suiteNumber":"# 205","countryCode":"IN","locationLat":17.644917,"locationLng":75.8995999,"isPrimary":true,"locale":"Asia/Calcutta","phoneNumbers":[{"id":"d8f48c62-7054-4a0e-9b6f-e973cbfa697e","number":"+1 (403) 266-1040","typeNumber":"OFFICE","priority":0}],"timeZone":{"displayName":"India Standard Time","name":"Asia/Calcutta","timeOffset":19800000},"addressWithSuitNumberAndPostalCode":"# 205, 5718 1a St SW, Calgary, AB\nT2H 0E8","fromGoogle":true}]}
    return this.http.put(
      `${this.apiUrl}settings/companyProfile/addresses`,
      address
    );
  }

  workingTime(workTime: any) {
    // {"workingDays":[{"id":"a6321f59-e5aa-49fc-8ad8-978d56a45739","dayOfWeek":"TUESDAY","startTime":28800,"endTime":64800,"workingHours":"from 08:00 to 18:00"},{"id":"c5c72f5b-b388-4010-a42d-c1b5b8a994a0","dayOfWeek":"WEDNESDAY","startTime":28800,"endTime":64800,"workingHours":"from 08:00 to 18:00"},{"id":"88f08bc5-4172-49df-bf09-9eb39cd561aa","dayOfWeek":"THURSDAY","startTime":28800,"endTime":64800,"workingHours":"from 08:00 to 18:00"},{"id":"ce2af960-56d5-4945-8e52-13733e7cdcb7","dayOfWeek":"FRIDAY","startTime":28800,"endTime":64800,"workingHours":"from 08:00 to 18:00"}],"outliersSeconds":28800}
    return this.http.put(
      `${this.apiUrl}settings/companyProfile/workingTime`,
      workTime
    );
  }

  getConstants() {
    //http://localhost:4200/data/getConstants
    // company url
    return this.http.get(`${this.apiUrl}data/getConstants`);
  }

  removeAvatar(comapnyId: string, isDeleted: boolean) {
    // https://dev.quicktech.com/company/73221c72-f87c-4519-8235-c4b57ad1cc19/true
    return this.http.delete(
      `${this.apiUrl}company/${comapnyId}/${isDeleted}`,
      {}
    );
  }

  logo(companyId, cropImage: any) {
    // https://dev.quicktech.com/company/73221c72-f87c-4519-8235-c4b57ad1cc19/logo
    return this.http.post(`${this.apiUrl}company/${companyId}/logo`, cropImage);
  }

}
