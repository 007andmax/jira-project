'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.editCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', '$state',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, $state) {

        if (!$scope.editUser || !$scope.editUser.id) {
          $scope.isCreation = true;
          $scope.editUser = {
            role: 'USER',
            phoneNumbers: [],
            subscription: {},
            avatar: {
              scale: 50
            }
          };

          $scope.$watch('userCompany', function (userCompany) {
            $scope.editUser.companyId = userCompany ? userCompany.id : undefined;
          });
        }

        $scope.maximalAmountOfPhones = 3;
        $scope.phoneNumberPattern = /^\+?\(?[0-9]{3}(\-|\) ?| )[0-9]{3}(\-| )[0-9]{4}$/;
        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

        $scope.roles = {
          USER: 'User',
          ADMIN: 'Administrator'
        };

        $scope.phoneNumberTypes = {
          MOBILE: 'Mobile',
          OFFICE: 'Office',
          FAX: 'Fax'
        };

        $scope.clientCompanies = CompaniesService.getClientCompanies();

        $scope.$watch('editUser.companyId', function (companyId) {
          $scope.userCompany = CompaniesService.getOneById(companyId);

          if ($scope.editUser.phoneNumbers.length === 0) {
            $scope.addPhoneNumber();
          }
        });

        $scope.addPhoneNumber = function () {
          $scope.editUser.phoneNumbers.unshift({
            typeNumber: 'MOBILE'
          });
        };

        $scope.removePhoneNumber = function (index) {
          $scope.editUser.phoneNumbers.splice(index, 1);
        };

        $scope.cancelEdit = function () {
          if ($scope.editUser && $scope.editUser.id) {
            $scope.setEditUserId();
          } else {
            $state.go('users');
          }
        };

        $scope.getUserCompanyName = function () {
          if ($scope.editUser.companyId) {
            return CompaniesService.getOneById($scope.editUser.companyId).name;
          }
        };

        $scope.stateComparator = function (state, viewValue) {
          var secretEmptyKey = '[$empty$]';
          return viewValue === secretEmptyKey || ('' + state).toLowerCase().indexOf(('' + viewValue).toLowerCase()) > -1;
        };

        $scope.save = function (form) {
          if (form.$valid) {
            $scope.savingInProcess = true;

            var phoneNumbers = $scope.editUser.phoneNumbers,
              lastPhone = phoneNumbers[phoneNumbers.length - 1];

            if (!lastPhone.number || lastPhone.number.trim().length === 0) {
              phoneNumbers.splice(phoneNumbers.length - 1, 1);
            }

            UsersService.save($scope.editUser, function () {
              $scope.savingInProcess = false;
              $scope.cancelEdit();
            })
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

      }]);

}());
