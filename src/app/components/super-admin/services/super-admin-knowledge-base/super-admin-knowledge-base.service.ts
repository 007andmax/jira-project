import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminKnowledgeBaseService {

  private apiUrl = environment.apiUrl;

  //allUsers = [];

  /**
   * Users api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
  ) { }

  public getNews(page) {
    return this.http.get(this.apiUrl + `announcements?page=${page}&size=20`);
  }
  public deleteNews(id) {
    return this.http.delete(this.apiUrl + `announcements/${id}`).pipe(
      tap(data => {
        this.toastrService.success("The Announcement has been successfully deleted");
        this.appStateService.changeDetectorRef();
        return data;
      }, err => {
        this.toastrService.error("The error has occurred, please check your entries");
        this.appStateService.changeDetectorRef();
      }));
  }
  public editNews(id, data) {
    return this.http.put(this.apiUrl + `announcements/${id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The announcement has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }, err => {
        this.toastrService.error("The error has occurred, please check your entries");
        this.appStateService.changeDetectorRef();
      }));
  }
  public addNews(data) {
    return this.http.post(this.apiUrl + `announcements`, data).pipe(
      tap(data => {
        this.toastrService.success("The new announcement has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }, err => {
        this.toastrService.error("The error has occurred, please check your entries");
        this.appStateService.changeDetectorRef();
      }));
  }
}
