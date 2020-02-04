'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.permissionsManagementCtrl',
    ['$scope', 'CompaniesService', '$timeout', 'UsersService', '$uibModal', '$rootScope', function ($scope, CompaniesService, $timeout, UsersService, $uibModal, $rootScope) {
      var promise;
      var companiesRelatedPermissions = ['CREATE_COMPANIES', 'EDIT_COMPANIES', 'ARCHIVE_COMPANIES',
        'NETWORK_SCAN_CLIENTS', 'REMOTE_CONNECTIONS', 'MODIFY_SETTINGS', 'VIEW_PASSWORD_SECTION',
        'CREATE_PASSWORD', 'EDIT_PASSWORD'];
      var userRelatedPermissions = ['CREATE_USERS', 'EDIT_USERS', 'ARCHIVE_USERS'];
      var accountingRelatedPermissions = ['CREATE_INVOICE'];
      var productsRelatedPermissions = ['MANAGE_PRODUCTS'];
      var passwordsRelatedPermissions = ['VIEW_PASSWORD', 'CREATE_PASSWORD', 'EDIT_PASSWORD', 'DELETE_PASSWORD'];
      var viewPasswordsRelatedPermissions = ['CREATE_PASSWORD', 'EDIT_PASSWORD'];

      $scope.sections = {
        'Tickets Area': ['EDIT_TICKETS', 'DELETE_TICKETS', 'REOPEN_CLOSED_TICKETS', 'EDIT_ANOTHER_USERS_TICKET'],
        'Company Area': ['VIEW_COMPANIES', 'CREATE_COMPANIES', 'EDIT_COMPANIES', 'ARCHIVE_COMPANIES', 'VIEW_USERS', 'CREATE_USERS', 'EDIT_USERS', 'ARCHIVE_USERS'],
        'Accounting': ['VIEW_ACCOUNTING', 'CREATE_INVOICE', 'MANAGE_PRODUCTS', 'VIEW_PRODUCT_COST', 'MANAGE_SERVICES', 'VIEW_TICKET_AND_INVOICE_SETTINGS', 'DELETE_SERVICE_AGREEMENTS', 'VIEW_SERVICE_AGREEMENTS'],
        'Devices': ['NETWORK_SCAN_CLIENTS', 'REMOTE_CONNECTIONS', 'MODIFY_SETTINGS'],
        'Passwords': ['VIEW_PASSWORD_SECTION', 'VIEW_PASSWORD', 'CREATE_PASSWORD', 'EDIT_PASSWORD', 'DELETE_PASSWORD'],
        'Quick Support': ['ALLOW_QUICK_CONNECT'],
        'Reports': ['VIEW_SALES_REPORT', 'VIEW_FINANCIAL_REPORT', 'VIEW_PERFORMANCE_REPORT', 'VIEW_REMOTE_ACCESS_REPORT', 'VIEW_TAXES_REPORT', 'VIEW_DEVICES_REPORTS'],
        "Settings": ['VIEW_COMPANY_PROFILE_SETTINGS', 'VIEW_TECH_USERS_SETTINGS', 'VIEW_PERMISSIONS_SETTINGS', 'VIEW_EMAIL_SETTINGS', 'VIEW_TAXES_SETTINGS', 'VIEW_EMAIL_TEMPLATES_SETTINGS', 'VIEW_TAGS_SETTINGS']
      };

      CompaniesService.getPermissions(function (resp) {
        $scope.roles = resp;
      });

      $scope.$watch(function() {
        return $rootScope.techRolesChanged;
      }, function(val) {
        if (val) {
          if (typeof val === 'string') {
            $scope.roles = $scope.roles.filter(function(el) {
              return el.id !== val;
            })
          } else {
            var index = $scope.roles.findIndex(function(el) {
              return el.id === val.id
            });

            if (index !== -1) {
              $scope.roles[index] = val;
            } else {
              $scope.roles.push(val);
            }
          }
        }
      })


      $scope.$watch(function() {
        return $rootScope.changedPermission;
      }, function(val) {
        if (val && !$rootScope.arePermissionsSavedHere) {
          var id = val.id;
          var index = $scope.roles.findIndex(function(el) {
            return el.id === id;
          })

          $scope.roles.splice(index, 1, val);
        } else if ($rootScope.arePermissionsSavedHere) {
          $rootScope.arePermissionsSavedHere = false;
        }

      });



      CompaniesService.getTechRoles(function (resp) {
        $scope.allTechRoles = resp;

      });

      $scope.techCompany = CompaniesService.getOneById(UsersService.getCurrentUser().company.id);
      $scope.togglePermission = function (role, permission) {
        addOrRemovePermission(role.permissions, permission);

        if (promise) {
          $timeout.cancel(promise);
        }

        promise = $timeout(function () {
          $rootScope.arePermissionsSavedHere = true;
          CompaniesService.savePermissions(role);
        }, 500);
      };

      $scope.userReadable = function (str) {
        return str.split('_').map(function (word) {
          return word[0] + word.slice(1).toLowerCase();
        }).join(' ');
      };

      $scope.$watch(function() {
        return $rootScope.deleteRoleId;
      }, function(val) {
        if (val) {
          $rootScope.deleteRoleId = null;
          $scope.roles = $scope.roles.filter(function(el) {
            return el.id !== val;
          })
        }
      })

      $scope.isPermissionDisabled = function (permission, role) {

        if (role.permissions.indexOf('VIEW_COMPANIES') === -1 && companiesRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('VIEW_USERS') === -1 && userRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('VIEW_ACCOUNTING') === -1 && accountingRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('VIEW_PRODUCT_COST') === -1 && productsRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('VIEW_PASSWORD_SECTION') === -1 && passwordsRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('VIEW_PASSWORD') === -1 && viewPasswordsRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.getRelatedPermission = function (permission) {
        if (companiesRelatedPermissions.indexOf(permission) > -1) {
          if (passwordsRelatedPermissions.indexOf(permission) > -1) {
            if (viewPasswordsRelatedPermissions.indexOf(permission) > -1) {
              return 'View Companies, View Passwords Section and View Passwords';
            }
            return 'View Companies and View Passwords Section';
          }
          return 'View Companies';
        } else if (userRelatedPermissions.indexOf(permission) > -1) {
          return 'View Users';
        } else if (accountingRelatedPermissions.indexOf(permission) > -1) {
          return 'View Accounting';
        } else if (productsRelatedPermissions.indexOf(permission) > -1) {
          return 'View Product Cost';
        } else if (passwordsRelatedPermissions.indexOf(permission) > -1) {
          return 'View Passwords Section';
        } else if (viewPasswordsRelatedPermissions.indexOf(permission) > -1) {
          return 'View Passwords';
        } else {
          return 'required permission';
        }
      };

      $scope.editData = {
        name: '',
        id: ''
      }

      $scope.editRoleName = function(name, id) {
        if (!name || $scope.isRoleNameEdited && id === $scope.editData.id) {
          $scope.isRoleNameEdited = false;
          $scope.editData = {
            name: '',
            id: ''
          }
          return;
        }

        $scope.isRoleNameEdited = true;
        $scope.editData = {
          name: name,
          id: id
        }
      }

      $scope.addNewRole = function() {
        $scope.isNewRoleCreating = true;
        var maxNum = 0;

        for (var i = 0; i < $scope.roles.length; i++) {
          var role = $scope.roles[i];
          var secondPart = role.name.split('#')[1];

          if (secondPart) {
            if (+secondPart == secondPart) {
              maxNum = +secondPart > maxNum ? +secondPart : maxNum;
            }
          }


        }

        if (maxNum) maxNum++


        var newRole = {
          company: $scope.techCompany,
          name: 'New role #' + (maxNum || $scope.roles.length) ,
          order: $scope.roles.length,
          permissions: []
        }

        CompaniesService.addNewRole(newRole, function(resp) {
          $scope.isNewRoleCreating = false
          // $scope.roles.push(resp);
        })
      }

      $scope.deleteRole = function(id, isModal) {
        CompaniesService.deleteRole(id, function(resp) {
          if (resp.length) {
            $scope.usersToShift = resp.map(function(user) {
              var newUser = UsersService.getOneById(user.id)
              newUser.companyId = newUser.company.id;
              if (!newUser.subscription) {
                newUser.subscription = {id: null, invoice: null, ticket: null, ticketManager: null}
              }

              return newUser;
            });

            $scope.roleToDelete = id;

             var modalInstance = $uibModal.open({
               templateUrl: '/ng1/scripts/core/settings/permissions-management/delete-role.tpl.html',
               animation: true,
               backdrop: false,
               size: 'xs',
               controller: 'deleteRoleCtrl',
               windowClass: 'create-popup margin-top-modal-dialog',
               scope: $scope

             });
          } else {
            $rootScope.deleteRoleId = id;

          }
        })
      }

      $scope.allRolesAreChanged = function(id) {

        var roles = $scope.roles;

        var roleToDelete = roles.find(function(role) {
          return role.id === id;
        });

        // console.log(id, roleToDelete, roles, 'IM HERE SDADASDAS')

        for (var i = 0; i < $scope.usersToShift.length; i++) {
          var user = $scope.usersToShift[i];
          // console.log(user.techRole, roleToDelete.name, user.techRole === roleToDelete.name, 'userROle')
          if (user.techRole === roleToDelete.name) {
            return true;
          }
        }

        return false;
      }

      $scope.changeUsersRole = function(user) {
        UsersService.save(user, function (resp) {
          var userIndex = $scope.usersToShift.findIndex(function(el) {
            return el.id === user.id
          });

          if (userIndex !== -1) {
            var newUser = UsersService.getOneById(user.id);
            newUser.companyId = newUser.company.id;
            if (!newUser.subscription) {
              newUser.subscription = {id: null, invoice: null, ticket: null, ticketManager: null}
            }
            $scope.usersToShift[userIndex] = newUser;
          }
        }, true)
      }

      $scope.changeRoleName = function() {
        CompaniesService.changeRoleName($scope.editData.name, $scope.editData.id, function(resp) {
          var role = $scope.roles.find(function(el) {
            return el.id === $scope.editData.id;
          })

          role.name = $scope.editData.name;

          $scope.editRoleName();
        })
      }

      function addOrRemovePermission(permissions, permission) {
        var index = permissions.indexOf(permission),
          relatedPermissions;

        if (index > -1) {
          permissions.splice(index, 1);

          if (permission === 'VIEW_COMPANIES') {
            relatedPermissions = companiesRelatedPermissions.concat(['VIEW_PASSWORD']);
          } else if (permission === 'VIEW_USERS') {
            relatedPermissions = userRelatedPermissions;
          } else if (permission === 'VIEW_ACCOUNTING') {
            relatedPermissions = accountingRelatedPermissions;
          } else if (permission === 'VIEW_PRODUCT_COST') {
            relatedPermissions = productsRelatedPermissions;
          } else if (permission === 'VIEW_PASSWORD_SECTION') {
            relatedPermissions = passwordsRelatedPermissions;
          } else if (permission === 'VIEW_PASSWORD') {
            relatedPermissions = passwordsRelatedPermissions;
          }

          if (relatedPermissions) {
            for (var i = 0; i < relatedPermissions.length; i++) {
              var relatedIndex = permissions.indexOf(relatedPermissions[i]);

              if (relatedIndex > -1) {
                permissions.splice(relatedIndex, 1);
              }
            }
          }

        } else {
          permissions.push(permission);
        }
      }

    }]);

}());
