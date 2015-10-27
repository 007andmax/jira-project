'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.editVendorCtrl',
    ['$scope', '$stateParams', 'AddressesService', 'VendorsService', 'ContactsService', '$state',
      function ($scope, $stateParams, AddressesService, VendorsService, ContactsService, $state) {

        var currentTimeZone;

        $scope.locationsMaxCount = 3;
        $scope.contactsMaxCount = 3;
        $scope.timezones = AddressesService.getAllLocales(function () {

          var localZone = -(new Date().getTimezoneOffset() / 60),
            timeZone;

          for (var i = 0; i < $scope.timezones.length; i++) {

            var timeZoneDescription = $scope.timezones[i].description.match(/\d+/);

            if (timeZoneDescription === null) {
              timeZone = 0
            } else {
              timeZone = timeZoneDescription[0];
            }
            if (localZone === +timeZone) {
              currentTimeZone = $scope.timezones[i];
              if (!$stateParams.vendorId) {
                setCurrentTimeZone(currentTimeZone);
              }
              return;
            }
          }
        });
        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.websitePattern = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
        $scope.phoneNumberPattern = /^\+?[0-9]{0,19}$/;
        $scope.phoneNumberTypes = {
          MOBILE: 'Mobile',
          OFFICE: 'Office',
          FAX: 'Fax'
        };

        if ($stateParams.vendorId) {
          var vendor = VendorsService.getOneById($stateParams.vendorId, function (resp) {

            if(resp.code === 400){
              $state.go('vendors');
            }

            if (!vendor.addresses || vendor.addresses.length === 0) {
              vendor.addresses = [{isPrimary: true}];
            }

            if (!vendor.contacts || vendor.contacts.length === 0) {
              vendor.contacts = [getEmptyContact()];
            }

            $scope.editVendor = vendor.staticCopy();

          });

        } else {
          $scope.editVendor = {
            addresses: [{isPrimary: true}],
            contacts: [getEmptyContact(true)],
            products: []
          };
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

        $scope.addContact = function () {
          $scope.editVendor.contacts.unshift(getEmptyContact(false));
        };

        $scope.removeContact = function (index) {
          $scope.editVendor.contacts.splice(index, 1);
        };

        function getEmptyContact(value) {
          return {
            avatar: {
            },
            phoneNumbers: [{typeNumber: "MOBILE"}],
            subscription: {ticket: value}
          };
        }

        $scope.validateVendorName = function (ngModelCtrl) {
          var validationResult = VendorsService.isNameUnique(ngModelCtrl.$viewValue, $scope.editVendor.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.validateVendorWebsite = function (ngModelCtrl) {
          var validationResult = VendorsService.isWebsiteUnique(ngModelCtrl.$viewValue, $scope.editVendor.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

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
              $state.go('vendors');
            })
          } else {
            $scope.triedToSave = true;
          }

          function processPhoneNumbers(phoneNumbers) {
            var lastPhone = phoneNumbers[phoneNumbers.length - 1];

            if (!lastPhone.number || lastPhone.number.trim().length === 0) {
              phoneNumbers.splice(phoneNumbers.length - 1, 1);
            }
          }
        };

        $scope.$watch('editVendor.contacts', function () {
          if ($scope.editVendor) {
            var countSubscription = 0;
            for (var i = 0; i < $scope.editVendor.contacts.length; i++) {
              if ($scope.editVendor.contacts[i].subscription.ticket) {
                countSubscription++;
              }
            }
            if (countSubscription < 1) {
              $scope.showSubscribeError = true
            } else {
              $scope.showSubscribeError = false
            }
          }
        }, true);

        function setCurrentTimeZone(timeZoneObject) {
          $scope.editVendor.addresses[0].locale = timeZoneObject;
        }

      }]);

}());
