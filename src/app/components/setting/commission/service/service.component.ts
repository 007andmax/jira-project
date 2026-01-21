import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommissionService } from '../../../../services/commission/commission.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CHANGE_COMMISSION_SERVICE, DELETE_COMMISSION_SERVICE } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { ServiceCommissionFilter } from './class/service-commission-filter';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit, OnDestroy {
  filter: ServiceCommissionFilter = new ServiceCommissionFilter();
  loading = true;
  selectedIdx = -1;
  selectedSpecIdx = -1;
  companyId = '';
  services: any;
  public deleteServicePopup = false;
  service: any;
  isSpecialService: boolean;
  factItem = false;
  specialService: any[] = [];
  rate: any;
  id: string;
  sub: Subscription = new Subscription();
  constructor(
    private commissionService: CommissionService,
    private toastrService: ToastrService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal
  ) {
    this.getCurrentCompany();
  }

  ngOnInit() {
    this.getServices();
    this.getSpecialService();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data != null) {
        if (this.confirmStateService.getConfirmAction() === DELETE_COMMISSION_SERVICE) {
          if (data) {
            this.deleteServicePopup = false;
            this.removeServiceRate()
          }
        }
        if (this.confirmStateService.getConfirmAction() === CHANGE_COMMISSION_SERVICE) {
          if (data == true) {
            this.factItem = true; this.setServiceRate()
          }
          if (data == false) {
            this.factItem = false; this.setServiceRate()
          }
        }
      }
    })
    this.sub.add(getConfirm);
  }

  onFilter(field) {
    this.filter.onFilter(field, this.services);
  }

  onFilterSpecial(field) {
    this.filter.onFilter(field, this.specialService);
  }

  /**
   * get current company
   */
  getCurrentCompany(): any {
    this.commissionService
      .getCurrentCompany()
      .pipe(map(res => res))
      .subscribe((res: any) => {
        this.companyId = res.id;
      });
  }

  /**
   * get services
   */
  getServices() {
    this.commissionService.getDefaultServices().subscribe(
      res => {
        this.loading = false;
        this.services = res.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        res.forEach(ele => {
          if (ele) {
            ele.commissionRate = ele.commissionRate
              ? ele.commissionRate.toFixed(2)
              : ele.commissionRate;
          }
        });
      },
      error => {
        this.loading = false;
      }
    );
  }

  /**
   * special services
   */
  getSpecialService() {
    this.commissionService.getSpecialServices().subscribe(
      (res: any[]) => {
        this.loading = false;
        if (res && res.length > 0) {
          res.map(el => {
            el.services.filter(service => {
              if (!service.basedOnDefault) {
                service.commissionRate = service.commissionRate
                  ? service.commissionRate.toFixed(2)
                  : service.commissionRate;
                this.specialService.push(service);
              }
            });
          });
          this.specialService.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
            1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  editService(i: number) {
    this.selectedIdx = i;
  }

  editSpecService(i: number) {
    this.selectedSpecIdx = i;
  }

  /**
   * set service rate based on params
   * @param rate
   * @param id
   * @param service
   * @param isSpecialService
   */
  setServiceRate() {
    if (this.rate || this.rate === 0) {
      var data = {
        rate: this.rate,
        setForOldExpenses: false
      };

      if (this.service.commissionRate === null) {
        if (this.factItem === true) {
          data.setForOldExpenses = true;
        }
      }
      this.commissionService
        .setServiceRate(this.id, data.rate, data.setForOldExpenses)
        .subscribe(
          (res: any) => {
            this.confirmStateService.initRequest(false);
            this.service.commissionRate =
              res && res.commissionRate
                ? res.commissionRate.toFixed(2)
                : res.commissionRate;
            this.isSpecialService
              ? (this.selectedSpecIdx = -1)
              : (this.selectedIdx = -1);
          },
          error => {
            this.confirmStateService.initRequest(false);
            this.toastrService.error(`Error Occurred, ${error}`);
          }
        );
    } else {
      this.selectedIdx = -1;
    }
  }

  /**
   * set service rate based on params
   * @param i 
   * @param service 
   * @param isSpecialService 
   */
  removeServiceRate() {
    if (this.service && this.service.commissionRate) {
      const id = !this.isSpecialService ? this.service.versionedId.id : this.service.id;
      this.commissionService.setServiceRate(id, '0', false).subscribe(
        res => {
          this.confirmStateService.initRequest(false);
          this.service.commissionRate = null;
          this.isSpecialService
            ? (this.selectedSpecIdx = -1)
            : (this.selectedIdx = -1);
        },
        error => {
          this.confirmStateService.initRequest(false);
          this.toastrService.error(`Error Occurred, ${error}`);
        }
      );
    }
  }
  confirmServiceDelete(i, service: any, isSpecialService: boolean) {
    this.service = service;
    this.isSpecialService = isSpecialService;
    if (this.service && this.service.commissionRate) {
      this.deleteServicePopup = true;
      this.confirmStateService.setConfirmAction(DELETE_COMMISSION_SERVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.message = `Are you sure you want ${this.service.name} commission rate to zero?`;

    }
  }

  confirmServiceEdit(rate, id: string, service: any, isSpecialService: boolean) {
    this.rate = rate;
    this.id = id;
    this.service = service;
    this.isSpecialService = isSpecialService;
    if (this.service.commissionRate === null) {
      this.confirmStateService.setConfirmAction(CHANGE_COMMISSION_SERVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.header = `Apply Commission`;
      modalRef.componentInstance.message = `Do you want the commission to be applied old items?`;

    } else {
      this.setServiceRate();
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
