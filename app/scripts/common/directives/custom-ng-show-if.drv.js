'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("customNgShowIf",
    [function () {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs, ngModelCtrl) {

          var ifElem = element.find('[cns-if]'),
            elseElem = element.find('[cns-else]');

          ifElem.hide();
          elseElem.hide();

          $scope.$watch(attrs.customNgShowIf, function (val) {
            if (val) {
              ifElem.show();
              elseElem.hide();
            } else {
              ifElem.hide();
              elseElem.show();
            }
          })

        }
      }
    }]);

})();
