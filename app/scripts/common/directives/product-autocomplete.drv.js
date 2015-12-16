'use strict';

(function () {
	var manager = {
		categories: [],
		categoryProducts: {},

		hoveredCategory:      null,
		selectedCategory:     null,
		selectedProduct:      null,

		elements: {
			categoryList 			: null,
			productList 			: null,
			productsDropdown 		: null,
			categoryListContainer 	: null,
			productListContainer 	: null,
			categoryItemsContainer 	: null,
			productItemsContainer 	: null
		},

		categoryItemsContainerClass: 'category-menu-container',
		productItemsContainerClass: 'product-menu-container',
		productMaxWidth: 0,


		init: function(){
			if(manager.selectedCategory && manager.selectedProduct) {
			  manager.elements.categoryList.val(manager.selectedCategory.name + ' #' + manager.selectedProduct.code);
			}

			manager.productsMaxWidth = manager.getProductsMaxWidth();

			// Disable hiding productsDropdown if the area around the text box is clicked
	  		manager.elements.productsDropdown.click(function(e){e.stopPropagation()});

			manager.loadPlugins();
		},

		getProductsMaxWidth:function() {
			var maxWidth = 0;
			for(var categoryIndex in manager.categoryProducts) {
			  for(var i=0; i< manager.categoryProducts[categoryIndex].length; i++) {
			    var product = manager.categoryProducts[categoryIndex][i];
			    var width = $.Autocomplete.getHtmlWidth('<div class="my-products-menu"><a><span class="title">'+product.name+'</span><span class="pull-right total-count">#'+product.code+'</span></a></div>');
			    if(width >= maxWidth) {
			      maxWidth = width;
			    }
			  }
			}
			return maxWidth;
		},

		loadProducts: function (products) {
		  	manager.elements.productsDropdown.css('margin-left', manager.elements.categoryItemsContainer.outerWidth()+7).show();
		  	manager.elements.productList.val('').autocomplete('setOptions', {lookup: function(query, done){
				var data = {suggestions: []};
				var queryLowerCase = query.toLowerCase();

				for(var i in products) {
				  if( products[i].name.toLowerCase().indexOf(queryLowerCase) !== -1) {
					data.suggestions.push({value: products[i].name, data: products[i]})
				  }
				}
				done(data);
		  	}, lastSelected: manager.selectedProduct?manager.selectedProduct.name:''
		  	}).autocomplete('onValueChange');

		  	manager.elements.productsDropdown.width(manager.elements.productItemsContainer.outerWidth());
		},

		fetchProducts: function(category){
			manager.hoveredCategory = category;
			manager.loadProducts( manager.categoryProductsCache[category.id] );
		},

		loadPlugins : function(){

			// Load Autocomplete on Categories
			manager.elements.categoryList.autocomplete({

				appendTo: manager.elements.categoryListContainer,
				showNoSuggestionNotice: true,
				noSuggestionNotice: 'No results found',
				showNoDataNotice: true,
				noDataNotice: 'No results found',
				preventSelection: true,
				classes: {
					containerClass: manager.categoryItemsContainerClass
				},
				minChars: 0,
				maxHeight: 80,
				maxWidth: 600,
				minWidth: 100,
				listMarginTop: 6,
				listPaddingTop: 10,
				listPaddingBottom: 10,
				forceFixPosition: true,
				preserveLastHovered: true,
				lastHovered: manager.selectedCategory?manager.selectedCategory.name:'',

				lookup: function(query, done){
					var data = {suggestions: []};
					var queryLowerCase = query.toLowerCase();
					for(var i=0; i<manager.categories.length; i++) {
					  if( manager.categories[i].name.toLowerCase().indexOf(queryLowerCase) !== -1) {
						data.suggestions.push({value: manager.categories[i].name, data: manager.categories[i]})
					  }
					}
					done(data);
				},
				onChangeSelect: function(selection){
					manager.fetchProducts(selection.data);
					manager.elements.productList.autocomplete('resetSelection');
				} ,
				onSelect: function(){
					return false;
				},

				onSelectAction: function(){
					manager.elements.productList.focus();
				},
				formatItem: function(result, suggestion) {
					return '<a tabindex="-1" href="javascript:void(0)"> \
						<span class="title">'+result+'</span> \
						<span class="pull-right total-count">'+suggestion.data.productsAmount+' items</span> \
						<span class="clearfix"></span> \
					</a>';
				},
				calculateWidth: function(result, suggestion) {
					var width = $.Autocomplete.getHtmlWidth('<div class="'+manager.categoryItemsContainerClass+'"><a><span class="title">'+result+'</span><span class="pull-right total-count">'+suggestion.data.productsAmount+'items</span></a></div>');
					return width+40;
				},
				onHide: function() {
					if( manager.selectedCategory && manager.selectedProduct ) {
					  manager.elements.categoryList.val( manager.selectedCategory.name + ' #' + manager.selectedProduct.code );
					}
					manager.elements.productsDropdown.hide();
				},
				onFocus: function(hoveredItem){
					var currentValue = manager.elements.categoryList.val();
					if( currentValue == ''){
					  currentValue = 'Products';
					}
					manager.elements.categoryList.val('').attr('placeholder', currentValue);
					if( manager.selectedCategory && manager.selectedProduct ) {
					  manager.fetchProducts(manager.selectedCategory);
					}
				},
				// onTab: function() {
				//   //categoryList.autocomplete('hide');
				// }
			});

			// Load Autocomplete on Products
			manager.elements.productList.autocomplete({
				appendTo: manager.elements.productListContainer,
				lookup: [],
				classes: {
					containerClass: manager.productItemsContainerClass
				},
				minChars: 0,
				maxHeight: 80,
				// maxWidth: 600,
				// minWidth: 100,
				width: manager.productsMaxWidth+40,
				forceFixPosition: false,
				//listMarginTop: 6,
				listPaddingTop: 10,
				listPaddingBottom: 10,
				showNoSuggestionNotice: true,
				noSuggestionNotice: 'Sorry, no matching results',
				showNoDataNotice: true,
				noDataNotice: 'Sorry, No data available.',
				preserveLastSelected: true,
				lastSelected: manager.selectedProduct?manager.selectedProduct.name:'',

				onSelect: function(selection){
					manager.selectedProduct = selection.data;
					manager.selectedCategory = manager.hoveredCategory;
					manager.elements.productsDropdown.hide();
					manager.elements.categoryList.val(manager.selectedCategory.name+' #'+selection.data.code);
					manager.elements.categoryList.autocomplete('hide').autocomplete('disableKillerFn');
				},
				formatItem: function(result, suggestion) {
					return '<a tabindex="-1" href="javascript:void(0)"> \
						<span class="title">'+result+'</span> \
						<span class="pull-right total-count">#'+suggestion.data.code+'</span> \
						<span class="clearfix"></span> \
					</a>';
				},
				onHide: function() {
					manager.elements.productsDropdown.hide();
					manager.elements.categoryList.autocomplete('hide').autocomplete('disableKillerFn');
				}
			});
		}
	}

  angular.module("quicktech.core.tickets").directive("productAutocomplete",
	['ProductsService', function (ProductsService) {
	return {
	  restrict: 'A',
	  link: function ($scope, element, attrs) {

	  		manager.categories = [];

	  		for(var i=0; i<$scope.autocompleteData.length; i++) {
	  			manager.categoryProducts[$scope.autocompleteData[i].id] = $scope.autocompleteData[i].products;
	  			manager.categories.push({
					id: 			$scope.autocompleteData[i].id,
					name: 			$scope.autocompleteData[i].name,
					productsAmount: $scope.autocompleteData[i].products.length
	  			});
	  		}

			manager.elements = {
				categoryList 			: element.parents('div.dropdown').find('input[name="productName"]'),
				productList 			: element.find('input'),
				productsDropdown 		: element.find('ul.dropdown-menu-products'),
				categoryListContainer 	: element.find('div.category-list-container'),
				productListContainer 	: element.find('li.product-list-container'),
				categoryItemsContainer 	: element.find('.'+manager.categoryItemsContainerClass),
				productItemsContainer 	: element.find('.'+manager.productItemsContainerClass),
			}

			manager.init();

			manager.elements.categoryItemsContainer = element.find('.'+manager.categoryItemsContainerClass);
			manager.elements.productItemsContainer = element.find('.'+manager.productItemsContainerClass);

			manager.fetchProducts = function(category){
				manager.hoveredCategory = category;
				manager.loadProducts( manager.categoryProducts[category.id] );
			};

	  	}
	}
  }]);

})();














