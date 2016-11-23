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
          onLostFocus: '=?'
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
          $scope.phoneNumberPattern = /^[\+\d\(\)\-\s]+$/;
          $scope.phoneNumberTypes = {
            MOBILE: 'Mobile',
            OFFICE: 'Office',
            FAX: 'Fax'
          };

          $scope.$watch('phoneNumbers.length', function (count) {
            if (count === 0) {
              $scope.addPhoneNumber();
            }
          });

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
            var formField = form['phoneNumber' + index];
            var error;

            if (form.$dirty || $scope.isTryToSave) {
              if (number) {
                var prefixValid = $scope.isPrefixValid(number);
                var isPrefixOnly = number.split(' ').length <= 1
              }

              if ((number && !prefixValid) || formField.$error.pattern) {
                invalid = true;
                error = 'Invalid primary phone number';
              } else if (($scope.isFirstRequired || (index === 0 && $scope.phoneNumbers.length > 1)) && (!number || (prefixValid && isPrefixOnly))) {
                required = true;
                error = 'Primary phone number is required';
              } else if (!isPrefixOnly && number && number.length < 5) {
                minlength = true;
                error = 'Primary phone number is too short';
              } else if (number.length > 20) {
                maxlength = true;
                error = 'Primary phone number is too long';
              }
            }

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
