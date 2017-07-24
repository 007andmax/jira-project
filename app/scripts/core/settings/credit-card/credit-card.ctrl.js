'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.creditCardCtrl',
    ['$scope', 'CompaniesService', function ($scope, CompaniesService) {

      $scope.companyPaymentInfo = CompaniesService.getCompanyPaymentInfo();

      $scope.changeCompanyPaymentInfo = function() {
        CompaniesService.saveCompanyPaymentInfo($scope.companyPaymentInfo, function(resp) {
          console.log(resp);
        })
      };

    }]);

}());
