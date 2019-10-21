import { Component, OnInit } from '@angular/core';
import { CommissionService, ICategory } from '../commission.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  loading = false;
  categories: any;
  edit = false;
  selectedIdx = -1;

  constructor(
    private commissionService: CommissionService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.loading = true;
    this.commissionService.getCategories().subscribe(
      res => {
        if (res) {
        }
        this.loading = false;
        this.categories = res;
      },
      error => {
        this.loading = false;
      }
    );
  }

  editProduct(i: number) {
    this.selectedIdx = i;
  }

  setCategoryRate(rate, id: string, category: any) {
    let data = {
      rate: '',
      setForOldExpenses: false
    };

    if (rate || rate === 0) {
      data = {
        rate: rate,
        setForOldExpenses: false
      };

      if (category.commissionRate === null) {
        if (confirm('Do you want this commission to fact old items?')) {
          data.setForOldExpenses = true;
          this.commissionService
            .setCategoryRate(id, data.rate, data.setForOldExpenses)
            .subscribe(
              res => {
                this.selectedIdx = -1;
                this.categories.forEach(cat  => {
                    if(cat.id === id){
                      cat.commissionRate = rate;
                    }
                });
              },
              error => {}
            );
        } else {
          this.commissionService
            .setCategoryRate(id, data.rate, data.setForOldExpenses)
            .subscribe(
              res => {
                this.selectedIdx = -1;
                category.commissionRate = rate;
                this.categories.forEach(cat  => {
                  if(cat.id === id){
                    cat.commissionRate = rate;
                  }
              });
              },
              error => {}
            );
        }
      } else {
        this.commissionService
          .setCategoryRate(id, data.rate, data.setForOldExpenses)
          .subscribe(res => {
            this.categories.forEach(cat  => {
              if(cat.id === id){
                cat.commissionRate = rate;
              }
          });
            this.selectedIdx = -1;
          }, error => {});
      }
    } else {
      this.selectedIdx = -1;
    }
  }
}
