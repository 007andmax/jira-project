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
  flag: string;
  rate: string;
  isModelDisplay = false;
  loading = false;
  @ViewChild('commissionRate') commissionRate: ElementRef;

  constructor(
    private commissionService: CommissionService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.flag = '';
    this.rate = '';
    this.getAgreementsRates();
  }

  getAgreementsRates() {
    this.loading = true;
    this.commissionService.agreementRates().subscribe(
      res => {
        this.loading = false;
        this.agreementsCommissions = res || {};
        this.oldAgreementsCommissions = Object.assign(
          {},
          this.agreementsCommissions
        );
      },
      error => {
        this.loading = false;
      }
    );
  }

  editContract(flag: string, rate: string) {
    this.flag = flag;
    this.rate = rate;
    this.isModelDisplay = true;
    if (rate === 'blockTimeContractCommission') {
      this.commissionRate.nativeElement.value = this.agreementsCommissions.blockTimeContractCommission;
      this.agreementsCommissions.blockTimeContractCommission = this.commissionRate.nativeElement.value;
    } else if (rate === 'blockTimeContractCommissionExceeding') {
      this.commissionRate.nativeElement.value = this.agreementsCommissions.blockTimeContractCommissionExceeding;
      this.agreementsCommissions.blockTimeContractCommissionExceeding = this.commissionRate.nativeElement.value;
    } else if (rate === 'userOrDeviceContractCommission') {
      this.commissionRate.nativeElement.value = this.agreementsCommissions.userOrDeviceContractCommission;
      this.agreementsCommissions.userOrDeviceContractCommission = this.commissionRate.nativeElement.value;
    } else if (this.rate === 'userOrDeviceContractCommissionExceeding') {
      this.commissionRate.nativeElement.value = this.agreementsCommissions.userOrDeviceContractCommissionExceeding;
      this.agreementsCommissions.userOrDeviceContractCommissionExceeding = this.commissionRate.nativeElement.value;
    }
  }

  setAgreementRate() {
    if (this.rate === 'blockTimeContractCommission') {
      this.agreementsCommissions.blockTimeContractCommission = this.commissionRate.nativeElement.value;
    } else if (this.rate === 'blockTimeContractCommissionExceeding') {
      this.agreementsCommissions.blockTimeContractCommissionExceeding = this.commissionRate.nativeElement.value;
    } else if (this.rate === 'userOrDeviceContractCommission') {
      this.agreementsCommissions.userOrDeviceContractCommission = this.commissionRate.nativeElement.value;
    } else if (this.rate === 'userOrDeviceContractCommissionExceeding') {
      this.agreementsCommissions.userOrDeviceContractCommissionExceeding = this.commissionRate.nativeElement.value;
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
        this.commissionService.setAgreementRates(data, true).subscribe(
          res => {
            this.toastrService.success('successfully changed')
            this.oldAgreementsCommissions[this.rate] = data[this.rate];
            this.isModelDisplay = false;
            this.loading = false;
          },
          error => {
            this.toastrService.error('Bad Request')
            this.loading = false;
          }
        );
      } else {
        this.commissionService.setAgreementRates(data, false).subscribe(
          res => {
            this.toastrService.success('changed successfully')
            this.oldAgreementsCommissions[this.rate] = data[this.rate];
            this.isModelDisplay = false;
            this.loading = false;
          },
          error => {
            this.toastrService.error('Bad Request')
            this.loading = false;
          }
        );
      }
    } else {
      this.loading = true;
      this.commissionService.setAgreementRates(data, false).subscribe(
        res => {
          this.toastrService.success('saved successfully')
          this.isModelDisplay = false;
          this.loading = false;
          this.agreementsCommissions = res || {};
          this.oldAgreementsCommissions = Object.assign(
            {},
            this.agreementsCommissions
          );
        },
        error => {
          this.toastrService.error('Bad Request')
          this.loading = false;
        }
      );
    }
  }

  removeContract(flag: string, rate: string) {
    this.flag = flag;
    this.rate = rate;
    if (
      confirm(
        'Are tou want to change rate to be zero & this rate to fact old items?'
      )
    ) {
      if (this.rate === 'blockTimeContractCommission') {
        this.agreementsCommissions.blockTimeContractCommission = 0;
      } else if (this.rate === 'blockTimeContractCommissionExceeding') {
        this.agreementsCommissions.blockTimeContractCommissionExceeding = 0;
      } else if (this.rate === 'userOrDeviceContractCommission') {
        this.agreementsCommissions.userOrDeviceContractCommission = 0;
      } else if (this.rate === 'userOrDeviceContractCommissionExceeding') {
        this.agreementsCommissions.userOrDeviceContractCommissionExceeding = 0;
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

      this.loading = true;
      this.commissionService.setAgreementRates(data, false).subscribe(
        res => {
          this.toastrService.success('changed successfully')
          this.isModelDisplay = false;
          this.loading = false;

          this.agreementsCommissions = res || {};
          this.oldAgreementsCommissions = Object.assign(
            {},
            this.agreementsCommissions
          );
        },
        error => {
          this.toastrService.error('Bad Request')
          this.loading = false;
        }
      );
    }
  }
}
