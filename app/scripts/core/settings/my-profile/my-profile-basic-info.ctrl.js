'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileBasicInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'UsersService',
      function ($scope, $state, $stateParams, $location, UsersService) {

        $scope.currentUser = UsersService.getCurrentUser();
        $scope.editUser = $scope.currentUser.staticCopy();
        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.linkPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.accountType = {
          SUPER_TECH_ADMIN: "Super Admin",
          ADMIN: "Administrator",
          USER: "User"
        };

        $scope.validateLink = function (value) {
          $scope.validLink = {
            required: !value,
            pattern: !value.match($scope.linkPattern)
          };
        };

        $scope.validateUserEmail = function (ngModelCtrl) {
          var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editUser.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.saveBasicInfo = function (form) {

          if (form.$valid) {

            $scope.savingInProcess = true;

            var userObjToSend = {
              avatar: $scope.editUser.avatar,
              firstName: $scope.editUser.firstName,
              lastName: $scope.editUser.lastName,
              designation: $scope.editUser.designation,
              primaryEmail: $scope.editUser.primaryEmail,
              secondaryEmail: $scope.editUser.secondaryEmail,
              signature: {content: $scope.userProfile.signature.content}
            };

            UsersService.saveForUserProfile(userObjToSend, 'basic', function () {
              $scope.savingInProcess = false;
              form.$setPristine();
            })
          }

        }

      }]);

}());
