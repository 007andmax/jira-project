'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.commissionsCtrl',
    ['$scope', 'UsersService', 'ProductsService', 'ServicesService', 'CompaniesService',
      function ($scope, UsersService, ProductsService, ServicesService, CompaniesService) {

        console.log('commissions controller')

        $scope.view = 'product';

        $scope.setView = function(view) {
          $scope.view = view;
        }

        ProductsService.getCategories($scope, function(res) {
          $scope.categories = res;
        })

        ServicesService.getServicesData($scope, function(res) {
          $scope.services = res;

          console.log($scope.services, 'SERVICES')
        })

        $scope.setCategoryRate = function(id, rate) {

          if (rate || rate === 0) {
            CompaniesService.setCategoryRate(id, rate, function(res) {
              console.log(res, 'Set category rate')
            })
          }

        }

        $scope.setServiceRate = function(id, rate) {

          if (rate || rate === 0) {
            CompaniesService.setServiceRate(id, rate, function(res) {
              console.log(res, 'Set service rate')
            })
          }

        }

      }]);

}());
