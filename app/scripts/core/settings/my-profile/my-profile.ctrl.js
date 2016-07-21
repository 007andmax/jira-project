'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileCtrl',
    ['$scope', '$state', '$stateParams', 'UsersService', 'Utils',
      function ($scope, $state, $stateParams, UsersService, Utils) {
        var currentDevice;

        $scope.selectedDevice = {};
        $scope.aboutMe = $scope.currentUser.status;
        //$scope.password = {
        //  oldPassword: '',
        //  newPassword: ''
        //};

        $scope.userProfile = UsersService.getUserProfile(function (a) {
          $scope.userProfile = $scope.userProfile.staticCopy();

          if (!$scope.userProfile.address) {
            $scope.userProfile.address = {
              phoneNumbers: []
            }
          }
          $scope.loadUserProfile = true;
        });

        UsersService.getActivityHistory(function (resp) {
          $scope.activityHistory = resp;
          $scope.selectedDevice = currentDevice = resp.find(function (device) {
            return device.current;
          })
        });

        $scope.saveEmailNotifications = function (form) {

          if (form.$valid) {

            var emailObjToSend = {
              newDevice: $scope.userProfile.emailNotifications.newDevice,
              ticketCreated: $scope.userProfile.emailNotifications.ticketCreated
            };

            UsersService.saveForUserProfile(emailObjToSend, 'email', function () {
              form.$setPristine();
            });
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        //$scope.savePassword = function (form) {
        //  if (form.$valid) {
        //    $scope.savingPasswordInProcess = false;
        //
        //    var password = {
        //      oldPassword: hex_md5($scope.password.oldPassword),
        //      newPassword: hex_md5($scope.password.newPassword)
        //    };
        //
        //    UsersService.saveForUserProfile(password, 'password', function (resp) {
        //      if (resp.code === 422) {
        //        form.oldPassword.$setValidity('notCorrectPass', false)
        //      } else {
        //        form.$setPristine();
        //        $scope.password = {
        //          oldPassword: '',
        //          newPassword: ''
        //        };
        //      }
        //      $scope.savingPasswordInProcess = false;
        //    });
        //  }
        //};

        $scope.saveAboutMe = function (form) {
          if (form.$valid) {

            UsersService.saveForUserProfile($scope.aboutMe, 'status', function () {
              form.$setPristine();
            });

          }
        };

        $scope.closeSession = function (device, event) {
          var idsForDelete;

          if (device) {
            if ($scope.selectedDevice.id === device.id) {
              $scope.selectedDevice = currentDevice;
            }

            idsForDelete = [device.id];
            Utils.deleteById($scope.activityHistory, device.id);
          } else {
            idsForDelete = [];
            for (var i = 0; i < $scope.activityHistory.length; i++) {
              var deviceId = $scope.activityHistory[i].id;
              if (deviceId !== currentDevice.id) {
                idsForDelete.push(deviceId);
              } else {
                $scope.activityHistory = [currentDevice];
                $scope.selectedDevice = currentDevice;
              }
            }
          }

          UsersService.closeSessions(idsForDelete);
          event.stopPropagation();
        };

        $scope.selectDevice = function (device) {
          $scope.selectedDevice = device;
        };

        //$scope.$watch('password.oldPassword', function () {
        //  $scope.passwordForm.oldPassword.$setValidity('notCorrectPass', true)
        //});

      }]);

}());
