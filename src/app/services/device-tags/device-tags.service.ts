import { HttpClient } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceTagsService {

  private apiUrl = environment.apiUrl;

  /**
   * Companies api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService

  ) { }

  public getTags() {
    return this.http.get(this.apiUrl + `devices/tags`);
  }

  public deleteTags(data) {
    return this.http.delete(this.apiUrl + `devices/tags?ids=${data}`);
  }

  public unLinkDevice(data) {
    return this.http.post(this.apiUrl + `devices/tags/unlink`, data).pipe(
      tap(data => {
        this.toastrService.success("Tag has been successfully unlinked");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public linkDevice(data) {
    return this.http.post(this.apiUrl + `devices/tags/link`, data).pipe(
      tap(data => {
        this.toastrService.success("Tag has been successfully linked");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  public addTags(data) {
    return this.http.post(this.apiUrl + `devices/tags`, data).pipe(
      tap(data => {
        this.toastrService.success("The new tag has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }, err => {
        this.toastrService.error(err.error.error.message);
        this.appStateService.changeDetectorRef();
      }));
  }
  public editTags(data) {
    return this.http.put(this.apiUrl + `devices/tags`, data).pipe(
      tap(data => {
        this.toastrService.success("Tag has been successfully edited");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
}
