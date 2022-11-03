import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { AppStateService } from "src/app/states/app/app-state.service";

@Injectable({
  providedIn: "root"
})
export class EmailSettingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService) { }

  saveInboxEnabled(isEnabled: boolean) {
    return this.http.put(`${this.apiUrl}settings/companyProfile/inbox`, {
      enabled: isEnabled
    }).pipe(
      tap(data => {
        this.toastrService.success("Saved Successfully");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
