import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private apiUrl = environment.apiUrl;

  /**
   * Note api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }

  /**
   * Update note
   * @param id - id of note
   * @param data - note data for updated note
   */
  public getList(page) {
    return this.http.get(`${this.apiUrl}users/notifications?page=${page}&size=20&sort=date,desc`);
  }
  public getCount() {
    return this.http.get(`${this.apiUrl}users/notifications/count/unread`);
  }
  public markAsRead(id) {
    return this.http.put(`${this.apiUrl}users/notifications/${id}/read`, {});
  }
  public remove(id) {
    return this.http.delete(`${this.apiUrl}users/notifications/${id}`);
  }
  public markAsReadAll() {
    return this.http.put(`${this.apiUrl}users/notifications/read-all`, {});
  }
}
