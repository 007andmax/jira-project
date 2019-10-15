import { Component, OnInit } from "@angular/core";
import { TaxesService } from "./taxes.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { map } from "rxjs/operators";

@Component({
  selector: "app-taxes",
  templateUrl: "./taxes.component.html",
  styleUrls: ["./taxes.component.scss"]
})
export class TaxesComponent implements OnInit {
  loading = false;
  create = false;
  selectedIdx = -1;
  unique = true;
  taxes: any[] = [];
  eTax: any;
  submitted = false;
  taxForm: FormGroup;

  constructor(
    private taxesService: TaxesService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
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

  // convenience getter for easy access to form fields
  get f() {
    return this.taxForm.controls;
  }

  getTaxes() {
    this.loading = true;
    this.taxesService
      .getTaxes()
      .pipe(
        map((res: any) => {
          if (res) {
            this.taxes = res;
          }
          this.loading = false;
        })
      )
      .subscribe();
  }

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

  defaultTax(tax: any) {}

  removeTax(tax: any) {
    if (confirm(`Are you sure you want to delete ${tax.name} ?`)) {
      this.loading = true;
      this.taxesService
        .delete(tax.id)
        .pipe(
          map(res => {
            this.loading = false;
            this.taxes = this.taxes.filter(t => t.id !== tax.id);
            this.toastrService.success(`${tax.name} is deleted successfully.`);
          })
        )
        .subscribe();
    }
  }

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

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.taxForm.invalid || !this.unique) {
      return;
    }

    if (this.taxForm.value.id) {
      // edit
      this.loading = true;
      this.taxesService
        .editTaxes(this.taxForm.value)
        .pipe(
          map((res: any) => {
            this.loading = false;
            if (res) {
              let itemIndex = this.taxes.findIndex(item => item.id == res.id);
              this.taxes[itemIndex] = res;
              this.selectedIdx = -1;
            }
          })
        )
        .subscribe();
    } else {
      // add
      this.loading = true;
      this.taxesService
        .saveTaxes(this.taxForm.value)
        .pipe(
          map((res: any) => {
            this.loading = false;
            this.taxes.push(res);
            this.create = false;
          })
        )
        .subscribe();
    }
  }
}
