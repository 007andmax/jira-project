import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AppStateService } from '../../states/app/app-state.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiKeysService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService) { }

  /**
   * get company profile
   */
  getKyes() {
    return this.http.get(`${this.apiUrl}api/keys/all`);
  }
  public add(data) {
    return this.http.post(this.apiUrl + `api/keys`, data).pipe(
      tap(data => {
        this.toastrService.success("The new key has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public remove(data) {
    return this.http.delete(this.apiUrl + `api/keys`, data).pipe(
      tap(data => {
        this.toastrService.success("The new key has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public edit(id, data) {
    return this.http.put(this.apiUrl + `api/keys/${id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The new key has been successfully edited");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
}
