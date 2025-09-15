import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, forkJoin } from 'rxjs';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { TicketProfileFormService } from '../../tickets/tickets/ticket-edit-aside/class/ticket-profile-form-service';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { Task } from '../class/task';
import * as moment from "moment";

@Component({
  selector: 'app-task-header-add',
  templateUrl: './task-header-add.component.html',
  styleUrls: ['./task-header-add.component.scss']
})
export class TaskHeaderAddComponent {
  task: Task = new Task();
  modelForm: FormGroup;
  techUsersList = [];
  submitted: boolean = false;
  formatDate: string = FORMAT_DATE_2;
  @ViewChild('saveBtn', { static: false }) saveBtn: DisabledBtnDirective;
  sub: Subscription = new Subscription();
  @Output() onClose = new EventEmitter();
  constructor(public tasksStateService: TasksStateService,
    public formBuilder: FormBuilder,
    public usersStateService: UsersStateService,
    public ticketStateService: TicketStateService,
    public tasksService: TasksService,
    public companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef,
    public companiesService: CompaniesService,
    public confirmStateService: ConfirmStateService,
    public modalService: NgbModal,
  ) { }
  ngOnInit() {
    this.modelForm = this.formBuilder.group({
      title: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(300)]
      ],
      startDate: [null,
        [Validators.required]
      ],
      description: [undefined,
        [Validators.minLength(0), Validators.maxLength(65000)]
      ],
      endDate: [null],
      assignedUsersIds: [null, Validators.required],
      type: [
        null,
        [Validators.required]
      ],
      taskStatus: [
        "OPEN",
        [Validators.required]
      ],
      companyId: [
        undefined,
      ],
      associatedTicketId: [
        undefined
      ],
      dueDate: [undefined],
      ticketUpdates: [[]],
      attachFileIds: [[]]
    })

    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
      // this.onGetUsers();
    })
    this.sub.add(getOnUsers);

  }
  openAside() {
    this.tasksStateService.openAddAsideFromShortVersion(this.modelForm.value);
  }
  onSelectType(data) {
    this.modelForm.controls["type"].setValue(data ? data.value : null)
  }

  public filterByDate(value) {
    console.log("value", value);
    if (value.start !== '' && value.end !== '') {
      this.modelForm.controls["startDate"].setValue(value.start);
      this.modelForm.controls["endDate"].setValue(value.end);
    } else {
      this.modelForm.controls["startDate"].setValue(null);
      this.modelForm.controls["endDate"].setValue(null);
    }
  }
  parseStartDate(date) {
    return moment(new Date(date)).format('DD MMM, YYYY');
  }
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    }).sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
  }

  public onSelectTechUser(items) {
    console.log("items", items);
    this.modelForm.controls["assignedUsersIds"].setValue(items.map(item => item.id))
    //  this.globalFilter.setAssignedUsersIds(items.map(item => item.id));
  }
  get f2() {
    return this.modelForm.controls;
  }

  save() {
    this.submitted = true;
    console.log("this.modelForm.invalid", this.modelForm);
    if (this.modelForm.invalid) {
      return;
    }
    this.saveBtn.setDisabled(true);
    console.log("this.modelForm.value", this.modelForm.value);
    this.tasksService.addTask(this.task.getDataForAdd(this.modelForm.value)).subscribe(res => {
      this.saveBtn.setDisabled(false);
      this.close();
    }, err => {
      this.saveBtn.setDisabled(false);
    })
  }
  close() {
    this.submitted = false;
    this.modelForm.reset();
    this.modelForm.patchValue({ taskStatus: "OPEN" });
    this.onClose.emit();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
