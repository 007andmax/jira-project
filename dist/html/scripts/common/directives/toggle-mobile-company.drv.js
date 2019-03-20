'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('mobileOpenCompany',
    [function () {
      return {
        restrict: 'A',
        bindings: {
          desktop: '<',
          mobile: '<',
          companyName: '<'
        },
        link: function ($scope, element, attrs) {

          element.on('click', function() {
            if (window.innerWidth <= 414) {
              $scope.mobileOpenCompany(element);

            }
          })




        }
      }
    }]);
})();
