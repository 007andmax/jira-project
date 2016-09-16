'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateServicesCtrl',
      ['$scope', 'ServicesService',
        function ($scope, ServicesService) {

          $scope.isValidNewExpenseOrNote = false;
          $scope.serviceList = ServicesService.getAllByCompany($scope, $scope.ticketDetails.company.id);

          if (!($scope.ticketUpdate && $scope.ticketUpdate.services && $scope.ticketUpdate.services.length)) {
            setTicketUpdateToDefault();
          }

          function setTicketUpdateToDefault() {

            $scope.setTicketUpdate({
              services: [{item:{}}]
            });

            $scope.setTriedToSaveUpdate(false);
          }

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && !form[fieldName].$valid && (form[fieldName].$dirty || $scope.getTriedToSaveUpdate());
          };

          $scope.addService = function () {
            $scope.ticketUpdate.services.push({ item: {} });
          };

          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault)

        }]);
  }()
);
