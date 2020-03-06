'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.serviceCtrl',
    ['$scope', '$rootScope', 'ServicesService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, $rootScope, ServicesService, UserConfirmationsService) {
        $scope.glNumber = angular.copy($scope.service.glNumber);

        $scope.deleteService = function () {
          var confirmMesage = 'Do you want to delete ' + $scope.service.name + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            ServicesService.deleteService($scope.service.versionedId.id);
          });
        };

        $scope.onChangeBillable = function () {
          $scope.disabledCheckbox = true;
          ServicesService.changeBillableStatus($scope.service.versionedId.id, !$scope.service.billable, function () {
            $scope.disabledCheckbox = false;
          })
        };

        $scope.onChangeDefaultState = function () {
          $scope.disabledCheckbox = true;

          var service = Object.assign({}, $scope.service, { canUseInTicket: !$scope.service.canUseInTicket });
          ServicesService.save(service, function (res) {
            $scope.disabledCheckbox = false;
          })
        }

        $scope.$watch('glNumber', function (value) {
          if (value !== undefined && value !== "" && value !== " ") {
            if (value && $scope.checkGlNumberValueMatched(value)) {
              console.log("value", value);
              if ($scope.service.glNumber == null || $scope.service.glNumber.id !== $scope.glNumber.id) {
                console.log(" no =");
                $scope.setGlNumber($scope.glNumber, $scope.service);
              }
              //  setGlNumber(item,$scope.service);
              // sendNewFilterToStorage("ticketPageFilterByCompanyHistory", $scope.companiesFilterHistoryTicketsPage, getCompanyNameById(value));

            }


          }
        });

      }]);

}());
