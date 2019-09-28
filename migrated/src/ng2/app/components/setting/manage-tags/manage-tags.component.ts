import { Component, OnInit } from "@angular/core";
import { TagsService } from "src/ng2/app/services/setting/tags.service";
import { forkJoin, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-manage-tags",
  templateUrl: "./manage-tags.component.html",
  styleUrls: ["./manage-tags.component.scss"]
})
export class ManageTagsComponent implements OnInit {
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

  public loading = false;

  constructor(
    private tagsService: TagsService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.compnayForm = this.formBuilder.group({
      word: ["", Validators.required],
      id: [""]
    });

    this.serviceAllTickets = this.tagsService.getAllTickets();
    this.serviceAllCompany = this.tagsService.getAllCompany();
    this.getAllTags();
  }

  editCompany(company, index) {
    this.edit = true;
    this.selectedIdx = index;
    if (company) {
      this.compnayForm.patchValue({ word: company.word, id: company.id });
    }
  }

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
        () => {},
        error => {
          this.loading = false;
        }
      );
  }

  // TODO
  getAllDevice() {}

  setTab() {
    this.searchTag = "";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.compnayForm.controls;
  }

  removeCompanyTag(tagId: string) {
    this.loading = true;
    this.tagsService.removeCompanyTag(tagId).subscribe(
      res => {
        this.toaster.success("Tag removed successfully");
        this.getAllTags();
      },
      error => {
        this.loading = false;
      }
    );
  }

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
      this.loading = true;
      this.tagsService.tags(tags).subscribe(
        res => {
          this.toaster.success("Tag saved successfully");
          this.getAllTags();
          this.submitted = false;
          this.compnayForm.patchValue({word : ''})
        },
        error => {
          this.loading = false;
          this.toaster.error(error);
        }
      );
    } else {
      this.tagsService
        .setWordForTag(this.compnayForm.value.id, this.compnayForm.value.word)
        .subscribe(
          res => {
            this.toaster.success("Tag saved successfully");
            this.getAllTags();
            this.submitted = false;
            this.compnayForm.patchValue({word : ''})
          },
          error => {
            this.loading = false;
            this.toaster.error(error);
          }
        );
    }
  }
}
