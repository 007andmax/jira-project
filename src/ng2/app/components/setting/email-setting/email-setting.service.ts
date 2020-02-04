import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/ng2/environments/environment";

@Injectable({
  providedIn: "root"
})
export class EmailSettingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  saveInboxEnabled(isEnabled: boolean) {
    return this.http.put(`${this.apiUrl}settings/companyProfile/inbox`, {
      enabled: isEnabled
    });
  }

  getConstants() {
    return this.http.get(`${this.apiUrl}data/getConstants`);
  }

  getSMTPSettings() {
    return this.http.get(`${this.apiUrl}settings/companyProfile/SMTPSettings`);
  }

  SMTPSettings(smtp: any) {
    return this.http.put(
      `${this.apiUrl}settings/companyProfile/SMTPSettings`,
      smtp
    );
  }

  getEmailAlias() {
    return this.http.get(`${this.apiUrl}settings/companyProfile/emailAlias`);
  }

  saveEmailAlias(emailAlias) {
    return this.http.post(`${this.apiUrl}settings/companyProfile/emailAlias`, {
      emailAlias: emailAlias
    });
  }

  checkEmailUnique(email: string) {
    return this.http.get(
      `${this.apiUrl}settings/companyProfile/SMTPSettings/checkEmailUnique?email=${email}`
    );
  }

  checkSMTPLoginUnique(email: string) {
    return this.http.get(
      `${this.apiUrl}settings/companyProfile/SMTPSettings/checkEmailUnique?email=${email}`
    );
  }
}
