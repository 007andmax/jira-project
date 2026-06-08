
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { News } from '../../super-admin/super-admin-knowledge-base/super-admin-knowledge-base-table/class/news';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { SuperAdminKnowledgeBaseService } from '../../super-admin/services/super-admin-knowledge-base/super-admin-knowledge-base.service';
import { SuperAdminKnowledgeBaseNewsComponent } from '../../super-admin/super-admin-knowledge-base/super-admin-knowledge-base-news/super-admin-knowledge-base-news.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  standalone: true,
  imports: [SuperAdminKnowledgeBaseNewsComponent, InfiniteScrollModule, CommonModule],
  selector: 'app-super-admin-public-list',
  templateUrl: './super-admin-public-list.component.html',
  styleUrls: ['./super-admin-public-list.component.scss'],
  providers: [TicketsListService],

})
export class SuperAdminPublicListComponent implements OnInit {
  list: Array<News> = [];
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  constructor(private ticketsListService: TicketsListService,
    private superAdminKnowledgeBaseService: SuperAdminKnowledgeBaseService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.setDefaultScoll();
    this.onScroll();
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.list = [];
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getNews();
  }
  private getNews() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.superAdminKnowledgeBaseService.getNews(this.page_number).subscribe((data: any) => {
      this.list = [...this.list, ...data.announcementDtos.map(item => new News(item))];
      this.infiniteScrollDisabled = false;
      if (data.totalPages == this.page_number) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.cd.detectChanges();
    })
  }
  public trackById(index, item) {
    return item.id;
  }
}
