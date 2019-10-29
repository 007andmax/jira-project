'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.techUsersCtrl',
    ['$scope', 'UsersService', 'CompaniesService', 'quicktech.common.services.UserConfirmationsService', '$timeout',
      'quicktech.common.services.SharedStateService', 'quicktech.common.services.UserNotificationService',
      function ($scope, UsersService, CompaniesService, UserConfirmationsService, $timeout, SharedStateService, UserNotificationService) {
        var globalSearch = SharedStateService.getSharedState('globalSearch');
        var archivedUsers = UsersService.getArchivedUsers();
        var users = UsersService.getTechUsers();
        $scope.usersEmailNotificationList = {};
        $scope.colors = ["#040404", '#ffb039', '#3c92ca', '#e16767', '#63be8f']

        CompaniesService.getTechRoles(function (resp) {
          $scope.techRoles = resp;

          $scope.techColors = $scope.techRoles.reduce(function(acc, role, i) {
            acc[role] = $scope.colors[i];
            return acc;
          }, {});
        });





       

        $scope.resendWelcomeEmail = function(email) {
          UsersService.resendWelcomeEmail(email, function(res) {
            UserNotificationService.show('A welcome email was sent', true);
          })
        }



        var usersIds = users.map(function(user){
          return user.id;
        });

        UsersService.getTechUsersEmailNotification(usersIds, function(resp){
          $scope.usersEmailNotificationList = resp;
        });

       $scope.saveUserNewEmailNotificationSetting = function(userId) {
         if(userId) {
           var notificationSetting = {
             newDevice:  $scope.usersEmailNotificationList[userId].newDevice,
             scheduleChanged:  $scope.usersEmailNotificationList[userId].scheduleChanged,
             clientCompanyUpdated:  $scope.usersEmailNotificationList[userId].clientCompanyUpdated,
             ticketCreated:  $scope.usersEmailNotificationList[userId].ticketCreated,
             myTicketUpdated:  $scope.usersEmailNotificationList[userId].myTicketUpdated
           };
           UsersService.saveUsersEmailNotification(userId, notificationSetting, function(resp) {
           
           })
         }
       };

        $scope.$watch(function () {
          return archivedUsers.length;
        }, function () {
          $timeout(function () {
            $scope.archivedUsers = angular.copy(archivedUsers);
          }, 1000);
        });

        $scope.$watch(function () {
          return users;
        }, function () {
          $timeout(function () {
            $scope.users = angular.copy(users);
            removeArchivedUser()
          }, 1000);
        }, true);

        function removeArchivedUser() {
          //remove tech archived users from $scope.users
          for(var i=0; i<$scope.users.length; i++) {
            for(var m=0; m<$scope.archivedUsers.length; m++) {
              if($scope.users[i].id === $scope.archivedUsers[m].id) {
                $scope.users.splice(i, 1);
              }
            }
          }
        }


        $scope.highlightTechUser = function () {
          if (globalSearch.techUserFilter) {
            $scope.$broadcast('showTechUser-' + globalSearch.techUserFilter);
            globalSearch.techUserFilter = undefined;
          }
        };

        $scope.openEditUser = function (user) {
          if (user === 'new_user') {
            $scope.editUser = { techRole: $scope.techRoles ? $scope.techRoles[0] : 'Help desk user' };
            $scope.editUserId = 'new_user';
          } else if (user) {
            $scope.editUserId = user.id;
            $scope.editUser = angular.copy(user);
          } else {
            $scope.editUserId = '';
            $scope.editUser = null;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.validateUserEmail = function (ngModelCtrl, modelId, afterValidationCallback) {
          var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editUser.id || '', true, function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.save = function (form) {
          if (form.$valid) {
            $scope.savingInProcess = true;

            $scope.editUser.companyId = CompaniesService.getCurrentCompany().id;
            $scope.editUser.subscription = {};

            UsersService.save($scope.editUser, function () {
              $scope.savingInProcess = false;
              if ($scope.editUserId === 'new_user') {
                var message = 'A letter was sent to the specified email ('
                  + $scope.editUser.primaryEmail + '). Please check it.';
                UserNotificationService.show(message, false);
                $timeout(UserNotificationService.hide, 5000);
              }
              $scope.openEditUser();
              form.$setPristine();
            })
          }
        };

        $scope.archiveUser = function (user) {
          var confirmMesage = 'Do you want to archive ' + user.firstName + ' ' + user.lastName + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            try {
              UsersService.archiveUser(user.id);
            } catch (err) {
              confirmButton = 'Ok';
              UserConfirmationsService.show(err, confirmButton, true);
            }
          });
        };

        $scope.restoreUser = function (user) {
          user.loadingInProgress = true;
          UsersService.restoreUser(user.id, function () {
            user.loadingInProgress = false;
            $scope.users.push(user);
            for(var i=0; i<$scope.archivedUsers.length; i++) {
              if($scope.archivedUsers[i].id === user.id) {
                $scope.archivedUsers.splice(i, 1);
              }
            }
          });


        };

        $scope.changePasswordRequired = function (user) {
          UsersService.requestToChangePassword(user.id);
          user.requestToChangePassword = true;
          UserNotificationService.show('A request to change password was sent', true);
        };

      }]);

}());
