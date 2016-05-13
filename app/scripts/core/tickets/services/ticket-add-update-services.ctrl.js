'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateServicesCtrl',
      ['$scope', 'ServicesService',
        function ($scope, ServicesService) {

          $scope.isValidNewExpenseOrNote = false;
          $scope.serviceList = ServicesService.getAllByCompany($scope, $scope.company.id);

          $scope.autocompleteServiceList = [];
          $scope.$watch('serviceList.length', function () {
            if( $scope.serviceList.length ) {
              for (var i = 0; i < $scope.serviceList.length; i++) {
                $scope.autocompleteServiceList.push({'value': $scope.serviceList[i].name, 'data':$scope.serviceList[i]});
              }
            }
          });

          setTicketUpdateToDefault();

          function setTicketUpdateToDefault() {

            $scope.setTicketUpdate({
              services: [{item:{}}],
              notifyTicketCreator: true
            });

            $scope.addTicketOwnerToUpdate();
            $scope.triedToAddService = false;
          }

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && !form[fieldName].$valid && (form[fieldName].$dirty || $scope.triedToAddService);
          };



          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault)

        }]);
  }()
);
