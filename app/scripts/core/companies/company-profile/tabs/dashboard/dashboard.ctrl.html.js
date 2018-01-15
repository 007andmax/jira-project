'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileDashboardCtrl',
    ['$scope', '$state', '$stateParams', 'CompaniesService', 'DevicesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService', '$timeout', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.PermissionsService', 'UsersService',
      function ($scope, $state, $stateParams, CompaniesService, DevicesService, StatisticsService,
                SharedStateService, $timeout, UserNotificationService, UserConfirmationsService, PermissionsService, UsersService) {

        CompaniesService.getIndustries(function (resp) {
          $scope.industries = resp;
        });
        $scope.clientTypes = ['Client', 'Lead', 'Vendor'];
        $scope.techUsers = UsersService.getTechUsers;

        $scope.descriptionMaxLength = 300;

        $scope.showPhoneEditButton = false;
        $scope.showPhoneNumbersEditFields = false;
        $scope.showDomainEditButton = false;
        $scope.showDomainEditFields = false;
        $scope.showIndustryEditDutton = false;
        $scope.showIndustryEditFields = false;
        $scope.showContactPersonEditButton = false;
        $scope.showContactPersonEditFields = false;
        $scope.showNoteEditButton = false;
        $scope.showNoteEditField = false;
        $scope.showCompanyNameEditButton = false;
        $scope.showCompanyNameEditField = false;
        $scope.showServiceTypeEditButton = false;
        $scope.showServiceTypeEditField = false;
        $scope.showLedByEditButton = false;
        $scope.showLedByEditField = false;

        function closeEditFields() {
          $scope.showPhoneNumbersEditFields = false;
          $scope.showDomainEditFields = false;
          $scope.showIndustryEditFields = false;
          $scope.showContactPersonEditFields = false;
          $scope.showNoteEditField = false;
          $scope.showCompanyNameEditField = false;
          $scope.showServiceTypeEditField = false;
          $scope.showLedByEditField = false;
        }

        $scope.serviceTypes = ['HOURLY', 'BLOCK_TIME', 'SEMI_MANAGED', 'FULLY_MANAGED'];
        $scope.serviceTypesMap = {
          HOURLY: 'Hourly',
          BLOCK_TIME: 'Block time',
          SEMI_MANAGED: 'Semi managed',
          FULLY_MANAGED: 'Fully managed'
        };

        function toEnum(text) {
          return text.trim().split(' ').join('_').toUpperCase();
        }

        $scope.checkingFormAndSave = function (form) {
          if (form.$valid) {
            $scope.save()
          }
        };

        $scope.cancelEdit = function() {
          closeEditFields();
          $scope.companyInfo = angular.copy($scope.reservedCompanyInfo);
        };

        $scope.save = function () {

          var editCompany = angular.copy($scope.companyInfo);
          var contacts = editCompany.contacts,
            addresses = editCompany.addresses;

          for (var i = 0; i < contacts.length; i++) {
            var contact = contacts[i];

            processPhoneNumbers(contact.phoneNumbers);

            if (contact.avatar && !contact.avatar.id && !contact.avatar.origin && !contact.avatar.cropped) {
              contact.avatar = undefined;
            }
          }

          for (var i = 0; i < addresses.length; i++) {
            processPhoneNumbers(addresses[i].phoneNumbers);
          }

          if (editCompany.defaultPaymentMethod) {
            editCompany.defaultPaymentMethod = editCompany.defaultPaymentMethod.toUpperCase().split(' ').join('_');
          } else {
            editCompany.defaultPaymentMethod = null;
          }

          if (editCompany.paymentTerms) {
            editCompany.paymentTerms = parseInt(editCompany.paymentTerms) || 0;
          }

          if (editCompany.clientType) {
            if (editCompany.clientType.toLowerCase() !== 'vendor') {
              editCompany.accountNumber = undefined;
            }
            editCompany.clientType = toEnum(editCompany.clientType);
          }

          if (editCompany.serviceType) {
            editCompany.serviceType = toEnum(editCompany.serviceType);
          }

          if (!editCompany.agentLinkToEmailEnabled) {
            editCompany.agentLinkToEmail = null;
          }
          CompaniesService.save(editCompany, function (resp) {
            if(resp) {
              $scope.reservedCompanyInfo = angular.copy(editCompany);
            }
          });
          closeEditFields();

          function processPhoneNumbers(phoneNumbers) {
            if (phoneNumbers && phoneNumbers.length) {
              var firstPhone = phoneNumbers[0].number,
                lastPhone = phoneNumbers[phoneNumbers.length - 1].number;

              if (!lastPhone || lastPhone.trim().length === 0 ||
                (lastPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(lastPhone))) {

                phoneNumbers.splice(phoneNumbers.length - 1, 1);

                if (phoneNumbers.length && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
                  phoneNumbers.pop();
                }
              } else if (phoneNumbers.length > 1 && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
                phoneNumbers.shift();
              }
            }
          }
        };

        $scope.validateCompanyDomain = function (ngModelCtrl, modelId, afterValidationCallback) {
          var validationResult = CompaniesService.isDomainUnique(ngModelCtrl.$viewValue, $scope.companyInfo.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editCompany && $scope.editCompany.id) || form[fieldName].$dirty || $scope.triedToSave) && form[fieldName].$invalid;
        };

        $scope.validateCompanyName = function (ngModelCtrl, modelId, afterValidationCallback) {

          if ($scope.currentUser.accountType === "ROOT") {
            ngModelCtrl.$setValidity('unique', true);
            return
          }

          var validationResult = CompaniesService.isNameUnique(ngModelCtrl.$viewValue, $scope.companyInfo.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.getUserByID = function(userId) {
          if(!userId) {
            return
          }
          var user = UsersService.getOneById(userId);
          if(user) {
            if(user.lastName === '    ') {
              return user.firstName
            } else {
              return user.firstName+' '+user.lastName;
            }
          }
        };

        $scope.getFullName = function(client) {

          var isAllSpaces = client.lastName === "    ";
          if(client.lastName && !isAllSpaces) {
            return client.firstName+' '+client.lastName;
          } else {
            return client.firstName;
          }
        };



      }]);

}());



