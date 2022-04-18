import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupportPageCategoriesService {

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

  public searchCategory(someText, offset) {
    return this.http.get(this.apiUrl + `support/categories/filtered?searchText=${someText}&size=10&offset=${offset}`);
  }
  public addCategory(data) {
    return this.http.post(this.apiUrl + 'support/categories', data).pipe(
      tap(data => {
        this.toastrService.success("Category created successfully");
        this.appStateService.changeDetectorRef();
        return data;
      }, err => of(err)));
  }
  public saveContent(category_id, data, textAlert) {
    return this.http.put(this.apiUrl + 'support/categories/content/' + category_id, data).pipe(
      tap(data => {
        this.toastrService.success(textAlert);
        this.appStateService.changeDetectorRef();
        return data;
      }, err => of(err)));
  }
  public editCategory(category_id, data) {
    return this.http.put(this.apiUrl + 'support/categories/' + category_id, data).pipe(
      tap(data => {
        this.toastrService.success("Category updated successfully");
        this.appStateService.changeDetectorRef();
        return data;
      }, err => of(err)));
  }
  public removeCategory(category_id) {
    return this.http.delete(this.apiUrl + 'support/categories/' + category_id).pipe(
      tap(data => {
        this.toastrService.success("Category deleted successfully");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public moveCategory(category_id, index) {
    return this.http.put(this.apiUrl + 'support/categories/' + category_id, {
      order: index
    })
  }
  public getCategories(role) {
    if (role === "SUPER_ADMIN") return this.http.get(this.apiUrl + 'support/categories');
    return this.http.get(this.apiUrl + 'support/categories?type=PUBLISHED');

  }
  public getTags() {
    return this.http.get(this.apiUrl + 'support/tags');
  }
  public addTag(data) {
    return this.http.post(this.apiUrl + 'commonTags', data);
  }
  public editTag(id, name) {
    return this.http.put(this.apiUrl + `commonTags/setWordForTag?tagId=${id}&word=${name}`, {});
  }
  public removeTag(id) {
    return this.http.delete(this.apiUrl + 'commonTags/removeTag?tagId=' + id);
  }
  public getContentCategory(category_id) {
    return this.http.get(this.apiUrl + 'support/categories/' + category_id);
  }
}
