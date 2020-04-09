import { Component, OnInit, OnDestroy } from "@angular/core";
import { TaxesService } from "./taxes.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
declare var $:any;
@Component({
  selector: "app-taxes",
  templateUrl: "./taxes.component.html",
  styleUrls: ["./taxes.component.scss"]
})
export class TaxesComponent implements OnInit, OnDestroy {
  loading = false;
  create = false;
  selectedIdx = -1;
  unique = true;
  taxes: any[] = [];
  eTax: any;
  submitted = false;
  taxForm: FormGroup;
  tax: any;
  popup: boolean;
  constructor(
    private taxesService: TaxesService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.taxes = [];
    this.taxForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      rate: [
        "",
        [Validators.required, Validators.min(0.01), Validators.max(99)]
      ],
      id: [""],
      isDefault: [""]
    });

    this.getTaxes();
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.taxForm.controls;
  }

  /**
   * get taxes
   */
  getTaxes() {
    this.loading = true;$(".loading").css("display", "block");
    this.taxesService
      .getTaxes()
      .pipe(
        map((res: any) => {
          if (res) {
            this.taxes = res;
          }
          this.loading = false;$(".loading").css("display", "none");
        })
      )
      .subscribe();
  }

  /**
   * checked unique name based on name
   * @param name
   */
  isUniqueName(name) {
    if (!this.taxForm.controls["name"].errors) {
      this.taxesService
        .isUniqueName(name)
        .pipe(
          map((res: any) => {
            if (res) {
              this.unique = res.valid;
            } else {
              this.unique = true;
            }
          })
        )
        .subscribe();
    }
  }

  defaultTax(tax: any) {
    console.log(tax);

    this.taxForm.patchValue({
      name: tax.name,
      rate: tax.rate,
      id: tax.id,
      isDefault: !tax.isDefault
    });
    console.log(this.taxForm.value);
    this.loading = true;$(".loading").css("display", "block");
    this.taxesService
      .editTaxes(this.taxForm.value)
      .pipe(
        map((res: any) => {
          this.loading = false;$(".loading").css("display", "none");
          if (res) {
            let itemIndex = this.taxes.findIndex(item => item.id == res.id);
            this.taxes[itemIndex] = res;
            this.selectedIdx = -1;
          }
        })
      )
      .subscribe(
        () => {
          this.toastrService.success("Tax Saved Successfully");
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
        }
      );
  }

  removeConfirm(tax: any) {
    this.tax = tax;
    this.popup = true;
  }

  /**
   * remove tax
   * @param tax
   */
  removeTax() {
      this.loading = true;$(".loading").css("display", "block");
      this.taxesService
        .delete(this.tax.id)
        .pipe(
          map(res => {
            this.loading = false;$(".loading").css("display", "none");
            this.popup = false;
            this.taxes = this.taxes.filter(t => t.id !== this.tax.id);
            this.toastrService.success(`${this.tax.name} is Deleted Successfully.`);
          })
        )
        .subscribe();
  }

  /**
   * open model
   * @param isCreated
   * @param index
   * @param tax
   */
  openModel(isCreated: boolean, index: number, tax: any) {
    this.unique = true;
    this.taxForm.reset();
    this.submitted = false;
    this.create = isCreated;
    this.selectedIdx = -1;

    if (!isCreated) {
      this.eTax = tax;
      this.selectedIdx = index;
      this.taxForm.patchValue({
        name: tax.name,
        rate: tax.rate,
        id: tax.id,
        isDefault: tax.isDefault
      });
    }
  }

  /**
   * saved form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.taxForm.invalid || !this.unique) {
      return;
    }

    if (this.taxForm.value.id) {
      // edit
      this.loading = true;$(".loading").css("display", "block");
      this.taxesService
        .editTaxes(this.taxForm.value)
        .pipe(
          map((res: any) => {
            this.loading = false;$(".loading").css("display", "none");
            if (res) {
              let itemIndex = this.taxes.findIndex(item => item.id == res.id);
              this.taxes[itemIndex] = res;
              this.selectedIdx = -1;
            }
          })
        )
        .subscribe(
          () => {
            this.toastrService.success("Tax Saved Successfully");
          },
          error => {
            this.loading = false;$(".loading").css("display", "none");
          }
        );
    } else {
      // add
      this.loading = true;$(".loading").css("display", "block");
      this.taxesService
        .saveTaxes(this.taxForm.value)
        .pipe(
          map((res: any) => {
            this.loading = false;$(".loading").css("display", "none");
            this.taxes.push(res);
            this.create = false;
          })
        )
        .subscribe();
    }
  }

  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}
