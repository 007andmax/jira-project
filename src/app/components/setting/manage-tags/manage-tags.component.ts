import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  ChangeDetectorRef
} from "@angular/core";

import { forkJoin, Observable, of, Subject, Subscription } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { TagsService } from "src/app/services/tags/tags.service";
import { ManageTagsListService } from "./services/manage-tags-list.service";
import { TagsRealTimeService } from "src/app/states/tags/tags-real-time.service";
import { ConfirmStateService } from "../../shared/confirm/services/confirm-state.service";
import { DELETE_MANAGE_TAG } from "src/app/const/confirm";
import { ConfirmComponent } from "../../shared/confirm/confirm.component";
import { ManageTag } from "./class/manage-tag";
declare var $: any;
@Component({
  selector: "app-manage-tags",
  templateUrl: "./manage-tags.component.html",
  styleUrls: ["./manage-tags.component.scss"],
  providers: [ManageTagsListService]
})
export class ManageTagsComponent implements OnDestroy, OnInit {
  searchTag = "";
  ticketTags: Array<ManageTag> = [];
  page: number = 0;
  public infiniteScrollDisabled = true;
  companyTags: Array<ManageTag> = [];
  reqcompanyTags: Array<ManageTag> = [];
  serviceAllTickets: Observable<any>;
  showAdd: boolean = false;
  serviceCreateCustomTags: Observable<any>;
  allowCreateTags: any;
  compnayForm: FormGroup;
  submitted = false;
  edit = false;
  create = false;
  selectedIdx = -1;
  setActiveTab = "company";
  private tagId: string;
  public loading = true;
  dtOptions: DataTables.Settings = {
    searching: false,
    paging: false,
    info: false
  };
  @ViewChild("tickets") tickets: ElementRef;
  private tabSet: ViewContainerRef;

  @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
    this.tabSet = content;
  };
  dtTrigger = new Subject();
  sub: Subscription = new Subscription();
  constructor(
    private tagsService: TagsService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private settingStateService: SettingStateService,
    private companiesStateService: CompaniesStateService,
    private manageTagsListService: ManageTagsListService,
    private tagsRealTimeService: TagsRealTimeService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.searchTag = "";
    this.compnayForm = this.formBuilder.group({
      word: ["", Validators.required],
      id: [""]
    });
    if (this.companiesStateService.getCurrentCompany()) this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    this.companiesStateService.onCurrentCompany.subscribe(res => {
      this.getCurrentCompany(res);
    })
    this.serviceAllTickets = this.tagsService.getTags();
    this.getAllTags();
    this.settingStateService.setComponentName('ManageTagsComponent');
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_MANAGE_TAG) {
          this.removeCompanyTag()
        }
      }
    })
    this.sub.add(getConfirm);
    let changeTagsArray = this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED") {
        let index = this.ticketTags.findIndex(item => item.id === data.data.id);
        if (index > -1) {
          this.ticketTags[index] = new ManageTag(data.data);
        } else {
          this.ticketTags.push(new ManageTag(data.data));
        }
      }
      if (data.action === "TAG_REMOVED") {
        let index = this.ticketTags.findIndex(item => item.id === data.data);
        if (index > -1) this.ticketTags.splice(index, 1);

        let indexCompany = this.companyTags.findIndex(item => item.id === data.data);
        if (indexCompany > -1) this.companyTags.splice(indexCompany, 1);
      }
      this.cd.detectChanges();
    })
    this.sub.add(changeTagsArray);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  /**
   * load all services
   */
  getAllTags() {
    forkJoin([this.serviceAllTickets])
      .pipe(
        map(data => {
          this.loading = false;
          this.ticketTags = data[0].map(item => new ManageTag(item)).sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
            1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
          this.setDefaultScoll();
          this.onScroll();
        })
      )
      .subscribe(
        () => {
          this.dtTrigger.next();
        },
        error => {
          this.loading = false;
        }
      );
  }

  getCurrentCompany(res) {
    this.allowCreateTags = res['allowCreateTags'];
  }

  saveAllowingCreateCustomTags() {
    this.tagsService.saveAllowingCreateCustomTags(this.allowCreateTags).subscribe(
      res => {

      },
      error => {
        this.allowCreateTags = !this.allowCreateTags;
      }
    );
  }
  onSearch() {
    this.setDefaultScoll();
    this.onScroll();
  }
  public setDefaultScoll() {
    this.page = 0;
    this.manageTagsListService.setBlockList(false);
    this.companyTags = [];
    this.reqcompanyTags = [];
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getTags();
  }
  getTags() {
    if (this.manageTagsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.tagsService.searchManageTag(this.page, this.searchTag).subscribe((data: any) => {
      this.companyTags = [...this.companyTags, ...data.commonTagViews].map(item => new ManageTag(item));
      this.reqcompanyTags = [...this.reqcompanyTags, ...JSON.parse(JSON.stringify(data.commonTagViews))].map(item => new ManageTag(item));
      this.page++;
      this.infiniteScrollDisabled = false;
      if (this.reqcompanyTags.length === data.totalElements) this.manageTagsListService.setBlockList(true);
      this.loading = false;
    })
  }

  onEditTag(item) {
    if (item.isInitEdit) {
      if (item.word.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.tagsService
        .setWordForTag(
          item.id,
          item.word,
          this.setActiveTab
        )
        .pipe(map((res) => res),
          catchError(error => of(undefined))).subscribe(data => {
            item.setIsInitRequest(false);
            item.onInitEdit(false);
          }, err => {
            item.setIsInitRequest(false);
          })
    }
  }

  /**
   * get all tickets
   */
  getAllTickets() {
    this.serviceAllTickets.subscribe(
      res => {
        this.ticketTags = res.map(item => new ManageTag(item));
      },
      error => {
      }
    );
  }

  // TODO
  getAllDevice() { }

  setTab(data) {
    if (this.edit) {
      return;
    }
    this.searchTag = "";
    this.compnayForm.patchValue({ word: "" });
    if (data['nextId'] === 'tab1') {
      this.loading = true;
      this.setActiveTab = "company";
      this.searchTag = "";
      this.companyTags = [];
      this.reqcompanyTags = [];
      this.setDefaultScoll();
      this.onScroll();
    } else if (data['nextId'] === 'tab2') {
      this.infiniteScrollDisabled = true;
      this.setActiveTab = "ticket";
    } else if (data['nextId'] === 'tab3') {
      this.infiniteScrollDisabled = true;
      this.setActiveTab = "device";
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.compnayForm.controls;
  }

  editTag(tag, index) {
    this.searchTag = "";
    this.edit = true;
    this.create = false;
    this.submitted = false;
    this.selectedIdx = index;
    if (tag) {
      this.compnayForm.patchValue({ word: tag.word, id: tag.id });
    }
  }

  onCreate() {
    this.compnayForm.patchValue({ word: "" });

    this.edit = false;
    this.searchTag = "";
    this.create = true;
    this.selectedIdx = -1;
  }

  onCancel() {
    this.submitted = false;
    this.selectedIdx = -1;
    this.searchTag = "";
    this.create = false;
    this.compnayForm.patchValue({ word: "" });
  }


  ConfirmDelete(tID: string, name) {
    this.tagId = tID;
    this.confirmStateService.setConfirmAction(DELETE_MANAGE_TAG);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = name;

  }

  /**
   * removed company tag based on tagId
   * @param tagId
   */
  removeCompanyTag() {
    this.tagsService.removeCompanyTag(this.tagId, this.setActiveTab).subscribe(
      res => {
        this.tagId = null;
      },
      error => {
      }
    );
  }

  /**
   * saved
   */
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.compnayForm.invalid) {
      return;
    }
    this.selectedIdx = -1;
    this.create = false;
    if (!this.edit) {
      const tags = {
        colorCode: 0,
        usedCounter: 0,
        word: this.compnayForm.value.word
      };
      this.tagsService.tags(tags, this.setActiveTab).subscribe(
        res => {
          this.toaster.success("Tag Saved Successfully");
          /* if (this.setActiveTab === "ticket") {
             this.getAllTickets();
           } else {
             this.getAllCompany();
           }*/

          this.submitted = false;
          this.compnayForm.patchValue({ word: "" });
        },
        error => {
          this.toaster.error(error);
        }
      );
    } else {
      this.tagsService
        .setWordForTag(
          this.compnayForm.value.id,
          this.compnayForm.value.word,
          this.setActiveTab
        )
        .subscribe(
          (res: any) => {
            this.submitted = false;
            if (res) {
              this.toaster.success("Tag Updated Successfully", null, {
                timeOut: 3000
              });

              if (this.setActiveTab === "ticket") {
                this.ticketTags.filter(ticket => {
                  if (ticket.id === res.id) {
                    ticket.word = this.compnayForm.value.word;
                    return;
                  }
                });
              } else {
                this.companyTags.filter(company => {
                  if (company.id === res.id) {
                    company.word = this.compnayForm.value.word;
                    return;
                  }
                });
              }
            }

            this.compnayForm.patchValue({ word: "" });
          },
          error => {
            this.toaster.error(error);
          }
        );
    }
    this.edit = false;
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.sub.unsubscribe();
    $('body').removeClass('page-settings');
    // Do not forget to unsubscribe the event
  }
  public trackById(index, item) {
    return item.id;
  }
  trackByFn(index, item) {
    return item.id;
  }
}
