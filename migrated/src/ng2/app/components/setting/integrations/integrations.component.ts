import { Component, OnInit } from '@angular/core';
import { IntegrationsService } from './integrations.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {
  loading = false;
  show = false;
  paymentInfo: {
    id: string;
    stripePublicKey: null;
    stripeSecretKey: null;
    paypalClientId: null;
    paypalSecretId: null;
    paymentsEnabled: false;
  };

  constructor(
    private integrationsService: IntegrationsService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getSetting();
  }

  turnOnCCPayment(event: any) {
    this.show = event.target.checked;
    this.paymentInfo.paymentsEnabled = event.target.checked;
    this.savePaymentInfo();
  }

  getSetting() {
    this.loading = true;
    this.integrationsService.settings().subscribe(
      (res: any) => {
        this.loading = false;
        this.paymentInfo = res;
      },
      error => {
        this.loading = false;
      }
    );
  }

  savePaymentInfo() {
    this.loading = true;

    this.integrationsService.savePaymentInfo(this.paymentInfo).subscribe(
      (res: any) => {
        this.loading = false;
        this.paymentInfo = res;
        this.toastrService.success('Payment Info changed successfully.');
      },
      error => {
        this.loading = false;
        this.toastrService.error(`Error occured,  ${error}`);
      }
    );
  }

  changePaymentInfo() {
    if (
      !this.paymentInfo.paypalClientId &&
      !this.paymentInfo.paypalSecretId &&
      !this.paymentInfo.stripePublicKey &&
      !this.paymentInfo.stripeSecretKey
    ) {
      const confirmMesage =
        'Changes would be cancelled and credit card accepting switched off';

      if (confirm(confirmMesage)) {
        this.paymentInfo.paymentsEnabled = false;
        this.savePaymentInfo();
      }
    } else {
      this.savePaymentInfo();
    }
  }
}
