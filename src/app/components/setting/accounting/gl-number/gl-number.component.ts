import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { GlNumberService } from "./gl-number.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { GlNumber } from "src/class/gl-number/gl-number";
import { GlNumberStateService } from "src/app/states/gl-number/gl-number-state.service";
import { Subscription } from "rxjs";
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
  sub: Subscription = new Subscription();
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



    this.settingStateService.setComponentName('GlNumberSettingsComponent');
    this.loading = true; $(".loading").css("display", "block");
    if (this.glNumberStateService.getGLNumbers().length > 0) {
      this.numberList = this.glNumberStateService.getGLNumbers().sort((a, b) => a.glNumber.toLowerCase().localeCompare(b.glNumber.toLowerCase()));
      this.loading = false; $(".loading").css("display", "none");
    }
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe(data => {
      this.numberList = data.sort((a, b) => a.glNumber.toLowerCase().localeCompare(b.glNumber.toLowerCase()));
      console.log("this.numberList", this.numberList);
      this.loading = false; $(".loading").css("display", "none");
      this.cd.detectChanges();
    })
    this.sub.add(getOnGlNumbers);

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  toggleShowAddGL(data) {
    this.showAddGl = data;
  }

  // convenience getter for easy access to form fields




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
