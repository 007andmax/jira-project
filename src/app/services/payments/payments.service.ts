import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../../components/billing/payments/class/payment';
import { map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';


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
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService
  ) { }
  public editPayments(data) {
    return this.http.put(`${this.apiUrl}payments/edit`, data);
  }
  public refundPayments(data) {
    return this.http.put(`${this.apiUrl}payments/refund`, data);
  }
  public getPayments(data) {
    return this.http.post(`${this.apiUrl}payments`, data).pipe(map((res: any) => res.map(item => new Payment(item))));
  }
  public deletePayment(data) {
    return this.http.put(`${this.apiUrl}payments/delete?paymentId=${data.id}`, {}).pipe(
      tap(data => {
        this.toastrService.success("The payment has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
}
