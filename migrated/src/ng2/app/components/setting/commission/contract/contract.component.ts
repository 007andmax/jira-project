import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommissionService } from '../commission.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  agreementsCommissions: any;
  oldAgreementsCommissions: any;
  agreementsFlags = {
    commissionRateSetOldSalesBlockTime: false,
    commissionRateSetOldSalesBlockTimeExceeding: false,
    commissionRateSetOldSalesUserOrDeviceContract: false,
    commissionRateSetOldSalesUserOrDeviceContractExceeding: false
  };
  isModelDisplay = false;
  flag: string;
  rate: string;
  @ViewChild('commissionRate') commissionRate: ElementRef;

  constructor(
    private commissionService: CommissionService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getAgreementsRates();
  }

  getAgreementsRates() {
    this.commissionService.agreementRates().subscribe(
      res => {
        this.agreementsCommissions = res || {};
        this.oldAgreementsCommissions = Object.assign(
          {},
          this.agreementsCommissions
        );
      },
      error => {}
    );
  }

  editContract(flag, rate) {
    this.flag = flag;
    this.rate = rate;
    this.isModelDisplay = true;
    if(rate === 'blockTimeContractCommission'){
      this.commissionRate.nativeElement.value =  this.agreementsCommissions.blockTimeContractCommission
      this.agreementsCommissions.blockTimeContractCommission = this.commissionRate.nativeElement.value;
    }
  }

  setAgreementRate() {
    if(this.rate === 'blockTimeContractCommission'){
      this.agreementsCommissions.blockTimeContractCommission = this.commissionRate.nativeElement.value;
    }
    Object.keys(this.agreementsCommissions).forEach(key => {
      this.agreementsCommissions[key] = +this.agreementsCommissions[key];
    });

    var rates = this.agreementsCommissions;
    var data = {
      blockTimeContractCommission: rates.blockTimeContractCommission,
      blockTimeContractCommissionExceeding:
        rates.blockTimeContractCommissionExceeding,
      userOrDeviceContractCommission: rates.userOrDeviceContractCommission,
      userOrDeviceContractCommissionExceeding:
        rates.userOrDeviceContractCommissionExceeding
    };

    data = Object.assign({}, data, this.agreementsFlags);
    if (
      !this.oldAgreementsCommissions[this.rate] &&
      this.oldAgreementsCommissions[this.rate] != 0
    ) {
      if (confirm('Do you want this commission to fact old items?')) {
        data[this.flag] = true;
        this.commissionService.setAgreementRates(data, true).subscribe(res => {
          this.oldAgreementsCommissions[this.rate] = data[this.rate];
        });
      } else {
        this.commissionService.setAgreementRates(data, false).subscribe(res => {
          this.oldAgreementsCommissions[this.rate] = data[this.rate];
        });
      }
    } else {
      this.commissionService
        .setAgreementRates(data, false)
        .subscribe(res => {});
    }
  }
}
