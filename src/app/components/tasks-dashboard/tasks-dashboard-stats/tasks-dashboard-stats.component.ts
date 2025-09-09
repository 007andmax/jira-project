import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TasksStats } from '../../tasks/class/tasks-stats';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';

@Component({
  selector: 'app-tasks-dashboard-stats',
  templateUrl: './tasks-dashboard-stats.component.html',
  styleUrls: ['./tasks-dashboard-stats.component.scss']
})
export class TasksDashboardStatsComponent implements OnInit, OnDestroy {
  stats: TasksStats;
  userStatsId: string;
  currentUser: CurrentUser = new CurrentUser();
  sub: Subscription = new Subscription();
  constructor(private tasksService: TasksService,
    public usersStateService: UsersStateService,
    private tasksStateService: TasksStateService
  ) { }


  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    if (this.currentUser.id) this.getStatistics(this.currentUser.id);
    let getOnGetCurrentuser = this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getStatistics(data.id);
    });
    this.sub.add(getOnGetCurrentuser);
    let geLefttFilter = this.tasksStateService.onFilter.subscribe((data) => {
      if (data.techUser && this.userStatsId != data.techUser.id) this.getStatistics(data.techUser.id);
    });
    this.sub.add(geLefttFilter);
  }
  getStatistics(id) {
    this.userStatsId = id;
    this.tasksService.getStatistics(id).subscribe(res => {
      this.stats = new TasksStats(res);
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
