'use strict';

(function(){
  angular.module('quicktech.core.billable').controller('quicktech.core.payments.paymentsCtrl',
  ['$scope', '$stateParams', 'PaymentsService', function($scope, $stateParams, PaymentsService){

    var availableMods = ['payments-list', 'deposit-slips'];

    $scope.mode = availableMods[0];
    $scope.payments = {};

    $scope.changeMode = function(mode) {
      $scope.mode=mode;
    };

    $scope.$watch(function () {
      return $stateParams.mode;
    }, function (mode) {
      if (availableMods.indexOf(mode) < 0) {
        $state.go('payments', {
          mode: availableMods[0]
        });
      } else {
        $scope.mode = mode;
      }
    });

    PaymentsService.getPaymentsData(function(resp) {
      console.log("payments in Ctrl");
      $scope.payments = resp;
    })



  }])
})();
