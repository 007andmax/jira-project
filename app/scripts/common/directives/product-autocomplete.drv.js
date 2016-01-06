'use strict';

(function () {
  angular.module("quicktech.core.tickets").directive("productAutocomplete",
	['ProductsService', function (ProductsService) {
	return {
	  restrict: 'A',
	  link: function ($scope, element, attrs) {

	  		$.productAutocomplete.categories = [];

	  		for(var i=0; i<$scope.autocompleteData.length; i++) {
	  			$.productAutocomplete.categoryProducts[$scope.autocompleteData[i].id] = $scope.autocompleteData[i].products;
	  			$.productAutocomplete.categories.push({
					id: 			$scope.autocompleteData[i].id,
					name: 			$scope.autocompleteData[i].name,
					productsAmount: $scope.autocompleteData[i].products.length
	  			});
	  		}

			$.productAutocomplete.elements = {
				categoryList 			: element.parents('div.dropdown').find('input[name="productName"]'),
				productList 			: element.find('input'),
				productsDropdown 		: element.find('ul.dropdown-menu-products'),
				categoryListContainer 	: element.find('div.category-list-container'),
				productListContainer 	: element.find('li.product-list-container'),
				categoryItemsContainer 	: element.find('.'+$.productAutocomplete.categoryItemsContainerClass),
				productItemsContainer 	: element.find('.'+$.productAutocomplete.productItemsContainerClass),
			}

			$.productAutocomplete.init();

			$.productAutocomplete.elements.categoryItemsContainer = element.find('.'+$.productAutocomplete.categoryItemsContainerClass);
			$.productAutocomplete.elements.productItemsContainer = element.find('.'+$.productAutocomplete.productItemsContainerClass);

			$.productAutocomplete.fetchProducts = function(category){
				$.productAutocomplete.hoveredCategory = category;
				$.productAutocomplete.loadProducts( $.productAutocomplete.categoryProducts[category.id] );
			};
	  	}
	}
  }]);

})();














