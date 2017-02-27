'use strict';
(function () {

  angular.module("quicktech.core.discount").controller('quicktech.core.discount.discountCtrl',
    ['$scope', 'DiscountsService', function ($scope, DiscountsService) {
      DiscountsService.getAll($scope, function (resp) {
        $scope.discounts = resp;
      });

      $scope.getAmount = DiscountsService.getAmount;
      $scope.remove = DiscountsService.remove;
    }]);

}());
