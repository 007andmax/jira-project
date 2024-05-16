import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { News } from '../class/news';
import * as moment from "moment";
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_NEWS } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { KnowledgeBaseStateService } from '../../../state/knowledge-base/knowledge-base-state.service';

@Component({
  selector: 'app-super-admin-knowledge-base-table-item',
  templateUrl: './super-admin-knowledge-base-table-item.component.html',
  styleUrls: ['./super-admin-knowledge-base-table-item.component.scss']
})
export class SuperAdminKnowledgeBaseTableItemComponent implements OnInit {
  @Input() news: News;

  constructor(private confirmStateService: ConfirmStateService,
    private knowledgeBaseStateService: KnowledgeBaseStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) { }

  ngOnInit() {
  }
  public getDate(date) {
    return moment(new Date(date)).format('MMM DD, YYYY');
  }
  select() {
    var scrollDiv = document.getElementById("preview-" + this.news.id).offsetTop;
    document.querySelector(".aside-filters").scrollTo({ top: scrollDiv, behavior: 'smooth' });

  }

  removeNews() {
    this.confirmStateService.setConfirmAction(DELETE_NEWS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to delete announcement?`;
    this.knowledgeBaseStateService.setNewsForDelete(this.news);
    this.cd.markForCheck();
  }

}
