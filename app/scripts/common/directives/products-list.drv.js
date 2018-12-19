'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('productsList',
    ['$timeout', 'quicktech.common.services.PermissionsService', '$rootScope', function ($timeout, PermissionsService, $rootScope) {
      return {
        restrict: 'A',

        link: function (scope, element, attrs) {

          var dropdown;
          var productInput = element.find('[pl-product-input]');
          var searchProductInput = element.find('[pl-search-product-input]');


          if (attrs.productsList && scope[attrs.productsList] && scope[attrs.productsList].item) {
            productInput.val(scope[attrs.productsList].item.description);
          }

          if (attrs.productsList && scope[attrs.productsList] && scope[attrs.productsList].name) {
            productInput.val(scope[attrs.productsList].name.description);
          }
          scope.filteredProducts = {};
          scope.categoryExpanded = {};

          productInput.click(showDropdown);

          scope.closeDropdown = hideDropdown;

          scope.$watch(function() {
            return $rootScope.selectedMobileProduct
          }, function(val) {

            if (val) {
              scope.chooseProductItem(val.item, true)
              $rootScope.selectedMobileProduct = false;
            } else if (val === null) {
              scope.chooseProductItem(null, true)
            }
          })

          scope.chooseProductItem = function (product, notUseCallback) {
            if (product && product.description) {
              productInput.val(product.description);
            } else {
              productInput.val('');
            }

            if (!notUseCallback) scope.selectProduct(product);
            scope.$broadcast('addFloatPartOfNumber');
            hideDropdown();
          };

          scope.clearInputField = function() {
            productInput.val('');
            scope.removeProduct();
          };

          scope.$watch('categoryExpanded', function () {
            var keys = Object.keys(scope.categoryExpanded);
            var isOpened = false;
            
            keys.forEach(function(key) {
              if (scope.categoryExpanded[key] === true) {
                $rootScope.isProductCategoryOpened = true;
                isOpened = true;
              }
            })

            if (!isOpened) $rootScope.isProductCategoryOpened = false;
            if (dropdown) {
              $timeout(function () {
                dropdown.nanoScroller();
              });
            }
          }, true);

          scope.$watch('searchProduct', function (val) {
            scope.isCanCreateProduct = val && val.length > 0 && PermissionsService.isAllowed('MANAGE_PRODUCTS');

            if (dropdown) {
              dropdown.nanoScroller();
            }

          });

          scope.setCategoryExpanded = function(index, id) {
            if (false) {
              console.log('here')
              $scope.categoryExpanded[id] = true;
            }
          }

          scope.filterProduct = function (item) {

            if (!scope.searchProduct) {
              return true;
            }

            var isDescription = item.description.toLowerCase().indexOf(scope.searchProduct.toLowerCase()) != -1;
            var isILC = item.ilc ? item.ilc.toLowerCase().indexOf(scope.searchProduct.toLowerCase()) != -1 : false;
            var isManufacture = item.manufacture ? item.manufacture.toLowerCase().indexOf(scope.searchProduct.toLowerCase()) != -1 : false;

            return isDescription || isILC || isManufacture;
          };

          scope.$on('createNewEntity', function (event, type) {
            if (type.toString().toLowerCase() === 'product' && productInput.val() === '') {
              var unsubscribe = scope.$on('newProductHasBeenCreated',
                function (e, id) {
                  $timeout(function () {
                    var categories = scope.autocompleteData;
                    for (var i = 0; i < categories.length; i++) {
                      var products = categories[i].products;
                      for (var j = 0; j < products.length; j++) {
                        var product = products[j];

                        if (product.versionedId.id === id) {
                          scope.chooseProductItem(product);
                          unsubscribe();
                          return;
                        }
                      }
                    }
                  }, 100);
                  unsubscribe();
                });
            }
          });

          function showDropdown() {
            if (!scope.isPLOpen) {
              if (!dropdown) {
                dropdown = element.find('[pl-conteiner]')
              }

              dropdown.show();
              scope.isPLOpen = true;
              initNanoscrollt();

              $timeout(function () {
                searchProductInput.focus();
              });

            }
          }

          scope.showDropdown = function() {
            showDropdown()
          };

          function hideDropdown() {
            if (scope.isPLOpen) {
              dropdown.hide();
              scope.isPLOpen = false;
              scope.searchProduct = '';
            }
          }

          function initNanoscrollt() {
            $timeout(function () {
              if (!dropdown) {
                dropdown = element.find('[pl-conteiner]')
              }
              dropdown.nanoScroller();
            })

          }

        }
      }
    }]);
})();
