import { HttpClient } from '@angular/common/http';
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
    return this.http.delete(this.apiUrl + `devices/tags`, data);
  }

  public addTags(data) {
    return this.http.post(this.apiUrl + `devices/tags`, data).pipe(
      tap(data => {
        this.toastrService.success("The new tag has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
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
