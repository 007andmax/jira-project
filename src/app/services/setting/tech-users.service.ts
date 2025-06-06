import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";;
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { AppStateService } from "src/app/states/app/app-state.service";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TechUsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService) { }

  getUsers(isArchived) {
    // Tech users
    // accountType: "TECH"
    return this.http.post(`${this.apiUrl}users/filter`, { accountType: "TECH", isArchived: isArchived });
  }

  getRoleNames() {
    // account type
    return this.http.get(`${this.apiUrl}settings/companyProfile/getTechRoleNames`);
  }

  getUsersEmailNotifications(techUserIds) {
    return this.http.post(
      `${this.apiUrl}settings/userProfile/getUsersEmailNotifications`,
      techUserIds
    );
  }

  public fileAvatar(fromData: any) {
    return this.http.post(`${this.apiUrl}file?isAvatar=true&ratio=1`, fromData);
  }

  isEmailUnique(email: string, id: string, isTechUser: boolean) {
    return this.http.get(
      `${this.apiUrl}users/isEmailUnique?email=${email}&id=${id}&isTechUser=${isTechUser}`
    );
  }

  updateTechUsers(uId: string, techUser) {
    return this.http.put(`${this.apiUrl}users/${uId}`, techUser);
  }

  createUser(techUser: any) {
    // {"techRole":"Help desk user","firstName":"Today Test","lastName":"Test","primaryEmail":"today@test.com","companyId":"73221c72-f87c-4519-8235-c4b57ad1cc19","subscription":{}}
    // {"techRole":"Tech user","firstName":"Test","lastName":"Test New","primaryEmail":"test@newtest.com","companyId":"73221c72-f87c-4519-8235-c4b57ad1cc19","subscription":{}}
    return this.http.post(`${this.apiUrl}users`, techUser);
  }

  archiveUser(archivedUserId, newAssignedUserId) {
    // Do you want to archive Test Test New?
    // {"ids":["d3937811-0f88-4d0c-a0d2-dc1494affb7d"]}
    return this.http.post(`${this.apiUrl}users/archive`, {
      "archivedUserId": archivedUserId,
      "newAssignedUserId": newAssignedUserId
    }).pipe(
      tap(data => {
        this.toastrService.success('The tech user has been successfully archived');
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  restoreUser(userId) {
    // {"userId":"d3937811-0f88-4d0c-a0d2-dc1494affb7d"}
    return this.http.post(`${this.apiUrl}users/restore`, { userId }).pipe(
      tap(data => {
        this.toastrService.success('User has been restore successfully.');
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  changePasswordRequest(userId: string) {
    // {"userId":"00dc909d-56ae-4dd7-a81f-4c22bf8f5ee6"}
    return this.http.post(`${this.apiUrl}users/changePasswordRequest`, {
      userId: userId
    });
  }

  verifyUserEmail(userEmail: string) {
    // {"email":"test@test.com"}
    return this.http.post(`${this.apiUrl}resend/verifyUserEmail`, {
      email: userEmail
    }).pipe(
      tap(data => {
        this.toastrService.success("Resend Welcome Email Sent Successfully");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }


}
