'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateServiceCtrl',
      ['$scope', 'ServicesService',
        function ($scope, ServicesService) {

          $scope.maxServiceDate = new Date();

          $scope.setNewService = function (service) {
            $scope.serviceExpense.item = service.staticCopy()
          };

          $scope.removeService = function () {
            $scope.ticketUpdate.services.splice($scope.$index, 1);
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
                $scope.serviceExpense.item = $scope.serviceList[i].staticCopy();
                return;
              } else {
                if ($scope.serviceExpense.item && $scope.serviceExpense.item.versionedId) {
                  $scope.serviceExpense.item.versionedId.id = undefined;
                }
              }

            }
          });

        }]);
  }()
);

