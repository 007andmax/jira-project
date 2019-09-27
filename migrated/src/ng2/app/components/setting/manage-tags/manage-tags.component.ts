import { Component, OnInit } from "@angular/core";
import { TagsService } from "src/ng2/app/services/setting/tags.service";
import { forkJoin, Observable } from "rxjs";
import { map } from "rxjs/operators";

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
  
  constructor(private tagsService: TagsService) {}

  ngOnInit() {
    this.serviceAllTickets = this.tagsService.getAllTickets();
    this.serviceAllCompany = this.tagsService.getAllCompany();
    this.getAllTags();
  }

  getAllTags() {
    forkJoin([this.serviceAllTickets, this.serviceAllCompany])
      .pipe(
        map(data => {
          this.ticketTags = data[0];
          this.companyTags = data[1];
        })
      )
      .subscribe();
  }

  // TODO
  getAllDevice() {}

  setTab() {
    this.searchTag = '';
  }
}
