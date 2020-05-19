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
  public deletePopup = false;
  public confirmPopup = false;
  rate: any;
  id: string;
  category: any;
  factItem = false;
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
  removeProduct() {
    if (this.category && this.category.commissionRate) {
      this.loading = true;$(".loading").css("display", "block");
      this.commissionService
        .setCategoryRate(this.category.id, '0', false)
        .subscribe(
          res => {
            this.toastrService.success('Removed Successfully')
            this.selectedIdx = -1;
            this.loading = false;$(".loading").css("display", "none");
            this.category.commissionRate = null;
            this.deletePopup = false;
          },
          error => {
            this.deletePopup = false;
            this.toastrService.error('Bad Request')
            this.loading = false;$(".loading").css("display", "none");
          }
        );
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
  setCategoryRate() {
    let data = {
      rate: '',
      setForOldExpenses: false
    };

    if (this.rate || this.rate === 0) {
      data = {
        rate: this.rate,
        setForOldExpenses: false
      };

      if (this.category.commissionRate === null) {
        if (this.factItem === true) {
          data.setForOldExpenses = true;
        }
      }
      this.loading = true;$(".loading").css("display", "block");
      this.commissionService
        .setCategoryRate(this.id, data.rate, data.setForOldExpenses)
        .subscribe(
          (res: any) => {
            this.toastrService.success(`Commission Rate Changed Successfully`);
            this.loading = false;$(".loading").css("display", "none");
            this.category.commissionRate = res.commissionRate.toFixed(2);
            this.selectedIdx = -1;
            this.factItem = false;
            this.confirmPopup = false;
          },
          error => {
            this.selectedIdx = -1;
            this.loading = false;$(".loading").css("display", "none");
            this.toastrService.error('Bad Request');
            this.factItem = false;
            this.confirmPopup = false;
          }
        );
    } else {
      this.selectedIdx = -1;
    }
  }

  confirmDelete(data: any){
    this.category = data;
    this.deletePopup = true;
  }

  confirmEdit(rate, id: string, category: any){
    this.rate = rate;
    this.id = id;
    this.category = category;
    if (this.category.commissionRate === null) {
      this.confirmPopup = true;
    } else {
      this.confirmPopup = false;
      this.factItem = false;
      this.setCategoryRate();
    }
    
  }
}
