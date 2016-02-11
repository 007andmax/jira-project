'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoServiceCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        $scope.deleteService = function () {
          $scope.services.splice($scope.$index, 1);
        };

        $scope.showEditServiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.isEditService = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.isEditService = false;
        })

      }]);

}());
