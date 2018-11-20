'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateServiceCtrl',
      ['$scope', 'ServicesService',
        function ($scope, ServicesService) {

          $scope.discountAmountMsxLength;
          $scope.maxServiceDate = new Date();

          if (window.innerWidth > 414 && $scope.serviceExpense) {
            $scope.serviceExpense.item = undefined;
          }

          $scope.setNewService = function (service) {
            $scope.serviceExpense.item = service.staticCopy()
          };

          $scope.removeService = function () {
            $scope.ticketUpdate.services.splice($scope.$index, 1);
            if($scope.ticketUpdate.services.length === 0) {
              $scope.addService();
            }
          };

          $scope.$watch('serviceExpense.item.name', function () {
            if(!$scope.serviceExpense || !$scope.serviceExpense.item || !$scope.serviceExpense.item.name){
              return;
            }

            for (var i = 0; i < $scope.serviceList.length; i++) {

              if(!$scope.serviceList[i].name){
                return;
              }

              if ($scope.serviceExpense.item.name.toLowerCase() === $scope.serviceList[i].name.toLowerCase()) {
                $scope.serviceExpense.item = angular.copy($scope.serviceList[i]);
                return;
              }
              // else {
              //   if ($scope.serviceExpense.item && $scope.serviceExpense.item.versionedId) {
              //     $scope.serviceExpense.item.versionedId.id = undefined;
              //   }
              // }

            }
          });

        }]);
  }()
);
