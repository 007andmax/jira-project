import { Component, OnInit, OnDestroy } from "@angular/core";
import { GlNumberService } from "./gl-number.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { SettingStateService } from "src/ng2/app/states/setting/setting-state.service";
declare var $: any;
@Component({
  selector: "app-gl-number-settings",
  templateUrl: "./gl-number.component.html",
  styleUrls: ["./gl-number.component.scss"]
})
export class GlNumberSettingsComponent implements OnInit, OnDestroy {
  loading = false;
  create = false;
  selectedIdx = -1;
  numberList: any[] = [];
  eGL: any;
  submitted = false;
  glForm: FormGroup;
  gl: any;
  popup: boolean;
  constructor(
    private glNumberService: GlNumberService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private settingStateService: SettingStateService
  ) { }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.numberList = [];
    this.glForm = this.formBuilder.group({
      glNumber: [
        "",
        [Validators.required, Validators.minLength(5)]
      ],
      description: [
        "",
        [Validators.maxLength(100)]
      ],
      id: [""]
    });

    this.getGL();
    this.settingStateService.setComponentName('GlNumberSettingsComponent');
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.glForm.controls;
  }

  /**
   * get numberList
   */
  getGL() {
    this.loading = true; $(".loading").css("display", "block");
    this.glNumberService
      .getGL()
      .pipe(
        map((res: any) => {
          if (res) {
            this.numberList = res;
            this.numberList.sort((a, b) => a.glNumber.localeCompare(b.glNumber));
          }
          this.loading = false; $(".loading").css("display", "none");
        })
      )
      .subscribe();
  }

  removeConfirm(gl: any) {
    this.gl = gl;
    this.popup = true;
  }

  /**
   * remove gl
   * @param gl
   */
  removeGL() {
    this.loading = true; $(".loading").css("display", "block");
    this.glNumberService
      .delete(this.gl.id)
      .pipe(
        map(res => {
          this.loading = false; $(".loading").css("display", "none");
          this.popup = false;
          this.numberList = this.numberList.filter(t => t.id !== this.gl.id);
          this.toastrService.success(`${this.gl.glNumber} is Deleted Successfully.`);
        })
      )
      .subscribe();
  }

  /**
   * open model
   * @param isCreated
   * @param index
   * @param gl
   */
  openModel(isCreated: boolean, index: number, glDetail: any) {
    this.glForm.reset();
    this.submitted = false;
    this.create = isCreated;
    this.selectedIdx = -1;

    if (!isCreated) {
      this.eGL = glDetail;
      this.selectedIdx = index;
      this.glForm.patchValue({
        glNumber: glDetail.glNumber,
        description: glDetail.description,
        id: glDetail.id
      });
    }
  }

  /**
   * saved form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.glForm.invalid) {
      return;
    }

    if (this.glForm.value.id) {
      // edit
      this.loading = true; $(".loading").css("display", "block");
      this.glNumberService
        .editGL(this.glForm.value)
        .pipe(
          map((res: any) => {
            this.loading = false; $(".loading").css("display", "none");
            if (res) {
              let itemIndex = this.numberList.findIndex(item => item.id == res.id);
              this.numberList[itemIndex] = res;
              this.selectedIdx = -1;
            }
          })
        )
        .subscribe(
          () => {
            this.toastrService.success("GL Number Updated Successfully");
          },
          error => {
            this.loading = false; $(".loading").css("display", "none");
          }
        );
    } else {
      // add
      this.loading = true; $(".loading").css("display", "block");
      this.glNumberService
        .saveGL(this.glForm.value)
        .pipe(
          map((res: any) => {
            this.loading = false; $(".loading").css("display", "none");
            this.toastrService.success("GL Number Saved Successfully");
            this.numberList.push(res);
            this.numberList.sort((a, b) => a.glNumber.localeCompare(b.glNumber));
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
