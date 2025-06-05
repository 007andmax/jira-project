import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { AppStateService } from "src/app/states/app/app-state.service";

@Injectable({
  providedIn: "root"
})
export class GlNumberService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService) { }

  /**
   * saved gl number
   * @param glDetail 
   */
  saveGL(glDetail: any) {
    return this.http.post(`${this.apiUrl}glNumber`, glDetail).pipe(
      tap(data => {
        this.toastrService.success("GL number successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  validateForRemove(id) {
    return this.http.get(`${this.apiUrl}glNumber/validate/${id}`);
  }

  /**
   * edit gl number
   * @param glDetail 
   */
  editGL(glDetail: any) {
    return this.http.put(`${this.apiUrl}glNumber`, glDetail);
  }

  /**
   * delete 
   * @param id 
   */
  delete(id: string) {
    return this.http.delete(`${this.apiUrl}glNumber/${id}`);
  }

  /**
   * get gl number
   */
  getGL() {
    return this.http.get(`${this.apiUrl}glNumber`);
  }
}
