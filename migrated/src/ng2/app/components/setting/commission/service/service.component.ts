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
  services: any;
  loading = false;
  selectedIdx = -1;
  companyId = '';

  constructor(
    private commissionService: CommissionService,
    private toastrService: ToastrService
  ) {
    this.getCurrentCompany();
  }

  ngOnInit() {
    this.getServices();
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
        this.services = res;
        res.forEach(ele => {
          if (ele) {
            if (ele.company.id === this.companyId) {
              console.log('same');
            } else {
              console.log('unsame');
            }
          }
        });
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  editService(i: number) {
    this.selectedIdx = i;
  }

  setServiceRate(rate, id: string, service: any) {
    if (rate || rate === 0) {
      var data = {
        rate: rate,
        setForOldExpenses: false
      };

      if (service.commissionRate === null) {
        if (confirm('Do you want this commission to fact old items?')) {
          data.setForOldExpenses = true;
          this.commissionService
            .setServiceRate(id, data.rate, data.setForOldExpenses)
            .subscribe(
              res => {
                this.selectedIdx = -1;
                this.services.forEach(cat => {
                  if (cat.versionedId.id === id) {
                    cat.commissionRate = rate;
                  }
                });
              },
              error => {}
            );
        } else {
          this.commissionService
            .setServiceRate(id, data.rate, data.setForOldExpenses)
            .subscribe(
              res => {
                this.selectedIdx = -1;
                service.commissionRate = rate;
                this.services.forEach(cat => {
                  if (cat.versionedId.id === id) {
                    cat.commissionRate = rate;
                  }
                });
              },
              error => {}
            );
        }
      } else {
        this.commissionService
          .setServiceRate(id, data.rate, data.setForOldExpenses)
          .subscribe(
            res => {
              this.services.forEach(cat => {
                if (cat.versionedId.id === id) {
                  cat.commissionRate = rate;
                }
              });
              this.selectedIdx = -1;
            },
            error => {}
          );
      }
    } else {
      this.selectedIdx = -1;
    }
  }
}
