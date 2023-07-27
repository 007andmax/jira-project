import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommissionService } from '../commission.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CHANGE_COMMISSION_CONTRACT, DELETE_COMMISSION_CONTRACT } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, OnDestroy {
  agreementsCommissions: any;
  oldAgreementsCommissions: any;

  public confirmPopup = false;
  factItem = false;
  agreementsFlags = {
    commissionRateSetOldSalesBlockTime: false,
    commissionRateSetOldSalesBlockTimeExceeding: false,
    commissionRateSetOldSalesUserOrDeviceContract: false,
    commissionRateSetOldSalesUserOrDeviceContractExceeding: false
  };
  flag: string;
  rate: string;

  isModelDisplayModel = false;
  isBlockTimeModel = false;
  isRateHoursModel = false;
  perUserDeviceModel = false;

  loading = true;
  sub: Subscription = new Subscription();
  @ViewChild('commissionRate', { static: true }) commissionRate: ElementRef;
  @ViewChild('commissionRateHourInput', { static: true }) commissionRateHourInput: ElementRef;
  @ViewChild('commissionUserDeviceRateInput', { static: true }) commissionUserDeviceRateInput: ElementRef;
  @ViewChild('commissionRateContractsInput', { static: true }) commissionRateContractsInput: ElementRef;

  constructor(
    private commissionService: CommissionService,
    private toastrService: ToastrService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal
  ) { }


  ngOnInit() {
    this.flag = '';
    this.rate = '';
    this.getAgreementsRates();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_COMMISSION_CONTRACT) {
          this.removeContract()
        }
        if (this.confirmStateService.getConfirmAction() === CHANGE_COMMISSION_CONTRACT) {
          this.setAgreementRate()
        }
      }
    })
    this.sub.add(getConfirm);
  }

  getAgreementsRates() {
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
    this.isBlockTimeModel = false;
    this.isRateHoursModel = false;
    this.isModelDisplayModel = false;
    this.perUserDeviceModel = false;
    if (rate === 'blockTimeContractCommission') {
      this.isBlockTimeModel = true;
      this.commissionRate.nativeElement.value = this.agreementsCommissions.blockTimeContractCommission;
      this.agreementsCommissions.blockTimeContractCommission = this.commissionRate.nativeElement.value;
    } else if (rate === 'blockTimeContractCommissionExceeding') {
      this.isRateHoursModel = true;
      this.commissionRateHourInput.nativeElement.value = this.agreementsCommissions.blockTimeContractCommissionExceeding;
      this.agreementsCommissions.blockTimeContractCommissionExceeding = this.commissionRateHourInput.nativeElement.value;

    } else if (rate === 'userOrDeviceContractCommission') {
      this.perUserDeviceModel = true;
      this.commissionUserDeviceRateInput.nativeElement.value = this.agreementsCommissions.userOrDeviceContractCommission;
      this.agreementsCommissions.userOrDeviceContractCommission = this.commissionUserDeviceRateInput.nativeElement.value;
    } else if (this.rate === 'userOrDeviceContractCommissionExceeding') {
      this.isModelDisplayModel = true;
      this.commissionRateContractsInput.nativeElement.value = this.agreementsCommissions.userOrDeviceContractCommissionExceeding;
      this.agreementsCommissions.userOrDeviceContractCommissionExceeding = this.commissionRateContractsInput.nativeElement.value;
    }
  }

  setAgreementRate() {
    if (this.rate === 'blockTimeContractCommission') {
      this.agreementsCommissions.blockTimeContractCommission = this.commissionRate.nativeElement.value;
      // this.isBlockTime = false;
    } else if (this.rate === 'blockTimeContractCommissionExceeding') {
      this.agreementsCommissions.blockTimeContractCommissionExceeding = this.commissionRateHourInput.nativeElement.value;
    } else if (this.rate === 'userOrDeviceContractCommission') {
      this.agreementsCommissions.userOrDeviceContractCommission = this.commissionUserDeviceRateInput.nativeElement.value;
    } else if (this.rate === 'userOrDeviceContractCommissionExceeding') {
      this.agreementsCommissions.userOrDeviceContractCommissionExceeding = this.commissionRateContractsInput.nativeElement.value;
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
      if (this.factItem === true) {
        data[this.flag] = true;
        this.commissionService.setAgreementRates(data, true, 'Successfully Changed').subscribe(
          res => {
            this.oldAgreementsCommissions[this.rate] = data[this.rate];
            this.isModelDisplayModel = false;
          },
          error => {
            this.toastrService.error('Bad Request')
          }
        );
      } else {
        this.commissionService.setAgreementRates(data, false, 'Changed Successfully').subscribe(
          res => {
            this.oldAgreementsCommissions[this.rate] = data[this.rate];
            this.isModelDisplayModel = false;
          },
          error => {
            this.toastrService.error('Bad Request')
          }
        );
      }
    } else {
      this.commissionService.setAgreementRates(data, false, 'Saved Successfully').subscribe(
        res => {
          this.isModelDisplayModel = false;
          this.agreementsCommissions = res || {};
          this.oldAgreementsCommissions = Object.assign(
            {},
            this.agreementsCommissions
          );
        },
        error => {
          this.toastrService.error('Bad Request')
        }
      );
    }
  }

  removeContract() {
    if (this.rate === 'blockTimeContractCommission') {
      this.isBlockTimeModel = false;
      this.agreementsCommissions.blockTimeContractCommission = 0;
    } else if (this.rate === 'blockTimeContractCommissionExceeding') {
      this.isRateHoursModel = false;
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

    this.commissionService.setAgreementRates(data, false, 'Changed Successfully').subscribe(
      res => {
        this.isModelDisplayModel = false;
        this.agreementsCommissions = res || {};
        this.oldAgreementsCommissions = Object.assign(
          {},
          this.agreementsCommissions
        );
      },
      error => {
        this.toastrService.error('Bad Request')
      }
    );
  }

  confirmDelete(flag: string, rate: string) {
    this.flag = flag;
    this.rate = rate;
    // this.deletePopup = true;
    this.confirmStateService.setConfirmAction(DELETE_COMMISSION_CONTRACT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want this commission to fact old items?`;

  }

  confirmEdit() {
    if (
      !this.oldAgreementsCommissions[this.rate] &&
      this.oldAgreementsCommissions[this.rate] != 0
    ) {
      this.confirmStateService.setConfirmAction(CHANGE_COMMISSION_CONTRACT);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.message = `Do you want this commission to fact old items?`;

    } else {
      this.confirmPopup = false;
      this.factItem = false;
      this.setAgreementRate();
    }

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
