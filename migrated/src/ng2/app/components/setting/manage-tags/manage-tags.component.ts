import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { TagsService } from "src/ng2/app/services/setting/tags.service";
import { forkJoin, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-manage-tags",
  templateUrl: "./manage-tags.component.html",
  styleUrls: ["./manage-tags.component.scss"]
})
export class ManageTagsComponent implements OnDestroy,OnInit {
  searchTag = "";
  ticketTags: any[] = [];
  companyTags: any[] = [];
  serviceAllTickets: Observable<any>;
  serviceAllCompany: Observable<any>;

  compnayForm: FormGroup;
  submitted = false;
  edit = false;
  create = false;
  selectedIdx = -1;
  setActiveTab = "company";
  public loading = false;
  dtOptions: DataTables.Settings = {searching: false, paging: false, info: false};
  @ViewChild("tickets") tickets: ElementRef;
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
    this.searchTag = "";
    this.compnayForm = this.formBuilder.group({
      word: ["", Validators.required],
      id: [""]
    });

    this.serviceAllTickets = this.tagsService.getAllTickets();
    this.serviceAllCompany = this.tagsService.getAllCompany();

    this.getAllTags();
  }

  /**
   * load all services
   */
  getAllTags() {
    this.loading = true;
    forkJoin([this.serviceAllTickets, this.serviceAllCompany])
      .pipe(
        map(data => {
          this.loading = false;
          this.ticketTags = data[0];
          this.companyTags = data[1];
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

  /**
   * get all companies
   */
  getAllCompany() {
    this.loading = true;
    this.serviceAllCompany.subscribe(
      res => {
        this.companyTags = res;
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  /**
   * get all tickets
   */
  getAllTickets() {
    this.loading = true;
    this.serviceAllTickets.subscribe(
      res => {
        this.loading = false;
        this.ticketTags = res;
      },
      error => {
        this.loading = false;
        console.log(error);
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
    if (this.tickets.nativeElement.className.indexOf("active") > -1) {
      this.setActiveTab = "ticket";
    } else {
      this.setActiveTab = "company";
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

  /**
   * removed company tag based on tagId
   * @param tagId
   */
  removeCompanyTag(tagId: string) {
    if (confirm("Are you sure you want to delete?")) {
      this.loading = true;
      this.tagsService.removeCompanyTag(tagId, this.setActiveTab).subscribe(
        res => {
          this.loading = false;
          this.toaster.success("Tag Removed Successfully");
          if (this.setActiveTab === "ticket") {
            this.getAllTickets();
          } else {
            this.getAllCompany();
          }
        },
        error => {
          this.loading = false;
        }
      );
    }
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
    this.loading = true;

    if (!this.edit) {
      const tags = {
        colorCode: 0,
        usedCounter: 0,
        word: this.compnayForm.value.word
      };
      this.tagsService.tags(tags, this.setActiveTab).subscribe(
        res => {
          this.loading = false;
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
          this.loading = false;
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
          res => {
            console.log(res);
            if (res) {
              this.toaster.success("Tag Updated Successfully", null, {
                timeOut: 3000
              });
            }
            if (this.setActiveTab === "ticket") {
              this.getAllTickets();
            } else {
              this.getAllCompany();
            }
            this.loading = false;
            this.submitted = false;
            this.compnayForm.patchValue({ word: "" });
          },
          error => {
            this.loading = false;
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
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
