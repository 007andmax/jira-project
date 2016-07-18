'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('productsList',
    ['$timeout', 'quicktech.common.services.PermissionsService', function ($timeout, PermissionsService) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var dropdown;
          var productInput = element.find('[pl-product-input]');
          var searchProductInput = element.find('[pl-search-product-input]');

          if (attrs.productsList && scope[attrs.productsList] && scope[attrs.productsList].item) {
            productInput.val(scope[attrs.productsList].item.description);
          }
          scope.filteredProducts = {};
          scope.categoryExpanded = {};

          productInput.click(showDropdown);

          scope.closeDropdown = hideDropdown;

          scope.chooseProductItem = function (product) {

            if (product && product.description) {
              productInput.val(product.description);
            } else {
              productInput.val('');
            }

            scope.selectProduct(product);
            hideDropdown();
          };

          scope.createNewProduct = function () {

            var newProduct = {
              description: scope.searchProduct
            };

            productInput.val(newProduct.description);
            scope.selectProduct(newProduct);
            hideDropdown();

            for (var i = 0; i < scope.autocompleteData.length; i++) {
              if (scope.autocompleteData[i].default) {
                scope.autocompleteData[i].products.push(newProduct);
                return;
              }
            }
          };

          scope.$watch('categoryExpanded', function () {
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

          scope.filterProduct = function (item) {

            if (!scope.searchProduct) {
              return true;
            }

            var isDescription = item.description.toLowerCase().indexOf(scope.searchProduct.toLowerCase()) != -1;
            var isILC = item.ilc ? item.ilc.toLowerCase().indexOf(scope.searchProduct.toLowerCase()) != -1 : false;
            var isManufacture = item.manufacture ? item.manufacture.toLowerCase().indexOf(scope.searchProduct.toLowerCase()) != -1 : false;

            return isDescription || isILC || isManufacture;
          };

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
