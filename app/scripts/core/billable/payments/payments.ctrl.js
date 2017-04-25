'use strict';

(function () {
  angular.module('quicktech.core.billable').controller('quicktech.core.payments.paymentsCtrl',
    ['$scope', '$rootScope', '$stateParams', '$http', 'PaymentsService', '$uibModal', function ($scope, $rootScope, $stateParams, $http, PaymentsService, $uibModal) {

      var availableMods = ['payments-list', 'deposit-slips'];

      $scope.parseDate = Date.parse.bind(Date);

      $scope.mode = availableMods[0];
      $scope.payments = [];
      $scope.orderType = 'createdAt';
      $scope.idDictionary = {};

      $scope.depositSlips = [];

      $scope.changeOrder = function (type) {
        if ($scope.orderType === type) {
          $scope.orderType = $scope.orderType[0] === '-' ? $scope.orderType.slice(1) : '-' + $scope.orderType;
        } else {
          $scope.orderType = type;
        }
      };

      $scope.changeMode = function (mode) {
        $scope.mode = mode;
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

      // if ($scope.mode === 'payments-list') {
      //   PaymentsService.getPaymentsData($scope, function (resp) {
      //     $scope.payments = resp;
      //   });
      // } else  {
      //   PaymentsService.getDepositSlipsData($scope, function (resp) {
      //     $scope.depositSlips = resp;
      //     console.log("sdfsdfsdfsdfsd");
      //     console.log(resp);
      //   });
      // }
      PaymentsService.getPaymentsData($scope, function (resp) {
        $scope.payments = resp;
      });
      PaymentsService.getDepositSlipsData($scope, function (resp) {
        $scope.depositSlips = resp;
        console.log("sdfsdfsdfsdfsd");
        console.log(resp);
      });


      $scope.openDepositModal = function () {
        $uibModal.open({
          templateUrl: '/html/scripts/core/billable/payments/payments-modal.tpl.html',
          animation: true,
          backdrop: false,
          size: 'sm',
          controller: 'modalCtrl',
          resolve: {
            paymentIds: function () {
              return Object.keys($scope.idDictionary);
            }
          }
        });
      };
    }]).controller("modalCtrl", ['$scope', 'PaymentsService', '$uibModalInstance', 'paymentIds',
    function ($scope, PaymentsService, $uibModalInstance, paymentIds) {

      $scope.closeModal = function () {
        $uibModalInstance.close();
      };

      $scope.createDepositSlipNote = function () {
        $scope.disableButton = true;
        PaymentsService.postNewDepositSlip({
          paymentIds: paymentIds,
          note: $scope.depositNote
        }, function () {
          $uibModalInstance.close();
        });
      };

    }])
})();
