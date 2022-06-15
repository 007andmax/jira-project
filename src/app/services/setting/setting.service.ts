import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { AppStateService } from "src/app/states/app/app-state.service";

var md5 = require('md5');

@Injectable({
  providedIn: "root"
})
export class SettingService {
  private apiUrl = environment.apiUrl;
  public currentUser: any;

  constructor(private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService) { }


  /**
   * Profile Tab
   */

  isEmailUnique(email: string, id: string, isTechUser: boolean) {
    return this.http.get(
      `${this.apiUrl}users/isEmailUnique?email=${email}&id=${id}&isTechUser=${isTechUser}`
    );
  }

  public getScratches() {
    return this.http.get(`${this.apiUrl}google/code/scratches`);
  }
  public getNewScratches() {
    return this.http.post(`${this.apiUrl}google/code/scratches`, {});
  }

  public getUserProfile() {
    return this.http.get(`${this.apiUrl}settings/userProfile/`);
  }

  public setAuthCode(user_id, code_value_from_authenticator) {
    return this.http.get(`${this.apiUrl}google/code/confirm?userId=${user_id}&code=${code_value_from_authenticator}`)
  }


  public checkTestServer(data) {
    return this.http.post(`${this.apiUrl}settings/companyProfile/verifySMTPSettings`, data).pipe(
      tap((res: any) => {
        if (res.valid) this.toastrService.success("Email server settings successfully updated");
        if (!res.valid) this.toastrService.error(res.errorMessage);
        this.appStateService.changeDetectorRef();
        return res;
      }));
  }

  public updateAvatar(id: string, image: any) {
    return this.http.post(`${this.apiUrl}users/${id}/avatar`, image);
  }
  public getQRCode(user_id) {
    return this.http.get(`${this.apiUrl}google/code/generate?userId=${user_id}`);
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
    return this.http.post(`${this.apiUrl}users/twoFactorAuth?type=${type}`, {}).pipe(
      tap((res: any) => {
        this.toastrService.success("Authentication type has been successfully changed");
        this.appStateService.changeDetectorRef();
        return res;
      }));
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
