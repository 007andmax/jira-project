import { Component, ViewChild } from '@angular/core';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { Task } from '../class/task';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Subscription } from 'rxjs';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { CompanySetting } from '../../companies/class/company-setting';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-tasks-add',
  templateUrl: './tasks-add.component.html',
  styleUrls: ['./tasks-add.component.scss']
})
export class TasksAddComponent {
  opened: boolean = false;
  task: Task = new Task();
  modelForm: UntypedFormGroup;
  techUsersList = [];
  servicesList = [];
  submitted: boolean = false;
  listTypes = [new CompanySetting('Meeting', 'Meeting'),
  new CompanySetting('To do', 'To do'),
  new CompanySetting('Phone call', 'Phone call')];
  formatDate: string = FORMAT_DATE_2;
  @ViewChild('saveBtn', { static: false }) saveBtn: DisabledBtnDirective;
  sub: Subscription = new Subscription();
  activeTab: string = "description";
  description: string;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '100%',
    minHeight: '5rem',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Write ticket conversation here…',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarPosition: 'bottom',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: false,
  };
  constructor(private tasksStateService: TasksStateService,
    public formBuilder: UntypedFormBuilder,
    private usersStateService: UsersStateService,
    public ticketStateService: TicketStateService,
    private tasksService: TasksService,
    private companiesStateService: CompaniesStateService,
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
      description: [null,
        [Validators.minLength(0), Validators.maxLength(65000)]
      ],
      endDate: [null],
      assignedUsersIds: [[], Validators.required, Validators.minLength(1)],
      type: [
        null,
        [Validators.required]
      ],
      taskStatus: [
        "OPEN",
        [Validators.required]
      ],
      companyId: [
        null,
      ],
      associatedTicketId: [
        null
      ],
      dueDate: [null],
    })
    this.tasksStateService.onOpenAddTasks.subscribe(res => {
      this.opened = true;
      // this.getServices();
    })
    if (this.usersStateService.getAllUsers().length > 0) {
      this.onGetTechUsers(this.usersStateService.getAllUsers());
      //  this.onGetUsers();
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
      // this.onGetUsers();
    })
    this.sub.add(getOnUsers);
    let getOnGetServicesList = this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })
    this.sub.add(getOnGetServicesList);
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  public getServices() {
    this.servicesList = this.ticketStateService.getServicesForTicket();
    console.log("this.servicesList", this.servicesList);
  }
  onSelectType(data) {
    this.modelForm.controls["type"].setValue(data ? data.value : null)
  }
  onSelectCompany(data) {
    this.modelForm.controls["companyId"].setValue(data ? data.id : null)
    if (data) this.ticketStateService.getServicesList(data.id);
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
  onChangeDueDate(data) {
    console.log("data", data);

    this.modelForm.controls["dueDate"].setValue(this.task.parseDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset));
  }
  onChangeTimeEstimate(data) {
    // this.contractsBlockTime.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

  }
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    }).sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
  }
  public onSelectService(item) {
    // this.addedServiceList[i].setItem(item);
    // this.addedServiceList[i].setValidate(true);
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
    if (this.modelForm.invalid) {
      return;
    }
    this.saveBtn.setDisabled(true);
    console.log("this.modelForm.value", this.modelForm.value);

    this.tasksService.addTask(this.modelForm.value).subscribe(res => {
      this.saveBtn.setDisabled(false);
      this.close();
    })
  }
  close() {
    this.opened = false;
    this.submitted = false;
    this.modelForm.reset();
    this.modelForm.patchValue({ taskStatus: "OPEN" });
  }
}
