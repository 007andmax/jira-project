'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsCtrl',
    ['$scope', '$rootScope', 'ProductsService', 'VendorsService', 'CompaniesService', '$timeout',
      'quicktech.common.services.PermissionsService',
      function ($scope, $rootScope, ProductsService, VendorsService, CompaniesService, $timeout, PermissionsService) {

        var categories,
          showCreateProductInList = false;

        $scope.PermissionsService = PermissionsService;
        $scope.orderProducts = {
          field: 'description',
          reverse: false
        };
        $scope.loadingInProgress = true;

        ProductsService.getAllProducts($scope, function (resp) {
          categories = resp.categories;
          $scope.productsData = resp;
        });

        $scope.pageTab = 'group';
        $scope.isCreateCategoryShow = false;
        $scope.newCategory = {};
        $scope.vendors = VendorsService.getAllInCompanyForAutocomplete(CompaniesService.getCurrentCompany().id);
        $scope.status = {
          isopen: false
        };
        $scope.expandedCategoryId = '';
        $scope.showCategory = '';

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

        $scope.$on('showAllCategories', function (event) {
          $scope.setShowingCategory('');
        });

        $scope.loadingFinished = function () {
          $scope.loadingInProgress = false;
        };

        $scope.openCreationCategory = function () {
          $scope.isCreateCategoryShow = true;
        };

        $scope.setPageTab = function (tab) {
          if (tab !== $scope.pageTab) {
            if (tab === 'group' && $scope.orderProducts.field === 'category') {
              $scope.orderProducts = {
                field: 'description',
                reverse: false
              };
            }

            $rootScope.$broadcast('productsTabChanged');
            $scope.pageTab = tab;
            $scope.expandedCategoryId = '';
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveCategory || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.addCategory = function (form) {
          if (form.$valid) {
            ProductsService.saveCategory($scope.newCategory, function () {
              $scope.isCreateCategoryShow = false;
              $scope.newCategory = {};
              form.$setPristine();
            });
          } else {
            $scope.triedToSaveCategory = true;
          }
        };

        $scope.isUniqueCategoryName = function (ngModelCtrl, modelId) {
          if (!categories) {
            return;
          }

          var uniqueNameCount = 0;
          for (var i = 0; i < categories.length; i++) {
            if ((ngModelCtrl.$viewValue.toLowerCase() === categories[i].name.toLowerCase()) && (modelId !== categories[i].id)) {
              uniqueNameCount++;
            }
          }
          ngModelCtrl.$setValidity('unique', uniqueNameCount < 1);
        };

        $scope.cancelEditForms = function () {
          $rootScope.$broadcast('cancelEditForm');
        };

        $scope.closeCreateCategoryForm = function () {
          $scope.isCreateCategoryShow = false;
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
            return item.vendor ? item.vendor.name : '';
          } else if ($scope.orderProducts.field === 'cost') {
            return item.cost;
          } else if ($scope.orderProducts.field === 'sale') {
            return item.sale;
          } else if ($scope.orderProducts.field === 'taxable') {
            return item.taxable;
          }

        };

        $scope.setExpandedCategoryId = function (id) {
          if (id === $scope.expandedCategoryId) {
            $scope.expandedCategoryId = '';
          } else {
            $scope.expandedCategoryId = id;
          }
        };

        $scope.setShowingCategory = function (id) {
          $scope.showCategory = id;
        };

        $scope.setShowCreateProductInList = function (trigger) {
          showCreateProductInList = trigger;
        };

        $scope.isCreationFormShown = function () {
          return showCreateProductInList;
        };

        $scope.openCreationForm = function () {
          showCreateProductInList = true;
          $scope.$broadcast('cancelEditForm');
        };
      }]);

}());
