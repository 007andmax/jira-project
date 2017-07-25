'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.creditCardCtrl',
    ['$scope', 'CompaniesService', function ($scope, CompaniesService) {

      $scope.companyPaymentInfo = CompaniesService.getCompanyPaymentInfo();

      $scope.changeCompanyPaymentInfo = function() {
        CompaniesService.saveCompanyPaymentInfo($scope.companyPaymentInfo, function(resp) {
          //console.log(resp);
        })
      };

      $scope.turnOnCreditCard = function(){
        $scope.companyPaymentInfo.paymentsEnabled = true;
        CompaniesService.saveCompanyPaymentInfo($scope.companyPaymentInfo, function(resp) {
          //console.log(resp);
        })
      };

      $scope.turnOffCreditCard = function() {
        $scope.companyPaymentInfo.paymentsEnabled = false;
        CompaniesService.saveCompanyPaymentInfo($scope.companyPaymentInfo, function(resp) {
          //console.log(resp);
        })
      }

    }]);


}());
