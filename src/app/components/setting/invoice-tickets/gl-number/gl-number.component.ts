import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { GlNumberService } from "./gl-number.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { GlNumber } from "src/class/gl-number/gl-number";
import { GlNumberStateService } from "src/app/states/gl-number/gl-number-state.service";
declare var $: any;
@Component({
  selector: "app-gl-number-settings",
  templateUrl: "./gl-number.component.html",
  styleUrls: ["./gl-number.component.scss"]
})
export class GlNumberSettingsComponent implements OnInit, OnDestroy {
  loading = false;
  create = false;

  numberList: Array<GlNumber> = [];
  eGL: any;
  submitted = false;

  gl: any;
  popup: boolean;
  showAddGl: boolean = false;

  constructor(
    private glNumberService: GlNumberService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private settingStateService: SettingStateService,
    private glNumberStateService: GlNumberStateService,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.numberList = [];


    this.getGL();
    this.settingStateService.setComponentName('GlNumberSettingsComponent');
  }

  ngOnDestroy() {

  }
  toggleShowAddGL(data) {
    this.showAddGl = data;
  }

  // convenience getter for easy access to form fields


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
            this.numberList = res.map(item => new GlNumber(item));
            this.numberList.sort((a, b) => a.glNumber.toLowerCase().localeCompare(b.glNumber.toLowerCase()));
          }
          console.log("this.numberList", this.numberList);
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

  onSelect(event, item) {
    if (event.target.checked) {
      this.glNumberStateService.getListGlNumbersForRemove().push(item);
    } else {
      let list = this.glNumberStateService.getListGlNumbersForRemove();
      let index = list.findIndex(item => item.id === item.id);
      if (index > -1) list.splice(index, 1);
      this.glNumberStateService.setListGlNumbersForRemove(list);
    }
    this.cd.detectChanges();
  }


  onEditGl(item) {
    console.log("item", item);
    if (item.isInitEdit) {
      if (item.glNumber.length === 0) return;
      this.glNumberService
        .editGL(item.getDataForEdit())
        .subscribe(
          () => {
            this.toastrService.success("GL Number Updated Successfully");
          },
          error => {
            this.loading = false; $(".loading").css("display", "none");
          }
        );
    }
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}
