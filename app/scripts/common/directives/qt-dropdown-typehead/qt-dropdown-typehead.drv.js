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

    self.focusOnInput = false;
    self.focusOnDropdown = false;
    reInitList();

    self.changeDropdownState = function() {
      self.isOpen = !self.isOpen;
      if(self.checkIfViewValueMatched(self.viewValueItem) || self.viewValueItem === '') {
        self.lastCorrectSelecteditem = (self.viewValueItem);
        changeSelectedItem(self.lastCorrectSelecteditem);
      } else {
        self.viewValueItem = self.lastCorrectSelecteditem;
      }
      reInitList();
      console.log(self.list);
    };

    function reInitList() {
      self.list = self.listForDropdown;
    }

    self.selectItem = function(item) {
      if(self.saveProperty) {
        self.viewValueItem = item[self.saveProperty];
      } else {
        self.viewValueItem = item;
      }
      changeSelectedItem(self.viewValueItem);
      self.lastCorrectSelecteditem = item;
      self.changeDropdownState();
    };

    self.getDisplayedProperty = function(item) {
      return (self.displayProperty ? item[self.displayProperty] : item);
    };

    function changeSelectedItem(item) {
      self.selectedItem = item;
    }

    self.listFilterFunction = function() {
      self.isOpen = true;
      self.list =  self.listForDropdown.filter(function(item) {
        if(self.displayProperty) {
          console.log(self.viewValueItem);
          return item[self.displayProperty].indexOf(self.viewValueItem) > -1;
        } else {
          return item.indexOf(self.viewValueItem) > -1;
        }
      });
      console.log(self.list);
    };

    self.checkIfViewValueMatched = function(inputValue) {
      return self.listForDropdown.some(function(item) {
        if(self.displayProperty) {
          return item[self.displayProperty] === inputValue;
        } else {
          return item === inputValue;
        }
      })
    };

    // self.checkComponentFocus = function() {
    //   if(!self.focusOnInput && !self.focusOnDropdown) {
    //     self.changeDropdownState()
    //   }
    // }
    // $scope.$watch(function() {
    //   return (self.focusOnInput && self.focusOnDropdown)
    // }, function(value) {
    //   if(value === false) {
    //     self.changeDropdownState();
    //   }
    // })


  }

})();

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([ 'module', 'angular' ], function (module, angular) {
      module.exports = factory(angular);
    });
  } else if (typeof module === 'object') {
    module.exports = factory(require('angular'));
  } else {
    if (!root.mp) {
      root.mp = {};
    }

    root.mp.deepBlur = factory(root.angular);
  }
}(this, function (angular) {
  'use strict';

  function containsDom(parent, dom) {
    while (dom) {
      if (dom === parent) {
        return true;
      }

      dom = dom.parentNode;
    }

    return false;
  }

  return angular.module('mp.deepBlur', [])
  // child links must use tabindex=0 to capture focus in Webkit and avoiding triggering blur
    .directive('deepBlur', [ '$timeout', function ($timeout) {
      return {
        restrict: 'A',
        controller: [ '$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          var leaveExpr = $attrs.deepBlur,
            dom = $element[0];

          function onBlur(e) {
            // e.relatedTarget for Chrome
            // document.activeElement for IE 11
            var targetElement = e.relatedTarget || document.activeElement;

            if (!containsDom(dom, targetElement)) {
              $timeout(function () {
                $scope.$apply(leaveExpr);
              }, 10);
            }
          }

          if (dom.addEventListener) {
            dom.addEventListener('blur', onBlur, true);
          } else {
            dom.attachEvent('onfocusout', onBlur); // For IE8
          }
        } ]
      };
    } ])
    .name;  // pass back as dependency name
}));


