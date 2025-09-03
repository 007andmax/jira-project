import { ChangeDetectorRef, Component } from '@angular/core';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { Task } from '../class/task';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  providers: [TicketsListService]
})
export class TasksListComponent {
  list: Array<Task> = [];
  showPreloader: boolean = true;
  showPendingPreloader: boolean = false;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  offset: number = 10;
  container = document.body.querySelector(".main-container");

  constructor(private tasksService: TasksService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.onScroll();
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
  private getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }

    if (this.page_number > 0) this.showPendingPreloader = true;
    this.tasksService.getTasks(this.page_number).subscribe((data: Array<Task>) => {
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
}
