import { Component } from '@angular/core';
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

@Component({
  selector: 'app-tasks-edit',
  templateUrl: './tasks-edit.component.html',
  styleUrls: ['./tasks-edit.component.scss']
})
export class TasksEditComponent extends TasksAddComponent {
  selectedCompany: Company;
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
        console.log("this.task", this.task);
        console.log("this.modelForm", this.modelForm);
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
          attachFileIds: this.task.attachFileIds
        })
        this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id == this.task.companyId);
        this.selectedAssignedUsers = this.usersStateService.getAllUsers().filter(user => this.task.assignedUsersIds.some(item => item == user.id));
        let service = this.task.ticketUpdateList.find(item => item.type == "SERVICE");
        console.log("service", service);
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
  onDeleteTask() {
    this.tasksService.deleteTask(this.task.id).subscribe(res => {
      this.modelForm.controls["attachFileIds"].setValue([]);
      this.close();
    });

  }
  onSelectCompany(data) {
    this.modelForm.controls["companyId"].setValue(data ? data.id : null)
    if (data) this.ticketStateService.getServicesList(data.id);
    this.selectedCompany = data;
    this.save();
  }
  public onSelectTechUser(items) {
    console.log("items", items);
    this.modelForm.controls["assignedUsersIds"].setValue(items.map(item => item.id));
    this.selectedAssignedUsers = items;
    this.save();
    //  this.globalFilter.setAssignedUsersIds(items.map(item => item.id));
  }
  onSelectType(data) {
    this.modelForm.controls["type"].setValue(data ? data.value : null);
    this.selectedType = data;
  }
  onChangeDueDate(data) {
    console.log("data", data);
    let dueDate = this.task.parseDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.modelForm.controls["dueDate"].setValue(dueDate);
    this.task.dueDate = dueDate;
  }
  deleteTask() {
    this.confirmStateService.setConfirmAction(DELETE_TASK);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `The Task has been successfully deleted`;
    this.cd.detectChanges();
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
    this.tasksService.editTask(this.task.id, this.task.getDataForAdd(this.modelForm.value)).subscribe(res => {
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
