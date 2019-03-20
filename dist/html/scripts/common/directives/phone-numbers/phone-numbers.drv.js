'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("phoneNumbersEdit", ['quicktech.common.services.PhoneFormats',
    function (PhoneFormats) {
      return {
        restrict: 'A',
        require: 'ngModel',
        templateUrl: '/html/scripts/common/directives/phone-numbers/phone-numbers.tpl.html',
        scope: {
          phoneNumbers: '=ngModel',
          isFirstRequired: '=isFirstRequired',
          isTryToSave: '=isTryToSave',
          countryCode: '@?',
          disabled: '@?',
          onLostFocus: '=?',
          isDashboardStyle: '@?',
          noAddMore: '<noAddMore',
          customPlaceholder: '<customPlaceholder',
          activePlaceholder: '<activePlaceholder',
          isRestricted: '<isRestricted',
          showTypeSelector: '<showTypeSelector',
          isRequired: '<isRequired',
          notRequired: '<notRequired',
          qtTabIndex: '<qtTabIndex'
        },
        link: function ($scope, element, attrs, ngModelCtrl) {
          if (!$scope.phoneNumbers) {
            ngModelCtrl.$setViewValue([]);
          } else {
            $scope.phoneNumbers.sort(function (a, b) {
              return a.priority - b.priority;
            });
          }
        },
        controller: function ($scope) {
          $scope.isPrefixValid = PhoneFormats.isPrefixValid;
          $scope.maximalAmountOfPhones = 2;
          $scope.phoneNumberPattern = /^\+?[0-9\s\-\+\(\)\.\,]{1,20}$/;
          $scope.phoneNumberTypes = {
            MOBILE: 'Mobile',
            OFFICE: 'Office',
            FAX: 'Fax'
          };

          $scope.forms = {};

          $scope.controller = this;
          $scope.dashboard = $scope.isDashboardStyle || false;

          $scope.$watch('phoneNumbers.length', function (count) {
            if (count === 0) {
              $scope.addPhoneNumber();
            }
          });

          // $scope.$watch('phoneNumbers[0].number', function(val) {
          //   $scope.getPhoneNumberError(val);
          // })

          $scope.$watch('isTryToSave', function(val) {
            $scope.getPhoneNumberError($scope.phoneNumbers[0].number);
          })

          $scope.addPhoneNumber = function () {
            $scope.phoneNumbers.push({
              typeNumber: 'OFFICE'
            });
          };

          $scope.removePhoneNumber = function (index) {
            $scope.phoneNumbers.splice(index, 1);
            $scope.onLostFocus && $scope.onLostFocus();
          };

          $scope.getPhoneNumberError = function (number, form, index) {
            var required = false, invalid = false, minlength = false, maxlength = false;

            if (!form) form = $scope.forms.phoneNumbersForm;
            if (!index) index = 0;

            if (!form) return;
            var formField = form['phoneNumber' + index];
            var error;

          

            if (form.$dirty || $scope.isTryToSave) {
              if (number) {
                var prefixValid = true || $scope.isPrefixValid(number);
                var isPrefixOnly = false && number.split(' ').length <= 1
              }



              if ((number && !prefixValid) || formField.$error.pattern) {
                invalid = true;
                error = 'Invalid primary phone number';
              } else if ((($scope.isFirstRequired) || (!number || (prefixValid && isPrefixOnly))) && !$scope.notRequired) {
                required = true;
                error = 'Phone number is required';
              } else if (!isPrefixOnly && number && number.length < 5) {
                minlength = true;
                error = 'Phone number is too short';
              } else if (number.length > 20) {
                maxlength = true;
                error = 'Phone number is too long';
              }
            }

            $scope.phoneNumbers[0].error = error;

            formField.$setValidity('invalid', !invalid);
            formField.$setValidity('required', !required);
            formField.$setValidity('minlength', !minlength);
            formField.$setValidity('maxlength', !maxlength);

            return error;
          };
        }
      }
    }]);
})();
