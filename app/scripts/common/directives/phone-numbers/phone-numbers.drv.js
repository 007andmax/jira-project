'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("phoneNumbersEdit", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      templateUrl: '/html/scripts/common/directives/phone-numbers/phone-numbers.tpl.html',
      scope: {
        phoneNumbers: '=ngModel'
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
        $scope.phoneNumberPattern = /^\+?[0-9]{0,19}$/;
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
          $scope.phoneNumbers.unshift({
            typeNumber: 'MOBILE'
          });
        };

        $scope.removePhoneNumber = function (index) {
          $scope.phoneNumbers.splice(index, 1);
        };
      }
    }
  });
})();
