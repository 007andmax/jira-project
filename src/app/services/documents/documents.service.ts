import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {

  private apiUrl = environment.apiUrl;

  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService

  ) { }

  /**
   * Get devices from company
   * @param companyId - id of company
   */
  public getTemplateCategories(isDefault) {
    return this.http.get(this.apiUrl + `documents/categories?documentType=TEMPLATE&defaultTemplate=${isDefault}`);
  }
  public checkTitle(title, someDocumentId = null) {
    return this.http.get(this.apiUrl + `documents/checkTitleUnique?title=${title}${someDocumentId ? `&documentId=${someDocumentId}` : ''}`);
  }
  public removeDocument(id) {
    return this.http.delete(this.apiUrl + `documents/${id}`);
  }
  public removeDocumentAttachment(id) {
    return this.http.delete(this.apiUrl + `file/${id}`);
  }
  public removeCategories(id) {
    return this.http.delete(this.apiUrl + `documents/categories/${id}`);
  }
  public addCategories(name) {
    return this.http.post(this.apiUrl + `documents/categories`, { name: name });
  }
  public editNameCategory(id, name) {
    return this.http.put(this.apiUrl + `documents/categories/${id}`, { name: name });
  }
  public getCategories() {
    return this.http.get(this.apiUrl + `documents/categories`);
  }
  public getDocument(id) {
    return this.http.get(this.apiUrl + `documents/${id}`);
  }
  public getHistory(id, page) {
    return this.http.get(this.apiUrl + `documents/${id}/history?page=${page}&size=10`);
  }
  public add(data) {
    return this.http.post(this.apiUrl + `documents`, data);
  }
  public edit(id, data) {
    return this.http.put(this.apiUrl + `documents/${id}`, data)
  }
  public filterDocuments(data) {
    return this.http.post(this.apiUrl + `documents/filtered`, data);
  }
  public getList() {
    return this.http.get(this.apiUrl + `documents`);
  }
}
