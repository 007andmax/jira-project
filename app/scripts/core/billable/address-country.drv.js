'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("addressCountry",
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {},
        link: function (scope, element, attrs, ctrl) {

          scope.$watch(function () {

            return ctrl.$viewValue;

          }, function () {

            if(ctrl.$viewValue){
              splitAddress(ctrl.$viewValue)
            }

          });

          function splitAddress(address){

            var regLastComma = /,(?=[^,]*$)/,
              addressArray = address.split(regLastComma);

            element.html(addressArray[0] + ',' + '<br/>' + addressArray[1])

          }

        }
      }
    }]);
})();

