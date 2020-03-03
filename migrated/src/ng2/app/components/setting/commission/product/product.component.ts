import { Component, OnInit } from '@angular/core';
import { CommissionService, ICategory } from '../commission.service';
import { ToastrService } from 'ngx-toastr';

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

  /**
   * get categories
   */
  getCategories() {
    this.loading = true;$(".loading").css("display", "block");
    this.commissionService.getCategories().subscribe(
      res => {
        this.loading = false;$(".loading").css("display", "none");
        if (res && res.length > 0) {
          this.categories = res;
          for (const cat of this.categories) {
            if (cat && cat.commissionRate !== null) {
              cat.commissionRate = cat.commissionRate.toFixed(2);
            }
          }
        }
      },
      error => {
        this.loading = false;$(".loading").css("display", "none");
      }
    );
  }

  /**
   * set product rate zero
   * @param category
   */
  removeProduct(category: any) {
    if (category && category.commissionRate) {
      if (confirm(`Do you want ${category.name} commission rate to zero?`)) {
        this.loading = true;$(".loading").css("display", "block");
        this.commissionService
          .setCategoryRate(category.id, '0', false)
          .subscribe(
            res => {
              this.toastrService.success('Removed Successfully')
              this.selectedIdx = -1;
              this.loading = false;$(".loading").css("display", "none");
              category.commissionRate = null;
            },
            error => {
              this.toastrService.error('Bad Request')
              this.loading = false;$(".loading").css("display", "none");
            }
          );
      }
    }
  }

  editProduct(i: number) {
    this.selectedIdx = i;
  }

  /**
   * set category rate
   * @param rate
   * @param id
   * @param category
   */
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
        }
      }
      this.loading = true;$(".loading").css("display", "block");
      this.commissionService
        .setCategoryRate(id, data.rate, data.setForOldExpenses)
        .subscribe(
          (res: any) => {
            this.toastrService.success(`Commission Rate Changed Successfully`);
            this.loading = false;$(".loading").css("display", "none");
            category.commissionRate = res.commissionRate.toFixed(2);
            this.selectedIdx = -1;
          },
          error => {
            this.selectedIdx = -1;
            this.loading = false;$(".loading").css("display", "none");
            this.toastrService.error('Bad Request');
          }
        );
    } else {
      this.selectedIdx = -1;
    }
  }
}
