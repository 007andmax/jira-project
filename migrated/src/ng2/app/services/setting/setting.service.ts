import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";

var md5 = require('md5');

@Injectable({
  providedIn: "root"
})
export class SettingService {
  private apiUrl = environment.apiUrl;
  public currentUser: any;

  constructor(private http: HttpClient) { }

  currentCompany() {
    return this.http.get(`${this.apiUrl}company/current`);
  }

  /**
   * Profile Tab
   */

  isEmailUnique(email: string, id: string, isTechUser: boolean) {
    return this.http.get(
      `${this.apiUrl}users/isEmailUnique?email=${email}&id=${id}&isTechUser=${isTechUser}`
    );
  }

  public getUserProfile() {
    return this.http.get(`${this.apiUrl}settings/userProfile/`);
  }

  public updateAvatar(id: string, image: any) {
    return this.http.post(`${this.apiUrl}users/${id}/avatar`, image);
  }

  public updateProfile(profile: any) {
    return this.http.put(`${this.apiUrl}settings/userProfile/basic`, profile);
  }

  public deleteAvatar(id: string) {
    return this.http.delete(`${this.apiUrl}users/${id}/avatar`);
  }

  public fileAvatar(fromData: any) {
    return this.http.post(`${this.apiUrl}file?isAvatar=true&ratio=1`, fromData);
  }

  /**
   * Account Tab
   */

  public resetPassword(oldPass: string, newPass: string) {
    return this.http.post(`${this.apiUrl}resetPassword`, {
      oldPass: md5(oldPass),
      newPass: md5(newPass)
    });
  }

  public deactivateAccount(note) {
    return this.http.post(`${this.apiUrl}users/deactivate`, { note: note });
  }

  public twoFactorAuth(type: string) {
    return this.http.post(`${this.apiUrl}users/twoFactorAuth?type=${type}`, {});
  }

  public getActivityHistory() {
    return this.http.get(`${this.apiUrl}settings/userProfile/device`);
  }

  public closeSessions(ids: any) {
    return this.http.post(`${this.apiUrl}settings/userProfile/device`, ids);
  }

  get2FA() {
    return this.http.get(`${this.apiUrl}users/twoFactorAuth`);
  }

  /**
   * Email Tab
   */

  email(email: any) {
    return this.http.put(`${this.apiUrl}settings/userProfile/email`, email);
  }

  emailNotifications() {
    return this.http.get(
      `${this.apiUrl}settings/userProfile/emailNotifications`
    );
  }

  removeDevice(id: string) {
    return this.http.post(`${this.apiUrl}settings/userProfile/device`, id);
  }

  /**
   * cropped image
   * @param companyId
   * @param cropImage
   */

  logo(companyId, cropImage: any) {
    return this.http.post(`${this.apiUrl}company/${companyId}/logo`, cropImage);
  }
}
