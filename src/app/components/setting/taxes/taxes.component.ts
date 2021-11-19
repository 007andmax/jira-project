import { Component, OnInit, OnDestroy } from "@angular/core";
import { TaxesService } from "./taxes.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { ConfirmStateService } from "../../shared/confirm/services/confirm-state.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DELETE_TAX } from "src/app/const/confirm";
import { ConfirmComponent } from "../../shared/confirm/confirm.component";
import { Subscription } from "rxjs";
declare var $: any;
@Component({
  selector: "app-taxes-settings",
  templateUrl: "./taxes.component.html",
  styleUrls: ["./taxes.component.scss"]
})
export class TaxesSettingsComponent implements OnInit, OnDestroy {
  loading = false;
  create = false;
  selectedIdx = -1;
  unique = true;
  taxes: any[] = [];
  eTax: any;
  submitted = false;
  taxForm: FormGroup;
  tax: any;
  sub: Subscription = new Subscription();
  constructor(
    private taxesService: TaxesService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private settingStateService: SettingStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
  ) { }

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
    this.settingStateService.setComponentName('TaxesSettingsComponent');
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      console.log("data", data);
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_TAX) {
          this.removeTax();
        }
      }
    })
    this.sub.add(getConfirm);
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
    this.sub.unsubscribe();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.taxForm.controls;
  }

  /**
   * get taxes
   */
  getTaxes() {
    this.loading = true; $(".loading").css("display", "block");
    this.taxesService
      .getTaxes()
      .pipe(
        map((res: any) => {
          if (res) {
            this.taxes = res;
          }
          this.loading = false; $(".loading").css("display", "none");
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


    this.taxForm.patchValue({
      name: tax.name,
      rate: tax.rate,
      id: tax.id,
      isDefault: !tax.isDefault
    });

    this.loading = true; $(".loading").css("display", "block");
    this.taxesService
      .editTaxes(this.taxForm.value)
      .pipe(
        map((res: any) => {
          this.loading = false; $(".loading").css("display", "none");
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
          this.loading = false; $(".loading").css("display", "none");
        }
      );
  }

  removeConfirm(tax: any) {
    this.tax = tax;
    this.confirmStateService.setConfirmAction(DELETE_TAX);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Are you sure you want to delete?`;
  }

  /**
   * remove tax
   * @param tax
   */
  removeTax() {
    this.loading = true; $(".loading").css("display", "block");
    this.taxesService
      .delete(this.tax.id)
      .pipe(
        map(res => {
          this.loading = false; $(".loading").css("display", "none");
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
      this.loading = true; $(".loading").css("display", "block");
      this.taxesService
        .editTaxes(this.taxForm.value)
        .pipe(
          map((res: any) => {
            this.loading = false; $(".loading").css("display", "none");
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
            this.loading = false; $(".loading").css("display", "none");
          }
        );
    } else {
      // add
      this.loading = true; $(".loading").css("display", "block");
      this.taxesService
        .saveTaxes(this.taxForm.value)
        .pipe(
          map((res: any) => {
            this.loading = false; $(".loading").css("display", "none");
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
