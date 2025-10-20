import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { Task } from '../class/task';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { TasksFilters } from '../class/tasks-filters';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { Subscription } from 'rxjs';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  providers: [TicketsListService]
})
export class TasksListComponent implements OnInit, OnDestroy {
  filter: TasksFilters = new TasksFilters();
  list: Array<Task> = [];
  showPreloader: boolean = true;
  showPendingPreloader: boolean = false;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  offset: number = 10;
  container = document.body.querySelector(".main-container");
  toggleFilter: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public tasksService: TasksService,
    public ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
    public tasksStateService: TasksStateService,
    public tasksRealTimeService: TasksRealTimeService,
    private usersStateService: UsersStateService
  ) { }


  ngOnInit() {
    this.filter.techUser = this.usersStateService.getCurrentUser();
    this.onScroll();
    let geLefttFilter = this.tasksStateService.onFilter.subscribe((data) => {
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.showPreloader = true;
      this.filter.setFilterData(data);
      this.setDefaultScoll();
      this.onScroll();
      this.cd.detectChanges();
    });
    this.sub.add(geLefttFilter);
    let getChangeCompanies = this.tasksRealTimeService.changeTasksArray.subscribe((data) => {
      if (data.action === 'TASK_SAVED' && this.filter.checkFilterUse(new Task(data.data))) {
        this.list.unshift(new Task(data.data));
      }
      if (data.action === 'TASK_EDITED') {
        let index = this.list.findIndex(item => item.id == data.data.id);
        if (index > -1) {
          this.list[index] = new Task(data.data);
        }
      }
      if (data.action === 'TASK_DELETED') {
        let index = this.list.findIndex(item => item.id == data.data);
        if (index > -1) {
          this.list.splice(index, 1);
        }
      }
      if (data.action === 'TASK_ARCHIVED') {
        let index = this.list.findIndex(item => item.id == data.data);
        if (index > -1 && !this.filter.archived && this.filter.filter) {
          this.list.splice(index, 1);
        }
      }
      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
    let onToggleFilter = this.tasksStateService.onToggleFilter.subscribe(data => {
      this.toggleFilter = data;
    })
    this.sub.add(onToggleFilter);
    let onFastRemove = this.tasksStateService.onFastRemove.subscribe(res => {
      let index = this.list.findIndex(item => item.id == res);
      if (index > -1) {
        this.list.splice(index, 1);
      }
    })
    this.sub.add(onFastRemove);
  }
  onToggleFilter(data) {
    this.tasksStateService.changeToggleFilter(data);
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getTickets();
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.list = [];
  }
  public getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }

    if (this.page_number > 0) this.showPendingPreloader = true;
    this.tasksService.getTasks(this.page_number, this.filter.techUser ? this.filter.techUser.id : null, this.filter.filter, this.filter.archived).subscribe((data: Array<Task>) => {
      this.list = [...this.list, ...data.map(item => new Task(item))];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
