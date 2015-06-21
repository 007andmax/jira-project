'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.editCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', '$state',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, $state) {

        templatePhoneNumber();

        $scope.maximalAmountOfPhones = 3;
        $scope.phoneNumberPattern = /^\+?\(?[0-9]{3}(\-|\) ?| )[0-9]{3}(\-| )[0-9]{4}$/;

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

        var isEdit = $scope.user;

        if (!isEdit) {
          $scope.isCreation = true;
          $scope.user = {
            role: 'USER',
            phoneNumbers: [],
            userSubscription: {},
            avatar: {
              scale: 50
            }
          };

          $scope.$watch('userCompany', function (userCompany) {
            $scope.user.companyId = userCompany ? userCompany.id : undefined;
          });

        } else {
          var userSubscription = $scope.subscriptions[$scope.user.id];
          var avatar = $scope.user.avatar;

          userSubscription = userSubscription ? userSubscription.staticCopy() : {};
          avatar = avatar ? avatar.staticCopy() : {};

          $scope.userCompany = CompaniesService.getOneById($scope.user.company.id);

          $scope.user = {
            id: $scope.user.id,
            firstName: $scope.user.firstName,
            lastName: $scope.user.lastName,
            designation: $scope.user.designation,
            role: $scope.user.role,
            primaryEmail: $scope.user.primaryEmail,
            phoneNumbers: $scope.user.phoneNumbers.staticCopy(),
            companyId: $scope.user.company.id,
            userSubscription: userSubscription,
            avatar: avatar
          };
        }

        $scope.addPhoneNumber = function () {
          $scope.user.phoneNumbers.push($scope.templatePhoneNumber);
          templatePhoneNumber();
        };

        $scope.removePhoneNumber = function (index) {
          $scope.user.phoneNumbers.splice(index, 1);
        };

        $scope.cancelEdit = function () {
          if (isEdit) {
            $scope.cancelEditUser();
          } else {
            $state.go('users');
          }
        };

        $scope.getUserCompanyName = function () {
          if ($scope.user.companyId) {
            return CompaniesService.getOneById($scope.user.companyId).legalName;
          }
        };

        $scope.stateComparator = function (state, viewValue) {
          var secretEmptyKey = '[$empty$]';
          return viewValue === secretEmptyKey || ('' + state).toLowerCase().indexOf(('' + viewValue).toLowerCase()) > -1;
        };

        $scope.save = function (form) {
          if (form.$valid) {
            $scope.savingInProcess = true;

            UsersService.save($scope.user, function () {
              $scope.savingInProcess = false;
              $scope.cancelEdit();
            })
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (isEdit || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        function templatePhoneNumber() {
          $scope.templatePhoneNumber = {
            typeNumber: 'MOBILE'
          };
        }

      }]);

}());
