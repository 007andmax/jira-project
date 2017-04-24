'use strict';

(function () {
  angular.module('quicktech.core.billable').controller('quicktech.core.payments.paymentsCtrl',
    ['$scope', '$stateParams', '$http', 'PaymentsService', '$uibModal', function ($scope, $stateParams, $http, PaymentsService, $uibModal) {

      var availableMods = ['payments-list', 'deposit-slips'];

      $scope.mode = availableMods[0];
      $scope.payments = [];
      $scope.orderType = 'createdAt';
      $scope.idDictionary = [];

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

      // $scope.showInfo = function(t) {
      //   console.log("CHECKED: ", t);
      // };

      PaymentsService.getPaymentsData(function(resp) {
        $scope.payments = resp;
        createDictionary($scope.payments);
        console.log("resp: ", $scope.payments);
      });

      function createDictionary(data) {
        for(var i=0; i<data.length; i++) {
          var newObj = {};
          newObj[data[i].id] = false;
          $scope.idDictionary.push(newObj);
        }
        console.log("idDictionary: ", $scope.idDictionary);
      }

      $scope.clearDictionary = function() {
        for(var id in $scope.idDictionary) {
          id = false;
        }
      };

      $scope.depositModal;
      $scope.openDepositModal = function() {
        $scope.depositModal = $uibModal.open({
          templateUrl: '/html/scripts/core/billable/payments/payments-modal.tpl.html',
          animation: true,
          backdrop : true,
          size: 'sm'
        })
      };

      $scope.closeModal = function() {
        $scope.depositModal.close()
      };


      $scope.createDepositSlip = function(data) {

      }






      // $http({
      //   url: '/payments',
      //   method: 'GET'
      // }).then(function (resp) {
      //   //$scope.payments = resp.data;
      //   // for( var object in resp.data) {
      //   //   for(var k in object) {
      //   //     var dublicateObject = {};
      //   //     dublicateObject[k] = object[k];
      //   //     dublicateObject.checked = false;
      //   //     $scope.payments.push(dublicateObject);
      //   //   }
      //   // }
      //   var data = resp.data;
      //   for (var payment in data) {
      //
      //     var newObject = angular.copy(payment);
      //     newObject.isChecked = false;
      //     console.log("newObject: ", newObject);
      //     $scope.payments.push(newObject);
      //
      //   }
      //   console.log($scope.payments)
      // });

      // map - id - ischecked


      //
      // $scope.paymentsFOrSlipList = [];
      // $scope.addToSlipList = function (payment) {
      //   console.log("payment: ", payment);
      //   $scope.paymentsFOrSlipList.push(payment);
      // }


    }])
})();
