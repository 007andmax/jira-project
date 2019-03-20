'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.productsTabCtrl',
    ['$scope', '$state', 'ProductsService', 'quicktech.common.services.UserNotificationService', 'CompaniesService',
      'quicktech.common.services.PermissionsService',
      function ($scope, $state, ProductsService, UserNotificationService, CompaniesService, PermissionsService) {

        $scope.orderProducts = {
          field: 'description',
          reverse: false
        };

        ProductsService.getCategories($scope, function (resp) {
          $scope.categories = resp;
        });

        $scope.$on('productDeleted', function (event, id) {
          if ($scope.productsData.length === 0 || ($scope.productsData.length === 1 && $scope.productsData[0].versionedId.id === id)) {
            $scope.company.hasProducts = false;
            var allowedTab = $scope.isHasDevices ? 'devices' : (PermissionsService.isAllowed('VIEW_USERS') ? 'users' : 'settings');
            $state.go('companyProfile', { tabName: allowedTab });
          }
        });

        $scope.getCompanyById = function (companyId) {
          return CompaniesService.getOneById(companyId);
        };

        $scope.setOrderForProducts = function (option) {
          if (option === $scope.orderProducts.field) {
            $scope.orderProducts.reverse = !$scope.orderProducts.reverse;
          } else {
            $scope.orderProducts.field = option;
            $scope.orderProducts.reverse = false;
          }
        };

        $scope.orderByForProducts = function (item) {
          if ($scope.orderProducts.field === 'ilc') {
            return item.ilc;
          } else if ($scope.orderProducts.field === 'manufacture') {
            return item.manufacture;
          } else if ($scope.orderProducts.field === 'category') {
            return item.category.name;
          } else if ($scope.orderProducts.field === 'description') {
            return item.description;
          } else if ($scope.orderProducts.field === 'cost') {
            return item.cost;
          } else if ($scope.orderProducts.field === 'sale') {
            return item.sale;
          }

        };

      }]);

}());
