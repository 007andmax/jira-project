'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileDashboardCtrl',
    ['$scope', '$state', '$stateParams', 'CompaniesService', 'DevicesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService', '$timeout', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.PermissionsService',
      function ($scope, $state, $stateParams, CompaniesService, DevicesService, StatisticsService,
                SharedStateService, $timeout, UserNotificationService, UserConfirmationsService, PermissionsService) {

        $scope.showPhoneEditButton = false;
        $scope.showPhoneNumbersEditFields = false;

        function closeEditFields() {
          $scope.showPhoneNumbersEditFields = false;
        }

        function toEnum(text) {
          return text.trim().split(' ').join('_').toUpperCase();
        }

        $scope.checkingFormAndSave = function (form) {
          if (form.$valid) {
            $scope.save()
          }
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
            console.log(resp)
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




      }]);

}());
