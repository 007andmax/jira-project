import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class TechUsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers() {
    // Tech users
    // accountType: "TECH"
    return this.http.get(`${this.apiUrl}users`);
  }

  getRoleNames() {
    // account type
    return this.http.get(`${this.apiUrl}settings/companyProfile/getRoleNames`);
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

  saveUsersEmailNotifications(uId: string, emailNotification) {
    // checked save notification button (dev url)
    // {"newDevice":true,"scheduleChanged":false,"clientCompanyUpdated":false,"ticketCreated":true,"myTicketUpdated":true}
    return this.http.put(
      `${this.apiUrl}settings/userProfile/saveUsersEmailNotifications?userId=${uId}`,
      emailNotification
    );
  }

  createUser(techUser: any) {
    // {"techRole":"Help desk user","firstName":"Today Test","lastName":"Test","primaryEmail":"today@test.com","companyId":"73221c72-f87c-4519-8235-c4b57ad1cc19","subscription":{}}
    // {"techRole":"Tech user","firstName":"Test","lastName":"Test New","primaryEmail":"test@newtest.com","companyId":"73221c72-f87c-4519-8235-c4b57ad1cc19","subscription":{}}
    return this.http.post(`${this.apiUrl}users`, techUser);
  }

  archiveUser(ids: any[]) {
    // Do you want to archive Test Test New?
    // {"ids":["d3937811-0f88-4d0c-a0d2-dc1494affb7d"]}
    return this.http.post(`${this.apiUrl}users/archive`, { ids });
  }

  restoreUser(userId) {
    // {"userId":"d3937811-0f88-4d0c-a0d2-dc1494affb7d"}
    return this.http.post(`${this.apiUrl}users/restore`, { userId });
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
    });
  }


}
