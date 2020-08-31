import { Component, OnInit } from '@angular/core';
import { CommissionService } from '../commission.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  loading = false;
  selectedIdx = -1;
  selectedSpecIdx = -1;
  companyId = '';
  services: any;
  specialService: any[] = [];
  public deleteServicePopup = false;	
  public confirmServicePopup = false;	
  service: any;	
  isSpecialService: boolean;	
  factItem = false;
  rate: any;	
  id: string;

  constructor(
    private commissionService: CommissionService,
    private toastrService: ToastrService
  ) {
    this.getCurrentCompany();
  }

  ngOnInit() {
    this.getServices();
    this.getSpecialService();
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
    this.loading = true;$(".loading").css("display", "block");
    this.commissionService.getDefaultServices().subscribe(
      res => {
        this.loading = false;$(".loading").css("display", "none");
        this.services = res;
        res.forEach(ele => {
          if (ele) {
            ele.commissionRate = ele.commissionRate
              ? ele.commissionRate.toFixed(2)
              : ele.commissionRate;
          }
        });
      },
      error => {
        this.loading = false;$(".loading").css("display", "none");
      }
    );
  }

  /**
   * special services
   */
  getSpecialService() {
    this.loading = true;$(".loading").css("display", "block");
    this.commissionService.getSpecialServices().subscribe(
      (res: any[]) => {
        this.loading = false;$(".loading").css("display", "none");
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
        }
      },
      error => {
        this.loading = false;$(".loading").css("display", "none");
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
        setForOldExpenses: this.factItem
      };
      this.loading = true;$(".loading").css("display", "block");
      this.commissionService
        .setServiceRate(this.id, data.rate, data.setForOldExpenses)
        .subscribe(
          (res: any) => {
            this.loading = false;$(".loading").css("display", "none");
            this.toastrService.success('Rate Changed Successfully.');
            this.service.commissionRate =
              res && res.commissionRate
                ? res.commissionRate.toFixed(2)
                : res.commissionRate;
            this.isSpecialService
              ? (this.selectedSpecIdx = -1)
              : (this.selectedIdx = -1);
          },
          error => {
            this.toastrService.error(`Error Occurred, ${error}`);
            this.loading = false;$(".loading").css("display", "none");
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
          this.loading = true;$(".loading").css("display", "block");	
          const id = !this.isSpecialService ? this.service.versionedId.id : this.service.id;	
          this.commissionService.setServiceRate(id, '0', false).subscribe(	
            res => {	
              this.loading = false;$(".loading").css("display", "none");	
              this.toastrService.success('Rate Changed Successfully.');	
              this.service.commissionRate = null;

            this.isSpecialService
              ? (this.selectedSpecIdx = -1)
              : (this.selectedIdx = -1);
          },
          error => {
            this.toastrService.error(`Error Occurred, ${error}`);
            this.loading = false;$(".loading").css("display", "none");
          }
        );
      }
    }
    confirmServiceDelete(i, service: any, isSpecialService: boolean){	
      this.service = service;	
      this.isSpecialService = isSpecialService;	
      if (this.service && this.service.commissionRate) {	
        this.deleteServicePopup = true;	
      }	
    }	
  	
    confirmServiceEdit(rate, id: string, service: any, isSpecialService: boolean){	
      this.rate = rate;	
      this.id = id;	
      this.service = service;	
      this.isSpecialService = isSpecialService;	
      if (this.service.commissionRate === null) {	
        this.confirmServicePopup = true;	
      } else {	
        this.confirmServicePopup = false;	
        this.setServiceRate();	
      }	
    }
}
