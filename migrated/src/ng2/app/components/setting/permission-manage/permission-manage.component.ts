import { Component, OnInit, OnDestroy } from '@angular/core';
import { PermissionManageService } from './permission-manage.service';
import { map, catchError } from 'rxjs/operators';
import { SettingService } from 'src/ng2/app/services/setting/setting.service';
import { of } from 'rxjs';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
@Component({
  selector: 'app-permission-manage',
  templateUrl: './permission-manage.component.html',
  styleUrls: ['./permission-manage.component.scss']
})
export class PermissionManageComponent implements OnInit, OnDestroy {
  selectedRoleIndex = -1;
  selectedRole: string;
  loading = false;
  isNewRoleCreating = false; // see on old code
  allTechRoles: any;
  roles: any;
  techCompany: any;
  currentUser: any;
  promise;
  editData = {
    name: '',
    id: ''
  };
  isRoleNameEdited = false;
  usersToShift: any;
  roleToDelete: any;
  allUsers = [];

  companiesRelatedPermissions = [];
  userRelatedPermissions = [];
  accountingRelatedPermissions = [];
  productsRelatedPermissions = [];
  passwordsRelatedPermissions = [];
  viewPasswordsRelatedPermissions = [];
  sections = {};

  delete = false;

  constructor(
    private permissionManageService: PermissionManageService,
    private settingService: SettingService,
    private usersService: UsersService,
    private toastrService: ToastrService
  ) {
    this.companiesRelatedPermissions = this.permissionManageService.getCompaniesRelatedPermissions();
    this.userRelatedPermissions = this.permissionManageService.getUserRelatedPermissions();
    this.accountingRelatedPermissions = this.permissionManageService.getAccountingRelatedPermissions();
    this.productsRelatedPermissions = this.permissionManageService.getProductsRelatedPermissions();
    this.passwordsRelatedPermissions = this.permissionManageService.getPasswordsRelatedPermissions();
    this.viewPasswordsRelatedPermissions = this.permissionManageService.getViewPasswordsRelatedPermissions();
    this.sections = this.permissionManageService.getsections();
  }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    $(".loading").css({"top": "100px", "bottom": "unset"});
    this.allUsers = [];
    this.getPermissionManage();
    this.getRoleNames();
    this.currentCompany();
    this.getAllUsers();
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
    $(".loading").css({"top": "-53px", "bottom": "0"});
  }

  /**
   * get all users
   */
  getAllUsers() {
    this.usersService
      .getAllusers()
      .pipe(
        map((users: any) => {
          this.allUsers = users;
        })
      )
      .subscribe();
  }

  /**
   * current comapny
   */
  currentCompany() {
    this.settingService
      .currentCompany()
      .pipe(
        map(res => {
          this.techCompany = res;
        })
      )
      .subscribe();
  }

  /**
   * permission manage
   */
  getPermissionManage() {
    this.loading = true;$(".loading").css("display", "block");
    this.permissionManageService
      .getPermissions()
      .pipe(
        map(res => {
          this.loading = false;$(".loading").css("display", "none");
          this.roles = res;
        }),
        catchError(err => {
          this.loading = false;$(".loading").css("display", "none");
          throw err.message;
        })
      )
      .subscribe();
  }

  /**
   * get role names
   */
  getRoleNames() {
    this.permissionManageService
      .getRoleNames()
      .pipe(
        map(res => {
          this.allTechRoles = res;
        })
      )
      .subscribe();
  }

  editRole(role: any, index: number) {
    this.selectedRoleIndex = index;
    this.selectedRole = role;
  }

  /**
   * add new role
   */
  addNewRole() {
    this.isNewRoleCreating = true;

    let maxNum = 0;

    this.roles.forEach(roleEle => {
      const role = roleEle;
      const secondPart = roleEle.name.split('#')[1];

      if (secondPart) {
        if (+secondPart == secondPart) {
          maxNum = +secondPart > maxNum ? +secondPart : maxNum;
        }
      }
    });

    if (maxNum) {
      maxNum++;
    }

    const newRole = {
      company: this.techCompany,
      name: 'New role #' + (maxNum || this.roles.length),
      order: this.roles.length,
      permissions: []
    };

    this.loading = true;$(".loading").css("display", "block");
    this.permissionManageService
      .createTechRole(newRole)
      .pipe(
        map(res => {
          this.toastrService.success('Role Added Successfully');
          this.loading = false;$(".loading").css("display", "none");
          this.isNewRoleCreating = false;
          if (res) {
            this.roles.push(res);
          }
        })
      )
      .subscribe(() => {
        this.getRoleNames();
      });
  }

  /**
   * changed role name
   */
  changeRoleName() {
    this.loading = true;$(".loading").css("display", "block");
    this.permissionManageService
      .updateTechRole(this.editData.id, this.editData.name)
      .pipe(
        map(res => {
          this.toastrService.success('Role changed successfully');
          this.loading = false;$(".loading").css("display", "none");
          const role = this.roles.find(el => {
            return el.id === this.editData.id;
          });

          role.name = this.editData.name;

          this.editRoleName(role, -1);
        })
      )
      .subscribe();
  }

  /**
   * edit role name based on params
   * @param role
   * @param index
   */
  editRoleName(role: any, index: number) {
    this.selectedRoleIndex = index;
    this.selectedRole = role;
    if (!role.name || (this.isRoleNameEdited && role.id === this.editData.id)) {
      this.selectedRoleIndex = -1;
      this.isRoleNameEdited = false;
      this.editData = {
        name: '',
        id: ''
      };
      return;
    }

    this.isRoleNameEdited = true;
    this.editData = {
      name: role.name,
      id: role.id
    };
  }

  /**
   * delete role based on params
   * @param id
   * @param isModal
   */
  deleteRole(id, isModal) {
    if (!id) {
      return;
    }
    // this.loading = true;$(".loading").css("display", "block");
    this.permissionManageService.deleteTechRole(id).subscribe(
      (res: any) => {
        this.toastrService.success('Deleted Role Successfully');
        this.loading = false;$(".loading").css("display", "none");
        if (res.length > 0) {
          this.usersToShift = res.map((user: any) => {
            const newUser = user.id; // this.permissionManageService.getOnebyId(user.id);
            newUser.companyId = newUser.company.id;
            if (!newUser.subscription) {
              newUser.subscription = {
                id: null,
                invoice: null,
                ticket: null,
                ticketManager: null
              };
            }
            return newUser;
          });

          this.roleToDelete = id;
        
        } else {
          this.delete = false;
          this.loading = false;$(".loading").css("display", "none");
          this.roles = this.roles.filter(el => {
            return el.id !== id;
          });
        }
      },
      (error: any) => {
        this.loading = false;$(".loading").css("display", "none");
        const errorData = error ? error.error : null;
        if (errorData && error.status === 406) {
          this.usersToShift = errorData.map((user: any) => {
            const newUser = this.allUsers.find(x => x.id == user.id);
            if (newUser) {
              if (newUser.firstName === 'Joana') {
           
              }
              newUser.companyId = newUser.company.id;
              if (!newUser.subscription) {
                newUser.subscription = {
                  id: null,
                  invoice: null,
                  ticket: null,
                  ticketManager: null
                };
              }
            }

            return newUser;
          });

          this.roleToDelete = id;
        } else {
          this.delete = false;
          this.roles = this.roles.filter(el => {
            return el.id !== id;
          });
        }
      }
    );
  }

  /**
   * all roles
   * @param id
   */
  allRolesAreChanged(id: string) {
    const roles = this.roles;

    const roleToDelete = roles.find((role: any) => {
      return role.id === id;
    });

    

    for (let i = 0; i < this.usersToShift.length; i++) {
      const user = this.usersToShift[i];
    
      if (user.techRole === roleToDelete.name) {
        return true;
      }
    }

    return false;
  }

  /**
   *
   * @param str
   */
  userReadable(str: string) {
    return str
      .split('_')
      .map(function(word) {
        return word[0] + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  /**
   *
   * @param role
   * @param permission
   */
  togglePermission(role, permission) {
    this.addOrRemovePermission(role.permissions, permission);

    clearTimeout(this.promise);

    this.promise = setTimeout(() => {
      this.permissionManageService
        .permissions(role)
        .pipe(
          map(res => {
         
          })
        )
        .subscribe();
    }, 500);
  }

  /**
   * add or remove permission
   * @param permissions
   * @param permission
   */
  addOrRemovePermission(permissions, permission) {
    const index = permissions.indexOf(permission);
    let relatedPermissions: any;

    if (index > -1) {
      permissions.splice(index, 1);

      switch (permission) {
        case 'VIEW_COMPANIES':
          relatedPermissions = this.companiesRelatedPermissions.concat([
            'VIEW_PASSWORD'
          ]);
          break;
        case 'VIEW_USERS':
          relatedPermissions = this.userRelatedPermissions;
          break;
        case 'VIEW_ACCOUNTING':
          relatedPermissions = this.accountingRelatedPermissions;
          break;
        case 'VIEW_PRODUCT_COST':
          relatedPermissions = this.productsRelatedPermissions;
          break;
        case 'VIEW_PASSWORD_SECTION':
          relatedPermissions = this.passwordsRelatedPermissions;
          break;
        case 'VIEW_PASSWORD':
          relatedPermissions = this.passwordsRelatedPermissions;
          break;
        default:
          break;
      }

      if (relatedPermissions) {
        relatedPermissions.forEach(relatedPermission => {
          const relatedIndex = permissions.indexOf(relatedPermission);

          if (relatedIndex > 1) {
            permissions.splice(relatedIndex, 1);
          }
        });
      }
    } else {
      permissions.push(permission);
    }
  }

  /**
   * is permission disbaled
   * @param permission
   * @param role
   */
  isPermissionDisabled(permission, role) {
    if (
      role.permissions.indexOf('VIEW_COMPANIES') === -1 &&
      this.companiesRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      role.permissions.indexOf('VIEW_USERS') === -1 &&
      this.userRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      role.permissions.indexOf('VIEW_ACCOUNTING') === -1 &&
      this.accountingRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      role.permissions.indexOf('VIEW_PRODUCT_COST') === -1 &&
      this.productsRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      role.permissions.indexOf('VIEW_PASSWORD_SECTION') === -1 &&
      this.passwordsRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      role.permissions.indexOf('VIEW_PASSWORD') === -1 &&
      this.viewPasswordsRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * changed user role
   * @param user
   * @param event
   */
  changeUsersRole(user, event) {
    user.techRole = event.target.value;
   

    this.loading = true;$(".loading").css("display", "block");
    user.avatar.cropped = null;
    this.permissionManageService.save(user).subscribe(res => {
      this.loading = false;$(".loading").css("display", "none");
      this.toastrService.success('Role Changed Successfully');
      const userIndex = this.usersToShift.findIndex(el => el.id === user.id);

      if (userIndex !== -1) {
        const newUser = this.allUsers.find(x => x.id == user.id);
        newUser.companyId = newUser.company.id;
        if (!newUser.subscription) {
          newUser.subscription = {
            id: null,
            invoice: null,
            ticket: null,
            ticketManager: null
          };
        }
        this.usersToShift[userIndex] = newUser;
      }
    });
  }

  onBackMenu() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('backMenu'); // remove the class
    body.classList.add('backMenu');
  }

  displayFrstLstChar(techUser: any) {
    if (techUser) {
      return [techUser.firstName, techUser.lastName]
        .map(function(s) {
          return s.charAt(0).toUpperCase();
        })
        .join('');
    }
  }
}
