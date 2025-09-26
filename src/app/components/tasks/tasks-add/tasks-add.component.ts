import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { Task } from '../class/task';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { forkJoin, Subscription } from 'rxjs';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { CompanySetting } from '../../companies/class/company-setting';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketProfileFormService } from '../../tickets/tickets/ticket-edit-aside/class/ticket-profile-form-service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-tasks-add',
  templateUrl: './tasks-add.component.html',
  styleUrls: ['./tasks-add.component.scss']
})
export class TasksAddComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  task: Task = new Task();
  modelForm: FormGroup;
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
  currentService: TicketProfileFormService = new TicketProfileFormService();
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
    sanitize: false
  };
  files = [];
  selectedAssignedUsers = [];
  selectedType: CompanySetting;
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
    public ticketsService: TicketsService
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
    let onOpenAddTasks = this.tasksStateService.onOpenAddTasks.subscribe(res => {
      if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
      this.opened = true;
      // this.getServices();
    })
    this.sub.add(onOpenAddTasks)
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
      // this.onGetUsers();
    })
    this.sub.add(getOnUsers);
    let getOnGetServicesList = this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })
    this.sub.add(getOnGetServicesList);
    let onOpenAddTasksFromShortVersion = this.tasksStateService.onOpenAddTasksFromShortVersion.subscribe(res => {
      if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());

      this.modelForm.patchValue({
        title: res.title,
        startDate: res.startDate,
        endDate: res.endDate,
        assignedUsersIds: res.assignedUsersIds,
        type: res.type,
        taskStatus: res.taskStatus,
      })
      this.selectedType = this.listTypes.find(item => item.value === res.type);
      if (res.assignedUsersIds) this.selectedAssignedUsers = this.usersStateService.getAllUsers().filter(user => res.assignedUsersIds.some(item => item == user.id));
      this.opened = true;
    })
    this.sub.add(onOpenAddTasksFromShortVersion)
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  public setAssociatedTicketId(data) {
    this.modelForm.controls["associatedTicketId"].setValue(data ? data.id : null)
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
  public fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }
  uploadFilesSimulator(index: number) {
    if (index === this.files.length) {
      return;
    } else {
      if (this.files[index].size > 15000000) {
        this.files[index].showError = true;
        this.files[index].error = "The size is too big. You can upload a file up to 15MB in size."
        this.uploadFilesSimulator(index + 1);
        return;
      }
      this.uploadFile(this.files[index]).then((data: any) => {
        let res = JSON.parse(data.response);
        let listIds = this.modelForm.controls["attachFileIds"].value;
        console.log("res", res);
        listIds.push(res.id);
        this.modelForm.controls["attachFileIds"].setValue(listIds);
        this.uploadFilesSimulator(index + 1);
        this.cd.detectChanges();
      }).catch(() => {
        this.files[index].showError = true;
        this.uploadFilesSimulator(index + 1);
      });
    }
  }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      var fd = new FormData();
      fd.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (event) => {
        resolve(xhr);
      }, false);
      xhr.upload.onprogress = (event) => {
        file.progress = Math.round((event.loaded / event.total) * 100);
      }
      xhr.addEventListener("error", (error) => {
        reject(error);
      }, false);
      xhr.open("POST", "/file?isAvatar=false");
      xhr.send(fd);
    });
  }
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
    this.currentService.setItem(item);
    this.currentService.setValidate(true);
  }
  deleteFile(index: number) {
    this.companiesService.removeAttachment(this.modelForm.controls["attachFileIds"].value[index]).subscribe(data => {

    })
    this.files.splice(index, 1);
    let list = this.modelForm.controls["attachFileIds"].value;
    list.splice(index, 1);
    this.modelForm.controls["attachFileIds"].setValue(list);
  }
  public onSelectTechUser(items) {
    console.log("items", items);
    this.modelForm.controls["assignedUsersIds"].setValue(items.map(item => item.id))
    //  this.globalFilter.setAssignedUsersIds(items.map(item => item.id));
  }
  get f2() {
    return this.modelForm.controls;
  }
  public getDataForUpdateService() {
    this.currentService.setDurationStart(this.modelForm.controls["startDate"].value);
    this.currentService.setDurationEnd(this.modelForm.controls["endDate"].value);
    this.currentService.calculateQuantity();
    return {
      services: [this.currentService.getDateForRequest(this.usersStateService.getCurrentUser())],
      type: "SERVICE",
      shares: [],
      ticket: {},
      otherRecipients: []
    }
  }
  save() {
    this.submitted = true;
    console.log("this.modelForm.invalid", this.modelForm);
    if (this.modelForm.invalid) {
      return;
    }
    this.saveBtn.setDisabled(true);
    console.log("this.modelForm.value", this.modelForm.value);
    if (this.currentService.item && this.currentService.item.versionedId) this.modelForm.controls["ticketUpdates"].setValue([this.getDataForUpdateService()])
    this.tasksService.addTask(this.task.getDataForAdd(this.modelForm.value)).subscribe(res => {
      this.saveBtn.setDisabled(false);
      this.modelForm.controls["attachFileIds"].setValue([]);
      this.close();
    }, err => {
      this.saveBtn.setDisabled(false);
    })
  }
  close() {
    console.log(this.modelForm.controls["attachFileIds"].value);
    if (this.modelForm.controls["attachFileIds"].value && this.modelForm.controls["attachFileIds"].value.length > 0) {
      forkJoin(
        this.modelForm.controls["attachFileIds"].value.map(item => this.companiesService.removeAttachment(item))
      ).subscribe(result => {

      });
    }
    this.opened = false;
    this.submitted = false;
    this.modelForm.reset();
    this.modelForm.patchValue({ taskStatus: "OPEN" });
    this.files = [];
    this.currentService = new TicketProfileFormService();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
