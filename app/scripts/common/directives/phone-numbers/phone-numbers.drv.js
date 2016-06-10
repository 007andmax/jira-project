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
          };
        }
      }
    }]);
})();
