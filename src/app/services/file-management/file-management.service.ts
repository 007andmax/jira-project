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

  public getFileManagement(categoryId = null, customerCompanyRoot = null) {
    let data = {};
    if (categoryId) data["categoryId"] = categoryId;
    if (customerCompanyRoot) data["customerCompanyRoot"] = customerCompanyRoot;
    let getParams = new URLSearchParams(data).toString();
    console.log("getParams", getParams);
    return this.http.get(`${this.apiUrl}file-management?${getParams}`)
  }
  public removeFile(fileId) {
    return this.http.delete(`${this.apiUrl}file-management/files/${fileId}`).pipe(
      tap(data => {
        this.toastrService.success("The File has been successfully deleted");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public removeCategory(categoryId) {
    return this.http.delete(`${this.apiUrl}file-management/categories/${categoryId}`).pipe(
      tap(data => {
        this.toastrService.success("The category has been successfully deleted");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public downloadFile(url) {
    return this.http.get(`${this.apiUrl}${url}`)
  }
  public getTags(page, partWord) {
    return this.http.get(`${this.apiUrl}commonTags/filter?page=${page}&size=20&partWord=${partWord}&defaultTag=FILE_TAG`)
  }
  public addFile(data) {
    return this.http.post(`${this.apiUrl}file-management/files`, data)
  }
  public addCategory(data) {
    return this.http.post(`${this.apiUrl}file-management/categories`, data).pipe(
      tap(data => {
        this.toastrService.success("The new category has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editCategory(id, data) {
    return this.http.put(`${this.apiUrl}file-management/categories/${id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The category has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editFile(id, data) {
    return this.http.put(`${this.apiUrl}file-management/files/${id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The file has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
