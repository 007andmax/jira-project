'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateServicesCtrl',
      ['$scope', 'ServicesService',
        function ($scope, ServicesService) {

          $scope.isValidNewExpenseOrNote = false;
          $scope.serviceList = ServicesService.getAllByCompany($scope, $scope.company.id);

          setTicketUpdateToDefault();

          function setTicketUpdateToDefault() {

            $scope.setTicketUpdate({
              services: [{item:{}}],
              notifyTicketCreator: true
            });

            $scope.triedToAddService = false;

          }

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && !form[fieldName].$valid && (form[fieldName].$dirty || $scope.triedToAddService);
          };

          $scope.addService = function (form) {

            if (form.$valid) {
              $scope.ticketUpdate.services.push({item:{}});
              $scope.triedToAddService = false;

            } else {
              $scope.triedToAddService = true;
            }
          };



          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault)

        }]);
  }()
);
