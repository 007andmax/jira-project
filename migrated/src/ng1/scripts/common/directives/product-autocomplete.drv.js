'use strict';

(function () {
  angular.module("quicktech.core.tickets").directive("productAutocomplete",
	[function () {
	return {
	  restrict: 'A',
	  link: function ($scope, element, attrs) {
	  	$scope.$on('$includeContentLoaded', function (event, tempalteUrl) {
	  	  if( tempalteUrl == '/ng1/scripts/common/templates/choose-product-dropdown.tpl.html' ) {

					var productAutocomplete = new $.productAutocomplete();
					productAutocomplete.categories = [];

					for(var i=0; i<$scope.autocompleteData.length; i++) {
						productAutocomplete.categoryProducts[$scope.autocompleteData[i].id] = $scope.autocompleteData[i].products;
						productAutocomplete.categories.push({
							id: 			$scope.autocompleteData[i].id,
							name: 			$scope.autocompleteData[i].name,
							productsAmount: $scope.autocompleteData[i].products.length
						});
					}
					
		  		if ($scope.editProduct !== undefined) {
		  			// productAutocomplete.selectedCategory = $scope.editProduct;
		  			// productAutocomplete.selectedProduct = $scope.editProduct.item;
		  		}

					productAutocomplete.elements = {
						categoryList 			: element.find('input[name="productName"]'),
						productList 			: element.find('input[name="searchProduct"]'),
						productsDropdown 		: element.find('ul.dropdown-menu-products'),
						categoryListContainer 	: element.find('div.category-list-container'),
						productListContainer 	: element.find('li.product-list-container')
					}

					productAutocomplete.init();

					productAutocomplete.elements.categoryItemsContainer = element.find('.'+productAutocomplete.categoryItemsContainerClass);
					productAutocomplete.elements.productItemsContainer = element.find('.'+productAutocomplete.productItemsContainerClass);

					productAutocomplete.fetchProducts = function(category){
						productAutocomplete.hoveredCategory = category;
						productAutocomplete.loadProducts( productAutocomplete.categoryProducts[category.id] );
					};

					productAutocomplete.onProductSelect = function(product){
						$scope.selectProduct(product);
					};
				}
			});
		}
	}
  }]);

})();














