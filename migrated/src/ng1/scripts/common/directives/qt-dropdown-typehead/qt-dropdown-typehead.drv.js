'use strict';

(function(){
  angular.module("quicktech.common.directives").component('qtDropdownTypehead',{
    templateUrl: '/ng1/scripts/common/directives/qt-dropdown-typehead/qt-dropdown-typehead.tpl.html',
    bindings: {
      listForDropdown: '<',
      selectedItem: '=',
      filterProperty: '<?',
      displayProperty: '<?',
      saveProperty: '<?',
      qtNgRequired: '<?',
      qtNgMinlength: '<?',
      qtNgMaxlength: '<?',
      qtNgPattern: '<?',
      qtNgStyle: '=?',
      qtNgClass: '<?',
      qtName: '<?',
      qtClass: '<?',
      qtNgTrim: '<?',
      qtTemplateUrl: '<?',
      qtTabindex: '<?',
      qtNgDisabled: '<?',
      qtReadonly: '<?',
      qtPlaceholder : '<?',
      activePlaceholder: '<activePlaceholder',
      noForm: '<qtValid',
      customPlaceholder: '<customPlaceholder',
      byIndustry: '<byIndustry',
      noOverflow: '<noOverflow'
    },
    controller: qtDropdownTypeheadCtrl
  });

  qtDropdownTypeheadCtrl.$inject = ['$scope', '$rootScope'];
  function qtDropdownTypeheadCtrl($scope, $rootScope) {

    var self = this;
    self.isOpen = false;
    self.viewValueItem ='';
    self.lastCorrectSelecteditem = '';
    self.list = [];


    $scope.qtPlaceholder = self.qtPlaceholder;
    $scope.activePlaceholder = self.activePlaceholder;

    $scope.noForm = self.noForm;
    $scope.byIndustry = self.byIndustry;





    var inputAdditionalSettingsDictionary = {
      'ng-required'  : self.qtNgRequired ? self.qtNgRequired : '',
      'ng-minlength' : self.qtNgMinlength ? self.qtNgMinlength : '',
      'ng-maxlength' : self.qtNgMaxlength ? self.qtNgMaxlength : '',
      'ng-pattern'   : self.qtNgPattern ? self.qtNgPattern : '',
      'ng-style'     : self.qtNgStyle ? self.qtNgStyle : '',
      'ng-class'     : self.qtNgClass ? self.qtNgClass : '',
      'name'         : self.qtName ? self.qtName : '',
      'ng-trim'      : self.qtNgTrim ? self.qtNgTrim : '',
      'tabindex'     : self.qtTabindex ? self.qtTabindex : '',
      'ng-disabled'  : self.qtNgDisabled ? self.qtNgDisabled : '',
      'placeholder'  : self.activePlaceholder ? '' : self.qtPlaceholder ? self.qtPlaceholder : self.customPlaceholder ? self.customPlaceholder : '',
    };


    reInitList();
    addSettingToInput();

    function reInitList() {
      self.list = self.listForDropdown;
      console.log(self.list);
    }

    self.changeDropdownState = function(isOutsideClick) {
      if(isOutsideClick) {
        self.isOpen = false;
      } else {
        self.isOpen = !self.isOpen;
      }
      if(self.checkIfViewValueMatched(self.viewValueItem) || self.viewValueItem === '') {
        self.lastCorrectSelecteditem = self.viewValueItem;
      } else {
        self.viewValueItem = self.lastCorrectSelecteditem;
      }
      reInitList();
    };

    self.selectItem = function(item) {
      console.log(item, 'ITEM');
      console.log(self.filterProperty, 'self.filterProperty');
      if (item) {
        if (self.filterProperty) {
          self.viewValueItem = item[self.filterProperty];
        } else {
          self.viewValueItem = item;
        }
        changeSelectedItem(item);
        self.lastCorrectSelecteditem = item;
        self.changeDropdownState();
      }
    }


    $scope.$watch(function() {
      return $rootScope.selectedIndustryItem;
    }, function(val) {
      self.selectItem(val);
    })



    self.getDisplayedProperty = function(item) {
      return (self.displayProperty ? item[self.displayProperty] : item);
    };

    self.getFilterProperty = function(item) {
      return (self.filterProperty ? item[self.filterProperty] : item);
    };

    self.getAttributeForSorting = function(item) {
      return self.filterProperty ? self.filterProperty : item
    };

    function changeSelectedItem(item) {
      if(self.saveProperty) {
        self.selectedItem = item[self.selectedItem]
      } else {
        self.selectedItem = item;
      }
    }

    self.listFilterFunction = function() {
      self.isOpen = true;
      self.list =  self.listForDropdown.filter(function(item) {
        return self.getFilterProperty(item).toString().toLowerCase().indexOf(self.viewValueItem.toLowerCase()) > -1;
      });

    };

    self.checkIfViewValueMatched = function(inputValue) {
      console.log(inputValue, 'inputValue');
      // console.log(self.listForDropdown, 'listForDropdown');
      var newInputValue = (inputValue && inputValue.name) ? inputValue.name : inputValue;
      if(inputValue) {
        var newInputValue = (inputValue && inputValue.name) ? inputValue.name : inputValue;
        console.log(newInputValue, 'newInputValue');
        return self.listForDropdown.some(function(item) {
          return self.getFilterProperty(item).toString().toLowerCase() === newInputValue.toLowerCase()
        })
      } else {
        return true;
      }

    };

    self.clearValueByIconClick = function() {
      self.viewValueItem = '';
      self.lastCorrectSelecteditem = '';
      self.selectedItem = '';
      self.isOpen = true;
    };

    if (self.selectedItem) {
      console.log(self.selectedItem, 'self.selectedItem');
      self.selectItem(self.selectedItem);

      self.changeDropdownState(false);
    }

    $rootScope.clearIndustryFilter = self.clearValueByIconClick;

    document.addEventListener("click", function(e){
      var targetElement = e.target || document.activeElement;
      var parent = targetElement.closest("#qtDropdown");
      if(!parent || parent === null){
        self.changeDropdownState(true);
        $rootScope.safeDigest();

      }
    });

    function addSettingToInput() {
      var input = angular.element( document.querySelector( '#qtInput' ) );
      for (var property in inputAdditionalSettingsDictionary) {
        if (inputAdditionalSettingsDictionary.hasOwnProperty(property) && inputAdditionalSettingsDictionary[property] !== '') {
          input.attr(property, inputAdditionalSettingsDictionary[property])
        }
      }

      if(self.qtClass) {
        input.addClass(self.qtClass);
      }
      if(self.qtReadonly) {
        input.attr(self.qtReadonly);
      }

    }

  }

  angular.module("quicktech.common.directives").filter('highlightFilter', ['$sce', '$injector', '$log', function($sce, $injector, $log) {
    var isSanitizePresent;
    isSanitizePresent = $injector.has('$sanitize');

    function escapeRegexp(queryToEscape) {
      // Regex: capture the whole query string and replace it with the string that will be used to match
      // the results, for example if the capture is "a" the result will be \a
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    function containsHtml(matchItem) {
      return /<.*>/g.test(matchItem);
    }

    return function (matchItem, query) {
      if (!isSanitizePresent && containsHtml(matchItem)) {
        $log.warn('Unsafe use of typeahead please use ngSanitize'); // Warn the user about the danger
      }
      matchItem = query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem; // Replaces the capture string with a the same string inside of a "strong" tag
      if (!isSanitizePresent) {
        matchItem = $sce.trustAsHtml(matchItem); // If $sanitize is not present we pack the string in a $sce object for the ng-bind-html directive
      }
      return matchItem;
    };
  }])




})();
