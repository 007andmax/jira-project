import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../../components/billing/payments/class/payment';
import { map } from 'rxjs/operators';
 

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private apiUrl = environment.apiUrl;

  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }
 
  public getPayments(data) {
    return this.http.post(`${this.apiUrl}payments`,data).pipe(map((res: any) => res.map(item => new Payment(item))));
  }
}
