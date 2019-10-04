import { Component, ViewChild, OnInit } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TechUsersService } from "src/ng2/app/services/setting/tech-users.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
declare var $;

@Component({
  selector: "app-tech-users",
  templateUrl: "./tech-users.component.html",
  styleUrls: ["./tech-users.component.scss"]
})
export class TechUsersComponent implements OnInit {
  techUsers: [];
  selectedIdx = -1;
  techUseremailNotificationList: any;
  techRoles: any;

  techUserForm: FormGroup;
  submitted = false;
  selectedTechUser: any;

  constructor(
    private modalService: BsModalService,
    private techUsersService: TechUsersService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.techUsers = [];

    this.techUserForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      primaryEmail: ["", Validators.required],
      techRole: ["", Validators.required],
      newDevice: [""],
      ticketCreated: [""],
      myTicketUpdated: [""],
      ticketCloseNotifications: [""]
    });

    this.getUsers();
    this.getRoleNames();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.techUserForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.techUserForm.invalid) {
      return;
    }

    this.selectedTechUser.firstName = this.techUserForm.value.firstName;
    this.selectedTechUser.lastName = this.techUserForm.value.lastName;
    this.selectedTechUser.primaryEmail = this.techUserForm.value.primaryEmail;
    this.selectedTechUser.techRole = this.techUserForm.value.techRole;
    this.selectedTechUser.subscription = {};
    this.selectedTechUser.initials = [
      this.techUserForm.value.firstName,
      this.techUserForm.value.lastName
    ]
      .map(function(s) {
        return s.charAt(0).toUpperCase();
      })
      .join("");

    this.selectedTechUser.companyId = this.selectedTechUser.company
      ? this.selectedTechUser.company.id
      : null;

    this.techUsersService
      .updateTechUsers(this.selectedTechUser.id, this.selectedTechUser)
      .subscribe(res => {}, error => {});

    // alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.techUserForm.value));
  }

  getRoleNames() {
    this.techUsersService.getRoleNames().subscribe(
      res => {
        if (res) {
          this.techRoles = res;
        }
        // console.log(res);
      },
      error => {}
    );
  }

  getUsers() {
    this.techUsersService
      .getUsers()
      .map((users: any) => {
        return users.filter(
          (user: any) => user.accountType.toLowerCase() === "tech"
        );
      })
      .subscribe((techUsers: any) => {
        if (techUsers) {
          this.techUsers = techUsers;
          console.log(this.techUsers);
          const techUserIdList = techUsers.map(({ id }) => id);
          this.emailNotification(techUserIdList);
        }
      });
  }

  emailNotification(techUserIdList) {
    this.techUsersService.getUsersEmailNotifications(techUserIdList).subscribe(
      eNotifications => {
        if (eNotifications) {
          this.techUseremailNotificationList = eNotifications;
          console.log(this.techUseremailNotificationList);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  emailNotificationModel(index: number) {
    if (this.selectedIdx !== index) {
      this.selectedIdx = index;
    } else {
      this.selectedIdx = -1;
    }
  }

  saveTechUserNewEmailNotificationSetting(techUserId: string) {
    if (techUserId) {
      var notificationSetting = {
        newDevice: this.techUseremailNotificationList[techUserId].newDevice,
        scheduleChanged: this.techUseremailNotificationList[techUserId]
          .scheduleChanged,
        clientCompanyUpdated: this.techUseremailNotificationList[techUserId]
          .clientCompanyUpdated,
        ticketCreated: this.techUseremailNotificationList[techUserId]
          .ticketCreated,
        myTicketUpdated: this.techUseremailNotificationList[techUserId]
          .myTicketUpdated
      };
      this.techUsersService
        .saveUsersEmailNotifications(techUserId, notificationSetting)
        .subscribe(res => {}, error => {});
    }
  }

  editTechUser(techUser) {
    if (techUser === null) {
      return;
    }

    this.selectedTechUser = techUser;
    if (techUser) {
      const notification = this.techUseremailNotificationList[techUser.id];
      this.techUserForm.patchValue({
        firstName: techUser.firstName,
        lastName: techUser.lastName,
        primaryEmail: techUser.primaryEmail,
        techRole: techUser.techRole,
        newDevice: notification.newDevice,
        ticketCreated: notification.ticketCreated,
        myTicketUpdated: notification.myTicketUpdated,
        ticketCloseNotifications: notification.ticketCloseNotifications
      });
    }
  }

  changePasswordRequest(id: string) {
    this.techUsersService.changePasswordRequest(id).subscribe(
      res => {
        console.log(res);
      },
      error => {}
    );
  }

  resendWelcomeEmail(userEmail: string) {
    this.techUsersService.verifyUserEmail(userEmail).subscribe(
      res => {
        console.log(res);
      },
      error => {}
    );
  }

  // openModal(template) {
  //   this.modalRef = this.modalService.show(
  //     template,
  //     Object.assign({}, { class: 'manage-tags modal-dialog-centered' })
  //   );
  // }

  // editTag(template2) {
  //   this.modalRef = this.modalService.show(
  //     template2,
  //     Object.assign({}, { class: 'manage-tags modal-dialog-centered' })
  //   );
  // }
}
