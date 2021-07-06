import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ViewContainerRef
} from "@angular/core";

import { forkJoin, Observable, Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { TagsService } from "src/app/services/tags/tags.service";
import { DataTableDirective } from "angular-datatables";
import { ManageTagsListService } from "./services/manage-tags-list.service";
import { TagsRealTimeService } from "src/app/states/tags/tags-real-time.service";
declare var $: any;
@Component({
  selector: "app-manage-tags",
  templateUrl: "./manage-tags.component.html",
  styleUrls: ["./manage-tags.component.scss"],
  providers: [ManageTagsListService]
})
export class ManageTagsComponent implements OnDestroy, OnInit {
  searchTag = "";
  ticketTags: any[] = [];
  page: number = 0;
  public infiniteScrollDisabled = true;


  companyTags: any[] = [];
  reqcompanyTags: any[] = [];
  serviceAllTickets: Observable<any>;

  serviceCreateCustomTags: Observable<any>;
  allowCreateTags: any;
  compnayForm: FormGroup;
  submitted = false;
  edit = false;
  create = false;
  selectedIdx = -1;
  setActiveTab = "company";
  private tagId: string;
  public deletePopup = false;
  public loading = false;
  dtOptions: DataTables.Settings = {
    searching: false,
    paging: false,
    info: false
  };
  @ViewChild("dataTable")
  dtElement: DataTableDirective;
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
    private tagsRealTimeService: TagsRealTimeService
  ) { }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('ng7');
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
    this.serviceAllTickets = this.tagsService.getAllTickets();
    this.getAllTags();
    this.settingStateService.setComponentName('ManageTagsComponent');

    let changeTagsArray = this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED" && data.data instanceof Array) this.ticketTags = [...this.ticketTags, ...data.data];
      if (data.action === "TAG_SAVED" && data.data instanceof Object) {
        let index = this.ticketTags.findIndex(item => item.id === data.data.id);
        if (index > -1) this.ticketTags[index] = data.data;
      }
      if (data.action === "TAG_REMOVED") {
        let index = this.ticketTags.findIndex(item => item.id === data.data.id);
        if (index > -1) this.ticketTags.splice(index, 1);
      }
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
    this.loading = true; $(".loading").css("display", "block");
    forkJoin([this.serviceAllTickets])
      .pipe(
        map(data => {
          this.loading = false; $(".loading").css("display", "none");
          this.ticketTags = data[0];

          this.setDefaultScoll();
          this.onScroll();
        })
      )
      .subscribe(
        () => {
          this.dtTrigger.next();
        },
        error => {
          this.loading = false; $(".loading").css("display", "none");
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
    console.log("onScroll");
    this.infiniteScrollDisabled = true;
    this.getTags();
  }
  getTags() {
    if (this.manageTagsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.tagsService.search(this.page, this.searchTag).subscribe((data: any) => {
      this.companyTags = [...this.companyTags, ...data.commonTagViews];
      this.reqcompanyTags = [...this.reqcompanyTags, ...JSON.parse(JSON.stringify(data.commonTagViews))];
      this.page++;
      this.infiniteScrollDisabled = false;
      if (this.reqcompanyTags.length === data.totalElements) this.manageTagsListService.setBlockList(true);
      this.loading = false; $(".loading").css("display", "none");
    })
  }

  /**
   * get all companies
   */
  getAllCompany() {
    this.loading = true; $(".loading").css("display", "block");

  }

  /**
   * get all tickets
   */
  getAllTickets() {
    this.loading = true; $(".loading").css("display", "block");
    this.serviceAllTickets.subscribe(
      res => {
        this.loading = false; $(".loading").css("display", "none");
        this.ticketTags = res;
      },
      error => {
        this.loading = false; $(".loading").css("display", "none");

      }
    );
  }

  // TODO
  getAllDevice() { }

  setTab() {
    if (this.edit) {
      return;
    }
    this.searchTag = "";
    this.compnayForm.patchValue({ word: "" });
    if (this.tabSet['activeId'] === 'tab1') {
      this.loading = true; $(".loading").css("display", "block");
      this.setActiveTab = "company";
      this.searchTag = "";
      this.companyTags = [];
      this.reqcompanyTags = [];
      this.setDefaultScoll();
      this.onScroll();
    } else if (this.tabSet['activeId'] === 'tab2') {
      this.infiniteScrollDisabled = true;
      this.setActiveTab = "ticket";
    } else if (this.tabSet['activeId'] === 'tab3') {
      this.infiniteScrollDisabled = true;
      this.setActiveTab = "device";
    }

    // if (this.tickets.nativeElement.className.indexOf("active") > -1) {
    //   this.setActiveTab = "ticket";
    // } else {
    //   this.setActiveTab = "company";
    // }
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


  ConfirmDelete(tID: string) {
    this.tagId = tID;
    this.deletePopup = true;
  }

  /**
   * removed company tag based on tagId
   * @param tagId
   */
  removeCompanyTag() {
    this.loading = true; $(".loading").css("display", "block");
    this.tagsService.removeCompanyTag(this.tagId, this.setActiveTab).subscribe(
      res => {
        this.tagId = null;
        this.loading = false; $(".loading").css("display", "none");
        this.deletePopup = false;
        this.toaster.success("Tag Removed Successfully");
        /*  if (this.setActiveTab === "ticket") {
            this.getAllTickets();
          } else {
            this.getAllCompany();
          }*/
      },
      error => {
        this.loading = false; $(".loading").css("display", "none");
        this.deletePopup = false;
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
    this.loading = true; $(".loading").css("display", "block");

    if (!this.edit) {
      const tags = {
        colorCode: 0,
        usedCounter: 0,
        word: this.compnayForm.value.word
      };
      this.tagsService.tags(tags, this.setActiveTab).subscribe(
        res => {
          this.loading = false; $(".loading").css("display", "none");
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
          this.loading = false; $(".loading").css("display", "none");
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
            this.loading = false; $(".loading").css("display", "none");
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
                // this.getAllTickets();
              } else {
                this.companyTags.filter(company => {
                  if (company.id === res.id) {
                    company.word = this.compnayForm.value.word;
                    return;
                  }
                });
                // this.getAllCompany();
              }
            }

            this.compnayForm.patchValue({ word: "" });
          },
          error => {
            this.loading = false; $(".loading").css("display", "none");
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
    $('body').removeClass('ng7');
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
  trackByFn(index, item) {
    return item.id;
  }
}
