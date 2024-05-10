import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { News } from './class/news';
import { SuperAdminKnowledgeBaseService } from '../../services/super-admin-knowledge-base/super-admin-knowledge-base.service';
import { KnowledgeBaseStateService } from '../../state/knowledge-base/knowledge-base-state.service';

@Component({
  selector: 'app-super-admin-knowledge-base-table',
  templateUrl: './super-admin-knowledge-base-table.component.html',
  styleUrls: ['./super-admin-knowledge-base-table.component.scss'],
  providers: [TicketsListService]
})
export class SuperAdminKnowledgeBaseTableComponent implements OnInit {
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  sub: Subscription = new Subscription();

  list: Array<News> = [];
  toggleFilter: boolean = false;
  showPendingPreloader: boolean = false;
  container = document.body.querySelector(".main-container");
  constructor(private ticketsListService: TicketsListService,
    private superAdminKnowledgeBaseService: SuperAdminKnowledgeBaseService,
    public cd: ChangeDetectorRef,
    private knowledgeBaseStateService: KnowledgeBaseStateService
  ) { }

  ngOnInit() {
    this.setDefaultScoll();
    this.onScroll();
  }
  private getNews() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }

    if (this.page_number > 0) this.showPendingPreloader = true;
    this.superAdminKnowledgeBaseService.getNews(this.page_number).subscribe((data: any) => {
      this.list = [...this.list, ...data.announcementDtos.map(item => new News(item))];
      this.knowledgeBaseStateService.setNews(this.list);
      this.infiniteScrollDisabled = false;
      if (data.totalPages == this.page_number) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();

    })
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getNews();
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.list = [];
  }
  public setToggleFilter(data) {
    this.toggleFilter = data;
  }

}
