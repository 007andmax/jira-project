'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('productsList',
    ['$timeout',
      function ($timeout) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {

            var dropdown;
            var productInput = element.find('[pl-product-input]');
            var searchProductInput = element.find('[pl-search-product-input]');

            if (attrs.productsList && scope[attrs.productsList] && scope[attrs.productsList].item) {
              productInput.val(scope[attrs.productsList].item.description);
            }

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
            };

            scope.$watch('searchProduct', function (val) {
              scope.isCanCreateProduct = val && val.length > 0;

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
