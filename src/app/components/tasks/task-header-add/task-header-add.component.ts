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
import { TasksDatePickerComponent } from '../tasks-date-picker/tasks-date-picker.component';
import { TaskHeaderAddTypeComponent } from './task-header-add-type/task-header-add-type.component';

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
  @ViewChild('type', { static: true }) type: TaskHeaderAddTypeComponent;
  @ViewChild('tachUser', { static: true }) tachUser: TasksDatePickerComponent;
  @ViewChild('datePicker', { static: true }) datePicker: TasksDatePickerComponent;
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
    /*  if (this.companiesStateService.getCurrentCompany()) this.initModelForm();
      let getOnCurrentCompany = this.companiesStateService.getOnCurrentCompany().subscribe(data => {
        if (data) this.initModelForm();
      });
      this.sub.add(getOnCurrentCompany);*/

    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
      // this.onGetUsers();
    })
    this.sub.add(getOnUsers);
  }
  initModelForm() {
    let step = 1;
    let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany() ? this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval : '';
    if (serviceExpenseDurationPickerInterval === 'ONE_MINUTE') step = 1;
    if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') step = 5;
    if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') step = 10;
    if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') step = 15;
    let currentDate = new Date();
    this.modelForm = this.formBuilder.group({
      title: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(300)]
      ],
      startDate: [currentDate.getTime(),
      [Validators.required]
      ],
      description: [undefined,
        [Validators.minLength(0), Validators.maxLength(65000)]
      ],
      endDate: [currentDate.getTime() + (step * 60 * 1000)],
      assignedUsersIds: [null],
      type: [
        "To do",
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
      attachFileIds: [[]]
    })
    this.datePicker.setEditDates(this.modelForm.value.startDate, this.modelForm.value.endDate);

  }
  toggleStatus() {
    if (this.modelForm.value.taskStatus == 'OPEN') {
      this.modelForm.controls["taskStatus"].setValue('CLOSED');
    } else {
      this.modelForm.controls["taskStatus"].setValue('OPEN');
    }
  }
  openAside() {
    this.tasksStateService.openAddAsideFromShortVersion(this.modelForm.value);
    this.close();
  }
  onSelectType(data) {
    this.modelForm.controls["type"].setValue(data ? data.value : null)
  }

  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      this.modelForm.controls["startDate"].setValue(value.start);
      this.modelForm.controls["endDate"].setValue(value.end);
    } else {
      this.modelForm.controls["startDate"].setValue(null);
      this.modelForm.controls["endDate"].setValue(null);
    }
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.save();
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
    this.modelForm.controls["assignedUsersIds"].setValue(items.map(item => item.id))
    //  this.globalFilter.setAssignedUsersIds(items.map(item => item.id));
  }
  get f2() {
    return this.modelForm.controls;
  }

  save() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    this.saveBtn.setDisabled(true);
    if (!this.modelForm.value.assignedUsersIds) this.modelForm.controls["assignedUsersIds"].setValue([this.usersStateService.getCurrentUser().id]);
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
    let currentDate = new Date();
    let step = 1;
    let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany() ? this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval : '';
    if (serviceExpenseDurationPickerInterval === 'ONE_MINUTE') step = 1;
    if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') step = 5;
    if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') step = 10;
    if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') step = 15;
    this.modelForm.patchValue({
      taskStatus: "OPEN",
      type: "To do",
      startDate: currentDate.getTime(),
      endDate: currentDate.getTime() + (step * 60 * 1000),
    });
    this.type.initDefaultValue();
    this.datePicker.setEditDates(this.modelForm.value.startDate, this.modelForm.value.endDate);
    this.tachUser.clearWithOutChanges();
    this.onClose.emit();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
