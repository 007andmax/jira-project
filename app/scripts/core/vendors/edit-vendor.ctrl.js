'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.editVendorCtrl',
    ['$scope', '$stateParams', 'AddressesService', 'VendorsService', 'ContactsService', '$state',
      'quicktech.common.services.PhoneFormats', 'quicktech.common.services.SharedStateService',
      function ($scope, $stateParams, AddressesService, VendorsService, ContactsService, $state, PhoneFormats, SharedStateService) {

        var currentTimeZone;
        var globalSearch = SharedStateService.getSharedState('globalSearch');
        var companiesHeaderSharedState = SharedStateService.getSharedState('companiesHeader');

        $scope.locationsMaxCount = 3;
        $scope.contactsMaxCount = 3;
        AddressesService.getLocales(true, function (response) {
          $scope.timeZones = response;
        });
        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.websitePattern = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/;
        $scope.phoneNumberPattern = /^\+?[0-9\s\-]{0,19}$/;
        $scope.phoneNumberTypes = {
          MOBILE: 'Mobile',
          OFFICE: 'Office',
          FAX: 'Fax'
        };

        if ($stateParams.vendorId) {
          var vendor = VendorsService.getOneById($stateParams.vendorId, function (resp) {

            if(resp.code === 400){
              companiesHeaderSharedState.filter.isVendor = true;
              $state.go('companies');
            }

            if (!vendor.addresses || vendor.addresses.length === 0) {
              vendor.addresses = [{isPrimary: true}];
            }

            if (!vendor.contacts || vendor.contacts.length === 0) {
              vendor.contacts = [getEmptyContact()];
            }

            $scope.editVendor = vendor.staticCopy();

            globalSearch.openedItemName = 'Edit ' + vendor.name;

          });

        } else {
          $scope.editVendor = {
            addresses: [{isPrimary: true}],
            contacts: [getEmptyContact()],
            products: []
          };

          globalSearch.openedItemName = 'Create Vendor';
        }

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editVendor && $scope.editVendor.id) || form[fieldName].$dirty || $scope.triedToSave) && !form[fieldName].$valid;
        };

        $scope.isShowingContactErrors = function (contact, form, fieldName) {
          return form[fieldName] && ((contact && contact.id) || form[fieldName].$dirty || $scope.triedToSave) && !form[fieldName].$valid;
        };

        $scope.addLocation = function () {
          $scope.editVendor.addresses.unshift({});
          setCurrentTimeZone(currentTimeZone);
        };

        $scope.removeLocation = function (index) {
          if ($scope.editVendor.addresses[index].isPrimary) {
            $scope.editVendor.addresses[$scope.editVendor.addresses.length - 1].isPrimary = true;
          }
          $scope.editVendor.addresses.splice(index, 1);
        };

        $scope.changePrimaryAddress = function (location) {
          angular.forEach($scope.editVendor.addresses, function (address) {
            address.isPrimary = false;
          });
          location.isPrimary = true;
        };

        function getEmptyContact() {
          return {
            avatar: {
            },
            phoneNumbers: [{typeNumber: "MOBILE"}],
            subscription: {ticket: true}
          };
        }

        $scope.validateVendorName = function (ngModelCtrl) {
          var validationResult = VendorsService.isNameUnique(ngModelCtrl.$viewValue, $scope.editVendor.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        //$scope.validateVendorWebsite = function (ngModelCtrl) {
        //  var validationResult = VendorsService.isWebsiteUnique(ngModelCtrl.$viewValue, $scope.editVendor.id || '', function () {
        //    ngModelCtrl.$setValidity('unique', validationResult.value);
        //  });
        //};

        $scope.validateContactEmail = function (ngModelCtrl, contactId) {

          var emailsCount = 0;

          for (var i = 0; i < $scope.editVendor.contacts.length; i++) {
            if ($scope.editVendor.contacts[i].email === ngModelCtrl.$viewValue) {
              emailsCount++;
            }
          }

          if (emailsCount > 1) {
            ngModelCtrl.$setValidity('unique', false);
          } else {
            var validationResult = ContactsService.isEmailUnique(ngModelCtrl.$viewValue, contactId || '', function () {
              ngModelCtrl.$setValidity('unique', validationResult.value);
            });
          }
        };

        $scope.validatePaymentTerms = function (form) {
          var valid = ($scope.editVendor.paymentTerms > 0 || $scope.editVendor.paymentTerms === undefined);
          form.vendorPaymentTerms.$setValidity('minValue', valid);
        };

        $scope.cancelEdit = function () {
          companiesHeaderSharedState.filter.isVendor = true;
          $state.go('companies');
        };

        $scope.saveVendor = function (form) {
          if (form.$valid) {

            $scope.savingInProcess = true;

            var contacts = $scope.editVendor.contacts,
              addresses = $scope.editVendor.addresses;

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

            VendorsService.save($scope.editVendor, function () {
              $scope.savingInProcess = false;
              companiesHeaderSharedState.filter.isVendor = true;
              $state.go('companies');
            })
          } else {
            $scope.triedToSave = true;
            $scope.$broadcast('scrollToErrorFild')
          }

          function processPhoneNumbers(phoneNumbers) {
            var firstPhone = phoneNumbers[0].number,
              lastPhone = phoneNumbers[phoneNumbers.length - 1].number;

            if (!lastPhone || lastPhone.trim().length === 0 ||
              (lastPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(lastPhone))) {

              phoneNumbers.splice(phoneNumbers.length - 1, 1);

              if (phoneNumbers.length && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
                phoneNumbers[0].number = '';
              }
            } else if (phoneNumbers.length > 1 && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
              phoneNumbers.shift();
            }
          }
        };

        function setCurrentTimeZone(timeZoneObject) {
          $scope.editVendor.addresses[0].locale = timeZoneObject;
        }

      }]);

}());
