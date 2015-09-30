'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketAddService',
    function () {
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
            $scope.isShowingErrors = function (form, fieldName) {
              return form[fieldName] && !form[fieldName].$valid;
            };
          }

          $scope.addService = function (form) {
            $scope.addServiceFunc(form);
          };

        }
      };
    });

})();
