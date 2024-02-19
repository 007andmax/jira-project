import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';

@Component({
  selector: 'app-users-filter-job-title',
  templateUrl: './users-filter-job-title.component.html',
  styleUrls: ['./users-filter-job-title.component.scss']
})
export class UsersFilterJobTitleComponent implements OnInit {
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  public shortVersion: boolean = true;
  sub: Subscription = new Subscription();
  @Output() onSelectTitle = new EventEmitter();
  constructor(private crmStateService: CrmStateService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.jobTitleList = this.crmStateService.getJobTitleList();
    this.shortVersion = this.jobTitleList.length > 5;
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
      this.shortVersion = this.jobTitleList.length > 5;
      this.cd.markForCheck();
    })
    this.sub.add(onGetJobTitle);
  }
  public setSelectedItemsWithoutChanges(data) {
    this.jobTitleList.forEach(title => title.selected = data.some(item => item.id == title.id));
  }
  public clearWithOutChanges() {
    this.jobTitleList.filter(item => item.selected = false);
  }
  selectTitle(item, event) {
    this.onSelectTitle.emit({ item, event })
  }
}
