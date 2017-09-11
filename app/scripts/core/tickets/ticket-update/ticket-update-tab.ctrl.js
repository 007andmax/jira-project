'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketUpdateTabCtrl',
      ['$scope', 'ServicesService',
        function ($scope, ServicesService) {
          $scope.serviceList = ServicesService.getAllByCompany($scope, $scope.ticketDetails.company.id);
        }]);
  }()
);
