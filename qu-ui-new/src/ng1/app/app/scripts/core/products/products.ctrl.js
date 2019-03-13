'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsCtrl',
    ['$scope', '$rootScope', 'ProductsService', 'CompaniesService', '$timeout',
      'quicktech.common.services.SharedStateService', '$stateParams', '$state', 'quicktech.common.services.PermissionsService', 'TaxesService',
      function ($scope, $rootScope, ProductsService, CompaniesService, $timeout,
                SharedStateService, $stateParams, $state, PermissionsService, TaxesService) {

        var availableTabs = ['category', 'list'],
          globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.PermissionsService = PermissionsService;
        $scope.$state = $state;
        $scope.orderProducts = {
          field: 'description',
          reverse: false
        };
        $scope.category = $stateParams.category;

        $scope.successProductAdding = false;

        $scope.$on('newProductHasBeenCreated', function (event, data) {
          $scope.successProductAdding = true;
          $timeout(function() {
            $scope.successProductAdding = false;
          }, 3000)
        });
        $scope.productSearchName = '';
        $scope.loadingInProgress = true;

        ProductsService.getAllProducts($scope, function (resp) {
          if ($scope.category && $scope.category!== 'all') {
            resp.list = resp.list.filter(function(item){
              return item.category.name === $scope.category;
            });
            $scope.productsData = resp;
          } else {
            $scope.productsData = resp;
          }

          if (resp && resp.list && !resp.list.length) {
            $scope.loadingInProgress = false;
          }
        });

        $scope.expandedCategoryId = '';

        $scope.$watch(function () {
          return $state.params.tabName;
        }, function (tab) {
          if (availableTabs.indexOf(tab) < 0) {
            $scope.currentOpenTab = availableTabs[0];
          } else {
            $scope.currentOpenTab = tab;
          }
        });

        $scope.$watch('highlightProductId', function (productId) {
          if (productId) {

            $timeout(function () {
              $scope.$broadcast('show-' + productId);

              $timeout(function () {
                $scope.setHighlightProductId();
              }, 2000);
            });
          }
        });

        $scope.$watch('highlightCreatedProductId', function (createdProductId) {
          if (createdProductId && $scope.createdProductId && $scope.createdProductId == createdProductId) {

            $scope.setCreatedProductId();
            $timeout(function () {
              $scope.$broadcast('show-' + createdProductId);

              $timeout(function () {
                $scope.setHighlightCreatedProductId();
              }, 2000);
            });
          }
        });

        $scope.getCompanyById = function (companyId) {
          return CompaniesService.getOneById(companyId);
        };

        $scope.loadingFinished = function () {
          $scope.loadingInProgress = false;
          var globalFilter = globalSearch.productFilter;
          if (globalFilter) {
            $timeout(function () {
              $rootScope.$broadcast(globalFilter.category + '-showProduct', globalFilter.id);
            });
            globalSearch.productFilter = undefined;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveCategory || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.setHighlightProductId = function (productId) {
          $scope.highlightProductId = productId;
        };

        $scope.setHighlightCreatedProductId = function (productId) {
          if ($scope.highlightCreatedProductId != productId) {
            $scope.highlightCreatedProductId = productId;
          }
        };

        $scope.setCreatedProductId = function (productId) {
          $scope.createdProductId = productId;
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
          } else if ($scope.orderProducts.field === 'vendor') {
            return item.company ? item.company.name : '';
          } else if ($scope.orderProducts.field === 'cost') {
            return item.cost;
          } else if ($scope.orderProducts.field === 'sale') {
            return item.sale;
          }

        };

        $scope.setExpandedCategoryId = function (id) {
          if (id === $scope.expandedCategoryId) {
            $scope.expandedCategoryId = '';
          } else {
            $scope.expandedCategoryId = id;
          }
        };

        $scope.getSelectedTaxNames = function(taxes) {
          if(taxes && taxes.length && taxes.length > 0) {
            var taxObjects = TaxesService.findTaxesByIds(taxes);
            return taxes && taxObjects.map(function (tax) {
              if(tax && tax.name && tax.rate) {
                return tax.name + ' ' + tax.rate + '%';
              } else {
                return '';
              }
            }).join(', ') || 'No taxes';
          } else {
            return 'No taxes';
          }

        };

      }]);

}());
