(function ($) {
	$.productAutocomplete = function(){

		this.categories = [];
		this.categoryProducts = {};

		this.hoveredCategory =      null;
		this.selectedCategory =     null;
		this.selectedProduct =      null;

		this.elements = {
			categoryList 			: null,
			productList 			: null,
			productsDropdown 		: null,
			categoryListContainer 	: null,
			productListContainer 	: null,
			categoryItemsContainer 	: null,
			productItemsContainer 	: null
		};

		this.categoryItemsContainerClass = 'category-menu-container';
		this.productItemsContainerClass = 'product-menu-container';
		this.productMaxWidth = 0;
	}


	$.productAutocomplete.prototype.init = function(){
		if(this.selectedCategory && this.selectedProduct) {
		  this.elements.categoryList.val(this.selectedCategory.name + ' #' + this.selectedProduct.code);
		}

		this.productsMaxWidth = this.getProductsMaxWidth();

		// Disable hiding productsDropdown if the area around the text box is clicked
  		this.elements.productsDropdown.click(function(e){e.stopPropagation()});

		this.loadPlugins();
	}

	$.productAutocomplete.prototype.getProductsMaxWidth = function() {
		var maxWidth = 0;
		for(var categoryIndex in this.categoryProducts) {
		  for(var i=0; i< this.categoryProducts[categoryIndex].length; i++) {
		    var product = this.categoryProducts[categoryIndex][i];
		    var width = $.Autocomplete.getHtmlWidth('<div class="'+this.productItemsContainerClass+'"><a><span class="title">'+product.name+'</span><span class="pull-right total-count">#'+product.code+'</span></a></div>');
		    if(width >= maxWidth) {
		      maxWidth = width;
		    }
		  }
		}
		return maxWidth;
	}

	$.productAutocomplete.prototype.loadProducts = function (products) {
	  	this.elements.productsDropdown.css('margin-left', this.elements.categoryItemsContainer.outerWidth()+7).show();

	  	this.elements.productList.val('').autocomplete('setOptions', {lookup: function(query, done){
			var data = {suggestions: []};
			var queryLowerCase = query.toLowerCase();

			for(var i in products) {
			  if( products[i].name.toLowerCase().indexOf(queryLowerCase) !== -1) {
				data.suggestions.push({value: products[i].name, data: products[i]})
			  }
			}
			done(data);
	  	}, lastSelected: this.selectedProduct?this.selectedProduct.name:''
	  	}).autocomplete('onValueChange');

	  	this.elements.productsDropdown.width(this.elements.productItemsContainer.outerWidth());
	}

	$.productAutocomplete.prototype.fetchProducts = function(category){
		this.hoveredCategory = category;
		this.loadProducts( this.categoryProductsCache[category.id] );
	}

	$.productAutocomplete.prototype.onProductSelect = function(product) {}

	$.productAutocomplete.prototype.loadPlugins = function(){
		var that =  this;
		// Load Autocomplete on Categories
		that.elements.categoryList.autocomplete({

			appendTo: that.elements.categoryListContainer,
			showNoSuggestionNotice: true,
			noSuggestionNotice: 'No results found',
			showNoDataNotice: true,
			noDataNotice: 'No results found',
			preventSelection: true,
			classes: {
				containerClass: that.categoryItemsContainerClass
			},
			minChars: 0,
			maxHeight: 150,
			maxWidth: 600,
			minWidth: 100,
			listMarginTop: 6,
			listPaddingTop: 10,
			listPaddingBottom: 10,
			forceFixPosition: true,
			preserveLastHovered: true,
			lastHovered: that.selectedCategory?that.selectedCategory.name:'',

			lookup: function(query, done){
				var data = {suggestions: []};
				var queryLowerCase = query.toLowerCase();
				for(var i=0; i<that.categories.length; i++) {
				  if( that.categories[i].name.toLowerCase().indexOf(queryLowerCase) !== -1) {
					data.suggestions.push({value: that.categories[i].name, data: that.categories[i]})
				  }
				}
				done(data);
			},
			onChangeSelect: function(selection){
				that.fetchProducts(selection.data);
				that.elements.productList.autocomplete('resetSelection');
			} ,
			onSelect: function(){
				return false;
			},

			onSelectAction: function(){
				that.elements.productList.focus();
			},
			formatItem: function(result, suggestion) {
				return '<a tabindex="-1" href="javascript:void(0)"> \
					<span class="title">'+result+'</span> \
					<span class="pull-right total-count">'+suggestion.data.productsAmount+' items</span> \
					<span class="clearfix"></span> \
				</a>';
			},
			calculateWidth: function(result, suggestion) {
				var width = $.Autocomplete.getHtmlWidth('<div class="'+that.categoryItemsContainerClass+'"><a><span class="title">'+result+'</span><span class="pull-right total-count">'+suggestion.data.productsAmount+'items</span></a></div>');
				return width+40;
			},
			onHide: function() {
				if( that.selectedCategory && that.selectedProduct ) {
				  that.elements.categoryList.val( that.selectedCategory.name + ' #' + that.selectedProduct.code );
				}
				that.elements.productsDropdown.hide();
			},
			onFocus: function(hoveredItem){
				var currentValue = that.elements.categoryList.val();
				if( currentValue == ''){
				  currentValue = 'Products';
				}
				that.elements.categoryList.val('').attr('placeholder', currentValue);
				if( that.selectedCategory && that.selectedProduct ) {
				  that.fetchProducts(that.selectedCategory);
				}
			},
			// onTab: function() {
			//   //categoryList.autocomplete('hide');
			// }
		});

		// Load Autocomplete on Products
		that.elements.productList.autocomplete({
			appendTo: that.elements.productListContainer,
			lookup: [],
			classes: {
				containerClass: that.productItemsContainerClass
			},
			minChars: 0,
			maxHeight: 150,
			// maxWidth: 600,
			// minWidth: 100,
			width: that.productsMaxWidth+40,
			forceFixPosition: false,
			//listMarginTop: 6,
			listPaddingTop: 10,
			listPaddingBottom: 10,
			showNoSuggestionNotice: true,
			noSuggestionNotice: 'Sorry, no matching results',
			showNoDataNotice: true,
			noDataNotice: 'Sorry, No data available.',
			preserveLastSelected: true,
			lastSelected: that.selectedProduct?that.selectedProduct.name:'',

			onSelect: function(selection){
				that.selectedProduct = selection.data;
				that.selectedCategory = that.hoveredCategory;
				that.elements.productsDropdown.hide();
				that.elements.categoryList.val(that.selectedCategory.name+' #'+selection.data.code);
				that.elements.categoryList.autocomplete('hide').autocomplete('disableKillerFn');

				that.onProductSelect(selection.data);
			},
			formatItem: function(result, suggestion) {
				return '<a tabindex="-1" href="javascript:void(0)"> \
					<span class="title">'+result+'</span> \
					<span class="pull-right total-count">#'+suggestion.data.code+'</span> \
					<span class="clearfix"></span> \
				</a>';
			},
			onHide: function() {
				that.elements.productsDropdown.hide();
				that.elements.categoryList.autocomplete('hide').autocomplete('disableKillerFn');
			}
		});
	}
})(jQuery);