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
          $scope.orderType = !$scope.orderType
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

      PaymentsService.getPaymentsData(function(resp) {
        $scope.payments = resp;
        //createDictionary($scope.payments);
        console.log("payments list: ", $scope.payments);
      });

      PaymentsService.getDepositSlipsData(function(resp) {
        $scope.depositSlips = resp;
        console.log("deposit slips: ", $scope.depositSlips);
      });

      function clearDictionary() {
        $scope.idDictionary = {};
      }

      $scope.depositModal;
      $scope.openDepositModal = function() {
        $scope.depositModal = $uibModal.open({
          templateUrl: '/html/scripts/core/billable/payments/payments-modal.tpl.html',
          animation: true,
          backdrop : false,
          size: 'sm',
          controller: 'modalCtrl'
        })
      };

      function checkPaymentsType() {
        var type = null;
        var keys = Object.keys($scope.idDictionary);
        for( var key in keys) {
          if(type === null) {
            type = $scope.payments[key].paymentMethod;
          } else if(type !== $scope.payments[key].paymentMethod) {
            type = 'MIX';
          }
        }
        return type;
      }


      $rootScope.$on('depositSlipNote', function(event, data){
        var note = data;
        var keysToSend = Object.keys($scope.idDictionary);
        console.log("scope on: ", note);
        //checkPaymentsType();
        var dataToSend = {
          note: note,
          type: checkPaymentsType(),
          paymentIds: keysToSend
        };
        PaymentsService.postNewDepositSlip(dataToSend, function(resp) {
          console.log("resp for post ", resp);
        });
        clearDictionary();
      })
    }])

    .controller("modalCtrl", ['$scope', '$rootScope', '$uibModalInstance', function($scope, $rootScope, $uibModalInstance){

      $scope.closeModal = function(){
        $uibModalInstance.close()
      };

      $scope.createDepositSlipNote = function() {
        console.log("note: ", $scope.depositNote);
        var note = $scope.depositNote;
        $rootScope.$broadcast('depositSlipNote', note);
        $uibModalInstance.close();
      };

    }])
})();
