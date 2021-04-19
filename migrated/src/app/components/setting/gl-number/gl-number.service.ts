import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class GlNumberService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * saved gl number
   * @param glDetail 
   */
  saveGL(glDetail: any) {
    return this.http.post(`${this.apiUrl}glNumber`, glDetail);
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
