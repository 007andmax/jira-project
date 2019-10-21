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

  getCurrentCompany(): any {
    this.commissionService
      .getCurrentCompany()
      .pipe(map(res => res))
      .subscribe((res: any) => {
        this.companyId = res.id;
      });
  }

  getServices() {
    this.loading = true;
    this.commissionService.getDefaultServices().subscribe(
      res => {
        this.loading = false;
        this.services = res;
        res.forEach(ele => {
          if (ele) {
            ele.commissionRate = ele.commissionRate
              ? ele.commissionRate.toFixed(2)
              : ele.commissionRate;
            // if (ele.company.id === this.companyId) {
            //   console.log('same');
            // } else {
            //   console.log('unsame');
            // }
          }
        });
      },
      error => {
        this.loading = false;
      }
    );
  }

  getSpecialService() {
    this.loading = true;
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

  setServiceRate(rate, id: string, service: any, isSpecialService: boolean) {
    if (rate || rate === 0) {
      var data = {
        rate: rate,
        setForOldExpenses: false
      };

      if (service.commissionRate === null) {
        if (confirm('Do you want this commission to fact old items?')) {
          data.setForOldExpenses = true;
          this.loading = true;
          this.commissionService
            .setServiceRate(id, data.rate, data.setForOldExpenses)
            .subscribe(
              (res: any) => {
                this.loading = false;
                this.toastrService.success('Rate changed successfully.');
                service.commissionRate =
                  res && res.commissionRate
                    ? res.commissionRate.toFixed(2)
                    : res.commissionRate;
                isSpecialService
                  ? (this.selectedSpecIdx = -1)
                  : (this.selectedIdx = -1);

                // if (isSpecialService && this.specialService.length > 0) {
                //   // this.specialService.forEach(ss => {
                //   //   if (service.id === ss.id) {
                //   //     service.commissionRate = data.rate;
                //   //   }
                //   // });

                //   this.selectedSpecIdx = -1;
                // } else {
                //   // this.services.forEach(cat => {
                //   //   if (cat.versionedId.id === id) {
                //   //     cat.commissionRate = rate;
                //   //   }
                //   // });
                //   this.selectedIdx = -1;
                // }
              },
              error => {
                this.toastrService.error(`Error occurred, ${error}`);
                this.loading = false;
              }
            );
        } else {
          this.loading = true;
          this.commissionService
            .setServiceRate(id, data.rate, data.setForOldExpenses)
            .subscribe(
              (res: any) => {
                this.loading = false;
                this.toastrService.success('Rate changed successfully.');
                service.commissionRate =
                  res && res.commissionRate
                    ? res.commissionRate.toFixed(2)
                    : res.commissionRate;
                isSpecialService
                  ? (this.selectedSpecIdx = -1)
                  : (this.selectedIdx = -1);

                // if (isSpecialService && this.specialService.length > 0) {
                //   // this.specialService.forEach(ss => {
                //   //   if (service.id === ss.id) {
                //   //     service.commissionRate = data.rate;
                //   //   }
                //   // });
                //   service.commissionRate = res.commissionRate.toFixed(2);
                //   this.selectedSpecIdx = -1;
                // } else {
                //   service.commissionRate = res.commissionRate.toFixed(2);
                //   // this.services.forEach(cat => {
                //   //   if (cat.versionedId.id === id) {
                //   //     cat.commissionRate = rate;
                //   //   }
                //   // });
                //   this.selectedIdx = -1;
                // }
              },
              error => {
                this.toastrService.error(`Error occurred, ${error}`);
                this.loading = false;
              }
            );
        }
      } else {
        this.loading = true;
        this.commissionService
          .setServiceRate(id, data.rate, data.setForOldExpenses)
          .subscribe(
            (res: any) => {
              this.loading = false;
              this.toastrService.success('Rate changed successfully.');
              service.commissionRate =
                res && res.commissionRate
                  ? res.commissionRate.toFixed(2)
                  : res.commissionRate;
              isSpecialService
                ? (this.selectedSpecIdx = -1)
                : (this.selectedIdx = -1);

              // if (isSpecialService && this.specialService.length > 0) {
              //   service.commissionRate = res.commissionRate.toFixed(2);
              //   // this.specialService.forEach(ss => {
              //   //   if (service.id === ss.id) {
              //   //     service.commissionRate = data.rate;
              //   //   }
              //   // });
              //   this.selectedSpecIdx = -1;
              // } else {
              //   // this.services.forEach(cat => {
              //   //   if (cat.versionedId.id === id) {
              //   //     cat.commissionRate = rate;
              //   //   }
              //   // });
              //   service.commissionRate = res.commissionRate.toFixed(2);
              //   this.selectedIdx = -1;
              // }
            },
            error => {
              this.toastrService.error(`Error occurred, ${error}`);
              this.loading = false;
            }
          );
      }
    } else {
      this.selectedIdx = -1;
    }
  }

  removeServiceRate(i, service: any, isSpecialService: boolean) {
    if (service && service.commissionRate) {
      if (confirm(`Do you want ${service.name} commission rate to zero?`)) {
        this.loading = true;
        const id = !isSpecialService ? service.versionedId.id : service.id;
        this.commissionService.setServiceRate(id, '0', false).subscribe(
          res => {
            this.loading = false;
            this.toastrService.success('Rate changed successfully.');
            service.commissionRate = null;

            isSpecialService
              ? (this.selectedSpecIdx = -1)
              : (this.selectedIdx = -1);

            // if (isSpecialService && this.specialService.length > 0) {

            //   // this.specialService.forEach(ss => {
            //   //   if (service.id === ss.id) {
            //   //     service.commissionRate = null;
            //   //   }
            //   // });
            //   this.selectedSpecIdx = -1;
            // } else {
            //   // this.services.forEach(cat => {
            //   //   if (cat.versionedId.id === id) {
            //   //     cat.commissionRate = null;
            //   //   }
            //   // });
            //   service.commissionRate = null;
            //   this.selectedIdx = -1;
            // }
          },
          error => {
            this.toastrService.error(`Error occurred, ${error}`);
            this.loading = false;
          }
        );
      }
    }
  }
}
