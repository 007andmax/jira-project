'use strict';

(function () {
  angular.module('quicktech.core.billable').controller('quicktech.core.payments.paymentsCtrl',
    ['$scope', '$stateParams', '$http', 'PaymentsService', function ($scope, $stateParams, $http, PaymentsService) {

      var availableMods = ['payments-list', 'deposit-slips'];

      $scope.mode = availableMods[0];
      $scope.payments = [];
      $scope.orderType = 'createdAt';
      $scope.idMap = [];

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
        for(var i=0; i<$scope.payments.length; i++) {
          var obj = {
            id: $scope.payments[i].id,
            isChecked: false
          };
          // var obj= {
          //   $scope.payments[i].id:  false
          // }
          $scope.idMap.push(obj);
        }
        console.log("idMap: ", $scope.idMap);
        console.log("resp: ", $scope.payments);
      });




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
