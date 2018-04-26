'use strict';

(function () {

  angular.module("quicktech.common.directives").component('selectTaxes', {
    templateUrl: '/html/scripts/common/directives/select-taxes/select-taxes.tpl.html',
    bindings: {
      taxes: '=',
      entity: '=',
      entityType: '@?',
      onClose: '=?',
      isIcon: '@?',
      isPreviewMode: '@?'
    },
    controller: selectTaxesCtrl
  });
  selectTaxesCtrl.$inject = ['$scope'];
  function selectTaxesCtrl($scope) {
    var $ctrl = this;
    this.updateEntityTaxList = updateEntityTaxList;
    this.getSelectedTaxNames = getSelectedTaxNames;
    this.onDropdownToggle = onDropdownToggle;

    //$ctrl.isIcon = $scope.$eval($ctrl.isIcon);
    this.showIcon = $ctrl.isIcon ? true : false;
    this.previewMode = $ctrl.isPreviewMode ? true : false;

    $ctrl.searchTax = '';

    if ($ctrl.entity.taxes && $ctrl.entity.taxes.length) {
      $ctrl.selectedTaxes = createSelectedTaxes($ctrl.entity.taxes);
    } else {
      $ctrl.selectedTaxes = {};
      $ctrl.entity.taxes = $ctrl.entity.taxes || [];
    }

    $scope.$watch(function () {
      return $ctrl.taxes;
    }, generateTaxList, true);

    //  add taxes to the list from entity
    //  it's needed to make it possible to manage related taxes even when original is deleted
    // $ctrl.taxes = $ctrl.taxes.staticCopy();
    function generateTaxList() {
      $ctrl.taxList = angular.copy($ctrl.taxes);
      for (var i = 0; i < $ctrl.entity.taxes.length; i++) {
        var entityTax = $ctrl.entity.taxes[i];
        var sameOriginalTax = $ctrl.taxList.find(function (tax) {
          return tax.name === entityTax.name && tax.rate === entityTax.rate && tax.id === entityTax.id;
        });

        if (sameOriginalTax) {
          console.log('sameOriginalTax.id '+sameOriginalTax.id+' entityTax '+entityTax.id)
          sameOriginalTax.id = entityTax.id;
        } else {
          console.log('pushed tax', entityTax)
          $ctrl.taxList.push(entityTax);
        }
      }
      console.log('taList', $ctrl.taxList);
      console.log('item', $ctrl.entity);
    }

    function updateEntityTaxList(changedTax) {
      var entityTaxes = $ctrl.entity.taxes;
      for (var i = 0; i < entityTaxes.length; i++) {
        var entityTax = entityTaxes[i];
        if (entityTax.id === changedTax.id) {
          entityTaxes.splice(i, 1);
          return;
        }
      }
      entityTaxes.push(changedTax);
    }

    function getSelectedTaxNames() {
      return $ctrl.entity.taxes.map(function (tax) {
          return tax.name + ' ' + tax.rate + '%';
        }).join(', ') || 'No taxes';
    }

    function createSelectedTaxes(taxes) {
      var selectedTaxes = {};
      for (var i = 0; i < taxes.length; i++) {
        var tax = taxes[i];
        selectedTaxes[tax.id] = true;
      }
      return selectedTaxes;
    }

    function onDropdownToggle(isOpen) {
      if (!isOpen && $ctrl.onClose) {
        $ctrl.onClose($ctrl.entity, $ctrl.entityType);
      }
    }
  }

})();
