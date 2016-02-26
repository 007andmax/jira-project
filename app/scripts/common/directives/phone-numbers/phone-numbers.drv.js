'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("phoneNumbersEdit", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      templateUrl: '/html/scripts/common/directives/phone-numbers/phone-numbers.tpl.html',
      scope: {
        phoneNumbers: '=ngModel',
        isFirstRequired: '=isFirstRequired',
        isTryToSave: '=isTryToSave'
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

        $scope.maximalAmountOfPhones = 3;
        $scope.hardPhoneNumberPattern = /^([0-9 -+()]){0,20}$/;
        $scope.phoneNumberPattern = /^\+?1?(-|\s)?(\()?\d{0,3}(\))?(-|\s)?\d{0,3}(-|\s)?\d{0,4}$/;
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
  });
})();
