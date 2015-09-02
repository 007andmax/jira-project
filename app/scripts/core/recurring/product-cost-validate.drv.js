'use strict';
'use strict';

(function () {

  angular.module("quicktech.core.recurring").directive("productCostValidate", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        product: '=productCostValidate'
      },
      link: function (scope, element, attrs, ctrl) {

        scope.$watch('product', function () {
          var validityKey = 'lowprice',
            sum = scope.product.sum,
            quantity = scope.product.quantity,
            typedCost = sum / quantity;

          if (!scope.product || !scope.product.item || !sum || !quantity) {
            ctrl.$setValidity(validityKey, true);
          } else {
            ctrl.$setValidity(validityKey, typedCost >= scope.product.item.cost);
          }
        }, true);
      }

    };
  });
})();
