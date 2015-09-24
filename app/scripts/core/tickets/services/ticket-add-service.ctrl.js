'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateServiceCtrl',
      ['$scope', 'ServicesService',
        function ($scope, ServicesService) {

          $scope.ticketUpdate = {
            services: []
          };
          $scope.serviceExpenseToAdd = {};
          $scope.serviceList = ServicesService.getAllByCompany($scope, $scope.company.id);

          $scope.setTicketUpdate($scope.ticketUpdate);

          $scope.isValidTicketUpdate = function () {
            return $scope.ticketUpdate.services.length > 0;
          };

          $scope.addService = function (form) {

            if (form.$valid) {
              $scope.ticketUpdate.services.push($scope.serviceExpenseToAdd);
              $scope.serviceExpenseToAdd = {};
              form.$setPristine();
              $scope.triedToAddService = false;

            } else {
              $scope.triedToAddService = true;
            }
          };

          $scope.removeService = function (index) {
            $scope.ticketUpdate.services.splice(index, 1);
          };

        }]);
  }()
);
