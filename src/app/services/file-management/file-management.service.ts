import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  private apiUrl = environment.apiUrl;

  /**
   * Product api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService

  ) { }

  public getFileManagement(categoryId = null) {
    return this.http.get(`${this.apiUrl}file-management${categoryId ? '?categoryId=' + categoryId : ''}`)
  }
  public downloadFile(url) {
    return this.http.get(`${this.apiUrl}${url}`)
  }

  public addFile(data) {
    return this.http.post(`${this.apiUrl}file-management/files`, data)
  }
  public downloadPdf(url) {
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
      }), responseType: 'blob'
    }).pipe(
      tap(data => data));
  }
}
