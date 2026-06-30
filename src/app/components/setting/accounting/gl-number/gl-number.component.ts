import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { GlNumberService } from "./gl-number.service";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs/operators";
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { GlNumber } from "src/class/gl-number/gl-number";
import { GlNumberStateService } from "src/app/states/gl-number/gl-number-state.service";
import { Subscription } from "rxjs";
import { ConfirmStateService } from "src/app/components/shared/confirm/services/confirm-state.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DELETE_GL_NUMBER } from "src/app/const/confirm";
import { GlNumberCheckUseComponent } from "./gl-number-check-use/gl-number-check-use.component";
import { TicketSortBy } from "src/app/components/tickets/tickets/class/ticket-sort-by";
import { GlNumberFilter } from "./class/gl-number-filter";
declare var $: any;
@Component({
  selector: "app-gl-number-settings",
  templateUrl: "./gl-number.component.html",
  styleUrls: ["./gl-number.component.scss"]
})
export class GlNumberSettingsComponent implements OnInit, OnDestroy {
  loading = false;
  numberList: Array<GlNumber> = [];
  gl: any;
  popup: boolean;
  showAddGl: boolean = false;
  sortBy: TicketSortBy = new TicketSortBy('glNumber', 'ASC');
  filter: GlNumberFilter = new GlNumberFilter();
  sub: Subscription = new Subscription();
  constructor(
    private glNumberService: GlNumberService,
    private toastrService: ToastrService,
    private settingStateService: SettingStateService,
    private glNumberStateService: GlNumberStateService,
    public cd: ChangeDetectorRef,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal
  ) { }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.numberList = [];



    this.settingStateService.setComponentName('GlNumberSettingsComponent');
    this.loading = true; $(".loading").css("display", "block");
    this.numberList = JSON.parse(JSON.stringify(this.glNumberStateService.getGLNumbers())).map(item => new GlNumber(item)).sort((a, b) => a.glNumber.toLowerCase().localeCompare(b.glNumber.toLowerCase()));
    this.loading = false; $(".loading").css("display", "none");
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe(data => {
      this.numberList = JSON.parse(JSON.stringify(data)).map(item => new GlNumber(item)).sort((a, b) => a.glNumber.toLowerCase().localeCompare(b.glNumber.toLowerCase()));
      this.loading = false; $(".loading").css("display", "none");
      this.cd.detectChanges();
    })
    this.sub.add(getOnGlNumbers);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_GL_NUMBER) {
          this.removeGL();
        }
      }
    })
    this.sub.add(getConfirm);

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
    this.confirmStateService.setConfirmAction(DELETE_GL_NUMBER);
    const modalRef = this.modalService.open(GlNumberCheckUseComponent, { windowClass: 'xs-modal user-modal', container: "app-accounting-settings", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.glNumber = gl;
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
      .subscribe(res => {
        this.confirmStateService.initRequest(false);
      }, err => {
        this.confirmStateService.initRequest(false);
      });
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
  public trackById(index, item) {
    return item.id;
  }
  onFilter(field) {
    this.sortBy.sortBy = field;
    this.filter.onFilter(field, this.numberList);
    this.sortBy.sortDirection = this.filter.direction;
    this.cd.detectChanges();
  }

  onEditGl(item) {
    if (item.isInitEdit) {
      if (item.glNumber.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.glNumberService
        .editGL(item.getDataForEdit())
        .subscribe(
          () => {
            item.setIsInitRequest(false);
            this.toastrService.success("GL Number Updated Successfully");
          },
          error => {
            item.setIsInitRequest(false);
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
