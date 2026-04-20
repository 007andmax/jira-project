import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UserGlobalFilter } from '../../class/user-global-filters';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-users-filter-info',
    templateUrl: './users-filter-info.component.html',
    styleUrls: ['./users-filter-info.component.scss'],
    standalone: true
})
export class UsersFilterInfoComponent implements OnInit, OnDestroy {
  globalFilter: UserGlobalFilter = new UserGlobalFilter();
  sub: Subscription = new Subscription();
  constructor(public usersStateService: UsersStateService,
    private cd: ChangeDetectorRef,) { }


  ngOnInit() {
    let onInitGlobalFilter = this.usersStateService.onInitGlobalFilter.subscribe((data: UserGlobalFilter) => {
      this.globalFilter = data;
    });
    this.sub.add(onInitGlobalFilter);
    let getOnChangeTypeFilter = this.usersStateService.onClearGlobalFilter.subscribe(type => {
      this.globalFilter = new UserGlobalFilter();
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnChangeTypeFilter);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
