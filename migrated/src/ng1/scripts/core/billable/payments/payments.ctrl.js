'use strict';

(function () {
  angular.module('quicktech.core.billable').controller('quicktech.core.payments.paymentsCtrl',
    [
      '$scope', '$rootScope', '$stateParams', '$http', 'PaymentsService', '$uibModal', '$timeout',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      function ($scope, $rootScope, $stateParams, $http, PaymentsService, $uibModal, $timeout, UserConfirmationsService,
                UserNotificationService) {

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

        PaymentsService.getPaymentsData($scope, function (resp) {
          $scope.payments = resp;
        });
        console.log('asdgaklsdgklasdjg');
        PaymentsService.getDepositSlipsData($scope, function (resp) {
          $scope.depositSlips = resp;
        });

        $scope.rollbackPayment = function (payment) {
          if (!$scope.rollbackInProgress) {
            $scope.rollbackInProgress = true;
            UserConfirmationsService.show('Do you really want to rollback this payment?', 'Yes').then(function () {
              PaymentsService.rollback(payment.id, function () {
                UserNotificationService.show('Payment successfully rolled back', true);
                $scope.rollbackInProgress = false;
              });
            });
          }
        };

        $scope.isAnyPaymentSelected = function () {
          for (var id in $scope.idDictionary) {
            if ($scope.idDictionary[id]) {
              return true;
            }
          }
          return false;
        };

        $scope.toggleDeposit = function (depositId) {
          $scope.$broadcast('toggleDepositSlip-' + depositId);
        };

        $scope.parseType = function (type) {
          return type.split('_').join(' ');
        };

        $scope.openDepositModal = function () {
          $uibModal.open({
            templateUrl: '/ng1/scripts/core/billable/payments/payments-modal.tpl.html',
            animation: true,
            backdrop: false,
            size: 'sm',
            controller: 'modalCtrl',
            resolve: {
              paymentIds: function () {
                var paymentIds = [];
                for (var id in $scope.idDictionary) {
                  if ($scope.idDictionary[id]) {
                    paymentIds.push(id);
                  }
                }
                $scope.idDictionary = {};
                return paymentIds;
              }
            }
          });
        };
      }
    ]).controller("modalCtrl", [
    '$scope', 'PaymentsService', '$uibModalInstance', 'paymentIds',
    function ($scope, PaymentsService, $uibModalInstance, paymentIds) {

      $scope.closeModal = function () {
        $uibModalInstance.close();
      };

      PaymentsService.getDepositNumber(function (data) {
        $scope.depositNumber = data;
      });

      $scope.createDepositSlipNote = function () {
        $scope.disableButton = true;
        PaymentsService.postNewDepositSlip({
          paymentIds: paymentIds,
          note: $scope.depositNote
        }, function () {
          $uibModalInstance.close();
        });
      };

    }
  ])
})();
