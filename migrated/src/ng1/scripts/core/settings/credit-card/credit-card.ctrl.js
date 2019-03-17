'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.creditCardCtrl',
    ['$scope', 'CompaniesService', 'quicktech.common.services.UserConfirmationsService', function ($scope, CompaniesService, UserConfirmationsService) {

      $scope.companyPaymentInfo = CompaniesService.getCompanyPaymentInfo();

      function sendNewDataToSerever() {
        CompaniesService.saveCompanyPaymentInfo($scope.companyPaymentInfo, function(resp) {
          //console.log(resp);
        })
      }

      $scope.changeCompanyPaymentInfo = function() {
        if(!$scope.companyPaymentInfo.paypalClientId && !$scope.companyPaymentInfo.paypalSecretId && !$scope.companyPaymentInfo.stripePublicKey && !$scope.companyPaymentInfo.stripeSecretKey) {

          var confirmMesage = 'Changes would be cancelled and credit card accepting switched off',
            confirmButton = 'OK';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            $scope.companyPaymentInfo.paymentsEnabled = false;
            sendNewDataToSerever();
          });
        } else {
          sendNewDataToSerever()
        }
      };

      $scope.turnOnCreditCard = function(){
        $scope.companyPaymentInfo.paymentsEnabled = true;
        sendNewDataToSerever()
      };

      $scope.turnOffCreditCard = function() {
        $scope.companyPaymentInfo.paymentsEnabled = false;
        sendNewDataToSerever()
      }


    }]);


}());
