import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CalendarWeek } from '../../../class/calenadar-week';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-tasks-calendar-week-item-all-day',
  templateUrl: './tasks-calendar-week-item-all-day.component.html',
  styleUrls: ['./tasks-calendar-week-item-all-day.component.scss']
})
export class TasksCalendarWeekItemAllDayComponent {
  @Input() list: any[] = [];
  showMore: boolean = false;
  @Output() onShowMore = new EventEmitter();
  constructor(private tasksStateService: TasksStateService,
    public usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
  ) { }
  ngOnInit() {

  }
  editTask(task) {
    console.log("editTask", task);
    this.tasksStateService.openEditAside(task);
  }
  setShowMore(data) {
    this.showMore = data;
    this.onShowMore.emit(data);
    this.cd.detectChanges();
  }

}
