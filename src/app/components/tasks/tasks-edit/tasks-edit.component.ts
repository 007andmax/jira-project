import { Component, ViewChild } from '@angular/core';
import { TasksAddComponent } from '../tasks-add/tasks-add.component';
import { Validators } from '@angular/forms';
import { Company } from 'src/app/interfaces/company/company';
import { Service } from 'src/app/interfaces/service/service';
import { CompanySetting } from '../../companies/class/company-setting';
import { forkJoin } from 'rxjs';
import { DELETE_TASK } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { S } from '@angular/cdk/keycodes';
import { TicketProfileFormService } from '../../tickets/tickets/ticket-edit-aside/class/ticket-profile-form-service';
import { Task } from '../class/task';
import { Ticket } from '../../tickets/class/ticket';
import { TasksDatePickerComponent } from '../tasks-date-picker/tasks-date-picker.component';

@Component({
  selector: 'app-tasks-edit',
  templateUrl: './tasks-edit.component.html',
  styleUrls: ['./tasks-edit.component.scss']
})
export class TasksEditComponent extends TasksAddComponent {
  selectedCompany: Company;
  selectedTicket: Ticket = null;
  isInitEditNote: boolean = false;
  @ViewChild('datePicker', { static: false }) datePicker: TasksDatePickerComponent;
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
        undefined,
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
      attachFileIds: [[]],
      taskTicketId: [undefined],
    })
    let onOpenEditTasks = this.tasksStateService.onOpenEditTasks.subscribe(res => {
      if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
      this.tasksService.getTaskDetail(res.id).subscribe((task: any) => {
        this.task = new Task(task);
        this.modelForm.patchValue({
          title: this.task.title,
          startDate: this.task.startDate,
          description: this.task.description,
          endDate: this.task.endDate,
          assignedUsersIds: this.task.assignedUsersIds,
          type: this.task.type,
          taskStatus: this.task.taskStatus,
          companyId: this.task.companyId,
          associatedTicketId: this.task.associatedTicketId,
          dueDate: this.task.dueDate,
          ticketUpdates: this.task.ticketUpdateList,
          attachFileIds: task.attachments.map(item => item.file.id),
          taskTicketId: this.task.taskTicketId
        });
        if (this.task.hasInvoice || this.task.taskStatus === 'CLOSED') this.modelForm.get('title')?.disable();
        this.files = task.attachments.map(item => {
          return { ...item.file, showError: false }
        });
        if (this.task.associatedTicketId) this.selectedTicket = new Ticket({ id: this.task.associatedTicketId, number: this.task.associatedTicketNumber });
        this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id == this.task.companyId);
        this.selectedAssignedUsers = this.usersStateService.getAllUsers().filter(user => this.task.assignedUsersIds.some(item => item == user.id));
        let service = this.task.ticketUpdateList.find(item => item.type == "SERVICE");
        if (service) {
          this.currentService.setItem(service.services[0].item);
          this.currentService.setValidate(true);
        }
        this.selectedType = this.listTypes.find(item => item.value === this.task.type);
        this.opened = true;
        if (this.selectedCompany) this.ticketStateService.getServicesList(this.selectedCompany.id);
      });


    })
    this.sub.add(onOpenEditTasks);
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
      // this.onGetUsers();
    })
    this.sub.add(getOnUsers);
    let getOnGetServicesList = this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })
    this.sub.add(getOnGetServicesList);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_TASK) this.onDeleteTask();
      }
    })
    this.sub.add(getConfirm);
  }
  onKeyDown(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      this.editTask({ title: this.modelForm.controls["title"].value });
    }
  }
  onCloseDatePicker(event) {
    if (event && this.currentService.item) {
      let update = this.task.ticketUpdateList.find(item => item.type == "SERVICE");
      this.currentService.setDurationStart(this.modelForm.controls["startDate"].value);
      this.currentService.setDurationEnd(this.modelForm.controls["endDate"].value);
      this.currentService.calculateQuantity();
      this.ticketsService.updateExpense(this.currentService.getDateForUpdate(this.currentService.getDateForRequest(this.usersStateService.getCurrentUser(), update.services[0].id), update.id)).subscribe(res => {
      });
    }
    if (event && (this.modelForm.controls["startDate"].value != this.task.startDate || this.modelForm.controls["endDate"].value != this.task.endDate)) {
      this.editTask({
        startDate: this.modelForm.controls["startDate"].value,
        endDate: this.modelForm.controls["endDate"].value
      });
    }
  }
  onChangeTitle() {
    this.editTask({ title: this.modelForm.controls["title"].value });
  }
  onDeleteTask() {
    this.tasksService.deleteTask(this.task.id).subscribe(res => {
      this.modelForm.controls["attachFileIds"].setValue([]);
      this.close();
    });

  }
  deleteFile(index: number) {
    this.companiesService.removeAttachment(this.modelForm.controls["attachFileIds"].value[index]).subscribe(data => {

    })
    this.files.splice(index, 1);
    let list = this.modelForm.controls["attachFileIds"].value;
    list.splice(index, 1);
    this.modelForm.controls["attachFileIds"].setValue(list);
    this.editTask({ attachFileIds: this.modelForm.controls["attachFileIds"].value });
  }
  uploadFilesSimulator(index: number) {
    if (index === this.files.length) {
      this.editTask({ attachFileIds: this.modelForm.controls["attachFileIds"].value });
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
        this.files[index].id = res.id;
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
  public setAssociatedTicketId(data) {
    this.modelForm.controls["associatedTicketId"].setValue(data ? data.id : null);
    this.selectedTicket = data;
    this.editTask({ associatedTicketId: data ? data.id : "" });
  }
  onSelectCompany(data) {
    this.modelForm.controls["companyId"].setValue(data ? data.id : null)
    if (data) this.ticketStateService.getServicesList(data.id);
    this.selectedCompany = data;
    this.editTask({ companyId: data ? data.id : "" });
  }
  public onSelectTechUser(items) {
    this.modelForm.controls["assignedUsersIds"].setValue(items.map(item => item.id));
    this.selectedAssignedUsers = items;
    this.editTask({ assignedUsersIds: items.map(item => item.id) });
  }
  onSelectType(data) {
    this.modelForm.controls["type"].setValue(data ? data.value : null);
    this.selectedType = data;
    this.editTask({ type: data.value });
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
  onChangeDueDate(data) {
    let dueDate = this.task.parseDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.modelForm.controls["dueDate"].setValue(dueDate);
    this.task.dueDate = dueDate;
    this.editTask({
      dueDate: dueDate
    });
  }
  closeTask() {
    this.saveBtn.setDisabled(true);
    this.tasksService.changeStatusTask(this.task.id, "CLOSED").subscribe(res => {
      this.saveBtn.setDisabled(false);
      this.close();
    });
  }
  onChangeDescription() {
    this.editTask({
      description: this.modelForm.controls["description"].value
    });
    this.isInitEditNote = false;
  }
  deleteTask() {
    this.confirmStateService.setConfirmAction(DELETE_TASK);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `The Task has been successfully deleted`;
    this.cd.detectChanges();
  }
  public onSelectService(item) {
    if (this.currentService.item) {
      let update = this.task.ticketUpdateList.find(item => item.type == "SERVICE");
      if (!item) {
        this.ticketsService.deleteUpdate(this.task.taskTicketId, update.id).subscribe(res => {
          this.currentService = new TicketProfileFormService();
        })
        return;
      }
      this.currentService.setItem(item);
      this.currentService.setValidate(true);
      this.currentService.setDurationStart(this.modelForm.controls["startDate"].value);
      this.currentService.setDurationEnd(this.modelForm.controls["endDate"].value);
      this.currentService.calculateQuantity();
      this.ticketsService.updateExpense(this.currentService.getDateForUpdate(this.currentService.getDateForRequest(this.usersStateService.getCurrentUser(), update.services[0].id), update.id)).subscribe(res => {

      })
    } else {
      this.currentService.setItem(item);
      this.currentService.setValidate(true);
      this.currentService.setDurationStart(this.modelForm.controls["startDate"].value);
      this.currentService.setDurationEnd(this.modelForm.controls["endDate"].value);
      this.currentService.calculateQuantity();
      this.ticketsService.updateTicket(this.currentService.getDataForAddService(this.usersStateService.getCurrentUser(), this.modelForm.value.taskTicketId)).subscribe(res => {

      })
    }
  }
  openTask() {

    this.tasksService.changeStatusTask(this.task.id, 'OPEN').subscribe(res => {
      this.task.taskStatus = 'OPEN';
      this.modelForm.get('title')?.enable();
    });
  }

  editTask(data) {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    this.saveBtn.setDisabled(true);
    if (this.currentService.item && this.currentService.item.versionedId) this.modelForm.controls["ticketUpdates"].setValue([this.getDataForUpdateService()])
    this.tasksService.editTask(this.task.id, data).subscribe(res => {
      this.saveBtn.setDisabled(false);

    }, err => {
      this.saveBtn.setDisabled(false);
    })
  }
  close() {
    this.currentService = new TicketProfileFormService();
    this.opened = false;
    this.submitted = false;
    this.selectedCompany = null;
    this.selectedAssignedUsers = [];
    this.selectedType = null;
    this.modelForm.reset();
    this.files = [];
  }
}
