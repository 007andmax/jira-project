import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {


  private apiUrl = environment.apiUrl;
 
  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }

  public getConstants(){

    return this.http.get(this.apiUrl + `/data/getConstants`);
    
  }
 
}
