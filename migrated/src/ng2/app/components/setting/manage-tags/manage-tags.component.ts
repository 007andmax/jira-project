import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ViewContainerRef
} from "@angular/core";
import { TagsService } from "src/ng2/app/services/setting/tags.service";
import { forkJoin, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
@Component({
  selector: "app-manage-tags",
  templateUrl: "./manage-tags.component.html",
  styleUrls: ["./manage-tags.component.scss"]
})
export class ManageTagsComponent implements OnDestroy, OnInit {
  searchTag = "";
  ticketTags: any[] = [];
  companyTags: any[] = [];
  serviceAllTickets: Observable<any>;
  serviceAllCompany: Observable<any>;
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
  @ViewChild("tickets") tickets: ElementRef;
  private tabSet: ViewContainerRef;

  @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
    this.tabSet = content;
  };
  dtTrigger = new Subject();

  constructor(
    private tagsService: TagsService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService
  ) {}

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
    this.getCurrentCompany();
    this.serviceAllTickets = this.tagsService.getAllTickets();
    this.serviceAllCompany = this.tagsService.getAllCompany();

    this.getAllTags();
  }

  /**
   * load all services
   */
  getAllTags() {
    this.loading = true;$(".loading").css("display", "block");
    forkJoin([this.serviceAllTickets, this.serviceAllCompany])
      .pipe(
        map(data => {
          this.loading = false;$(".loading").css("display", "none");
          this.ticketTags = data[0];
          this.companyTags = data[1];
        })
      )
      .subscribe(
        () => {
          this.dtTrigger.next();
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
        }
      );
  }

  getCurrentCompany() {	
    this.tagsService.getCurrentCompany().subscribe(	
      res => {	
        this.allowCreateTags = res['allowCreateTags'];	
      },	
      error => {	
      }	
    ); 	
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

  /**
   * get all companies
   */
  getAllCompany() {
    this.loading = true;$(".loading").css("display", "block");
    this.serviceAllCompany.subscribe(
      res => {
        this.companyTags = res;
        this.loading = false;$(".loading").css("display", "none");
      },
      error => {
        this.loading = false;$(".loading").css("display", "none");
        
      }
    );
  }

  /**
   * get all tickets
   */
  getAllTickets() {
    this.loading = true;$(".loading").css("display", "block");
    this.serviceAllTickets.subscribe(
      res => {
        this.loading = false;$(".loading").css("display", "none");
        this.ticketTags = res;
      },
      error => {
        this.loading = false;$(".loading").css("display", "none");
     
      }
    );
  }

  // TODO
  getAllDevice() {}

  setTab() {
    if (this.edit) {
      return;
    }
    this.searchTag = "";
    this.compnayForm.patchValue({ word: "" });
    if (this.tabSet['activeId'] === 'tab1') {	
      this.setActiveTab = "company";	
    } else if (this.tabSet['activeId'] === 'tab2') {	
      this.setActiveTab = "ticket";	
    } else if (this.tabSet['activeId'] === 'tab3') {	
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


  ConfirmDelete(tID: string){
    this.tagId = tID;
    this.deletePopup = true;
  }

  /**
   * removed company tag based on tagId
   * @param tagId
   */
  removeCompanyTag() {   
      this.loading = true;$(".loading").css("display", "block");
      this.tagsService.removeCompanyTag(this.tagId, this.setActiveTab).subscribe(
        res => {
          this.tagId = null;
          this.loading = false;$(".loading").css("display", "none");
          this.deletePopup = false;
          this.toaster.success("Tag Removed Successfully");
          if (this.setActiveTab === "ticket") {
            this.getAllTickets();
          } else {
            this.getAllCompany();
          }
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
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
    this.loading = true;$(".loading").css("display", "block");

    if (!this.edit) {
      const tags = {
        colorCode: 0,
        usedCounter: 0,
        word: this.compnayForm.value.word
      };
      this.tagsService.tags(tags, this.setActiveTab).subscribe(
        res => {
          this.loading = false;$(".loading").css("display", "none");
          this.toaster.success("Tag Saved Successfully");
          if (this.setActiveTab === "ticket") {
            this.getAllTickets();
          } else {
            this.getAllCompany();
          }

          this.submitted = false;
          this.compnayForm.patchValue({ word: "" });
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
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
            this.loading = false;$(".loading").css("display", "none");
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
            this.loading = false;$(".loading").css("display", "none");
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
  }

  trackByFn(index, item) {
    return item.id;
  }
}
