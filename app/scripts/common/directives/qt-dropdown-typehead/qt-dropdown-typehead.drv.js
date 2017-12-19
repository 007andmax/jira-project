'use strict';

(function(){
  angular.module("quicktech.common.directives").component('qtDropdownTypehead',{
    templateUrl: '/html/scripts/common/directives/qt-dropdown-typehead/qt-dropdown-typehead.tpl.html',
    bindings: {
      listForDropdown: '<',
      selectedItem: '=',
      displayProperty: '<?',
      saveProperty: '<?'
    },
    controller: qtDropdownTypeheadCtrl
  });

  qtDropdownTypeheadCtrl.$inject = ['$scope'];
  function qtDropdownTypeheadCtrl($scope) {

    var self = this;

    self.isOpen = false;
    self.viewValueItem ='';
    self.lastCorrectSelecteditem = '';
    self.list = [];

    reInitList();

    function reInitList() {
      self.list = self.listForDropdown;
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
      if(self.displayProperty) {
        self.viewValueItem = item[self.displayProperty];
      } else {
        self.viewValueItem = item;
      }
      changeSelectedItem(item);
      self.lastCorrectSelecteditem = item;
      self.changeDropdownState();
    };

    self.getDisplayedProperty = function(item) {
      return (self.displayProperty ? item[self.displayProperty] : item);
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
        return self.getDisplayedProperty(item).toString().indexOf(self.viewValueItem) > -1;
      });
    };

    self.checkIfViewValueMatched = function(inputValue) {
      return self.listForDropdown.some(function(item) {
        return self.getDisplayedProperty(item) === inputValue
      })
    };

    self.clearValueByIconClick = function() {
      self.viewValueItem = '';
      self.lastCorrectSelecteditem = '';
      self.selectedItem = '';
      self.isOpen = true;
    };

    document.addEventListener("click", function(e){
      var targetElement = e.target || document.activeElement;
      var parent = targetElement.closest("#qtDropdown");
      if(!parent){
        self.changeDropdownState(true);
        $scope.$apply();
      }
    });

  }



})();



