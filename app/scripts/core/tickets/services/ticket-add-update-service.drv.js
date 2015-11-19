'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketAddService',
    ['$filter', function ($filter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        templateUrl: '/html/scripts/core/tickets/services/ticket-add-update-service.tpl.html',
        scope: {
          serviceExpense: '=ngModel',
          serviceList: '=serviceList',
          addServiceFunc: '=addServiceFunc',
          removeService: '=removeServiceFunc',
          numberPattern: '=numberPattern',
          index: '=index',
          showErrors: '='
        },
        link: function ($scope, element, attrs) {

          if (attrs.enableAddMode) {

            $scope.isAddMode = true;

            $scope.isShowingErrors = function (form, fieldName) {
              return form[fieldName] && !!$scope.showErrors && !form[fieldName].$valid;
            };

          } else {

            $scope.serviceNameFilter = $scope.serviceExpense.item.name;
            $scope.serviceExpense.date = $filter('date')($scope.serviceExpense.date, 'd MMM yyyy');

            $scope.isShowingErrors = function (form, fieldName) {
              return form[fieldName] && !form[fieldName].$valid;
            };
          }

          $scope.addService = function (form) {
            $scope.addServiceFunc(form);
            $scope.serviceNameFilter = '';
          };

          $scope.setNewService = function (service) {
            $scope.serviceNameFilter = service.name;
            $scope.serviceExpense.item = service.staticCopy()
          };

          $scope.$watch('serviceNameFilter', function () {
            for (var i = 0; i < $scope.serviceList.length; i++) {
              if ($scope.serviceNameFilter.toLowerCase() === $scope.serviceList[i].name.toLowerCase()) {
                $scope.serviceExpense.item = $scope.serviceList[i].staticCopy();
                return;
              } else {
                if ($scope.serviceExpense.item && $scope.serviceExpense.item.versionedId) {
                  $scope.serviceExpense.item.versionedId.id = undefined;
                }
              }
            }
          })

        }
      };
    }]);

})();
