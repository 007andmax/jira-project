'use strict';

(function () {

  angular.module("quicktech.common.directives").component('selectTaxes', {
    templateUrl: '/html/scripts/common/directives/select-taxes/select-taxes.tpl.html',
    bindings: {
      taxes: '=',
      entity: '=',
      entityType: '@?',
      onClose: '=?'
    },
    controller: selectTaxesCtrl
  });

  function selectTaxesCtrl() {
    var $ctrl = this;
    this.updateEntityTaxList = updateEntityTaxList;
    this.getSelectedTaxNames = getSelectedTaxNames;
    this.onDropdownToggle = onDropdownToggle;

    $ctrl.searchTax = '';

    if ($ctrl.entity.taxes && $ctrl.entity.taxes.length) {
      $ctrl.selectedTaxes = createSelectedTaxes($ctrl.entity.taxes);
    } else {
      $ctrl.selectedTaxes = {};
      $ctrl.entity.taxes = $ctrl.entity.taxes || [];
    }

    function updateEntityTaxList(changedTax) {
      var entityTaxes = $ctrl.entity.taxes;
      for (var i = 0; i < entityTaxes.length; i++) {
        var entityTax = entityTaxes[i];
        if (entityTax.original && entityTax.original.id === changedTax.id || entityTax.id === changedTax.id) {
          entityTaxes.splice(i, 1);
          return;
        }
      }
      entityTaxes.push(changedTax);
    }

    function getSelectedTaxNames() {
      return $ctrl.taxes && $ctrl.taxes.filter(function (tax) {
          return $ctrl.selectedTaxes[tax.id];
        }).map(function (tax) {
          return tax.name + ' ' + tax.rate + '%';
        }).join(', ') || 'No taxes selected';
    }

    function createSelectedTaxes(taxes) {
      var selectedTaxes = {};
      for (var i = 0; i < taxes.length; i++) {
        var tax = taxes[i];
        selectedTaxes[tax.original ? tax.original.id : tax.id] = true;
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
