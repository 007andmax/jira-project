import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DefaultServices } from '../../components/billing/default-services/class/default-service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DefaultServicesService {

  private apiUrl = environment.apiUrl;
 
  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
   
  ) { }
  public getDefaultServices(){
    return this.http.get(this.apiUrl + `services/getDefaultServices`).pipe(map((data: any) => data.map(item => new DefaultServices(item))));
  }
}
