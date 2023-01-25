import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClickOtsideDirective } from 'src/app/directives/click-otside/click-otside.directive';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketProfileTask } from '../../class/ticket-profile-task';
import * as moment from "moment";
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_TASK_TICKET } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketsRealTimeService } from 'src/app/states/tickets/tickets-real-time.service';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'ticket-detail-tasks',
  templateUrl: './ticket-detail-tasks.component.html',
  styleUrls: ['./ticket-detail-tasks.component.scss']
})
export class TicketDetailTasksComponent implements OnInit, OnDestroy {
  showAdd: boolean = false;
  list: Array<TicketProfileTask> = [];
  addTask: TicketProfileTask = new TicketProfileTask();
  listTechUsers = [];
  sub: Subscription = new Subscription();
  @ViewChild('addTaskBtn') addTaskBtn: ClickOtsideDirective;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  constructor(private ticketsService: TicketsService,
    private ticketStateService: TicketStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private ticketsRealTimeService: TicketsRealTimeService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_TASK_TICKET) {
          this.onDelete();
        }
      }
    })
    this.sub.add(getConfirm);
    if (this.usersStateService.getAllUsers().length > 0) this.listTechUsers = this.getUsersForAssign();
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.listTechUsers = this.getUsersForAssign();
    })
    this.sub.add(getOnUsers);
    let changeTicketTasks = this.ticketsRealTimeService.changeTicketTasks.subscribe(data => {
      console.log("data", data);
      if (data.action == "TASK_EDITED") {
        let index = this.list.findIndex(item => item.id == data.data.id);
        this.list[index] = new TicketProfileTask(data.data);
      }
      if (data.action == "TASK_SAVED") this.list.push(new TicketProfileTask(data.data));
      if (data.action == "TASK_REMOVED") {
        let index = this.list.findIndex(item => item.id == data.data);
        this.list.splice(index, 1);
      }
    })
    this.sub.add(changeTicketTasks);
  }
  public getTicketTasks(id) {
    this.ticketsService.getTicketTasks(id).subscribe((data: any) => {
      this.list = data.map(item => new TicketProfileTask(item))
    })
  }
  setStatus(item, status) {
    item.setStatus(status);
    item.onInitEdit(true);
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
  }
  public onChangeDatePicker(data, item) {
    let date = new Date(data.year, data.month - 1, data.day);
    item.setDate(moment(date).format('YYYY/MM/DD'));
    item.onInitEdit(true);
  }
  public onChangeUser(data, item) {
    if (data.length === 0) item.setAssignedUser(null);
    if (data.length === 1) item.setAssignedUser(data[0]);
    item.onInitEdit(true);
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.onAddTicketTask();
  }
  remove(item) {
    this.ticketStateService.setTaskForRemove(item);
    this.confirmStateService.setConfirmAction(REMOVE_TASK_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure you want to delete this task?`;
  }
  onDelete() {
    this.ticketsService.removeTicketTask(this.ticketStateService.getTaskForRemove().id).subscribe(data => {

    })
  }
  onAddTicketTask() {
    if (this.addTask.subject.length === 0 || !this.addTaskBtn.getInit()) return;
    this.addTaskBtn.setInit(false);
    this.ticketsService.addTicketTasks(this.addTask.getDataForAdd(this.ticketProfile.id)).pipe(map((res) => res),
      catchError(error => of(undefined))).subscribe(data => {
        this.showAdd = false;
        this.addTask = new TicketProfileTask();
      }, err => {
        setTimeout(() => this.addTaskBtn.setInit(true), 2000);
      })
  }
  onEditTicketTask(item) {
    if (item.isInitEdit) {
      if (item.subject.length === 0) return;
      this.ticketsService.editTicketTask(item.getDataForUpdate()).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.onInitEdit(false);
        })
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
