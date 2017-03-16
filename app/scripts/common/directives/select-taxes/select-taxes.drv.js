'use strict';

(function () {

  angular.module("quicktech.common.directives").component('selectTaxes', {
    templateUrl: '/html/scripts/common/directives/select-taxes/select-taxes.tpl.html',
    bindings: {
      taxes: '=',
      entity: '=',
      onClose: '=?'
    },
    controller: selectTaxesCtrl
  });

  selectTaxesCtrl.$inject = ['$scope'];
  function selectTaxesCtrl($scope) {
    var $ctrl = this;
    this.updateEntityTaxList = updateEntityTaxList;
    this.getSelectedTaxNames = getSelectedTaxNames;

    $ctrl.searchTax = '';

    if ($ctrl.entity.taxes && $ctrl.entity.taxes.length) {
      $ctrl.selectedTaxes = createSelectedTaxes($ctrl.entity.taxes);
    } else {
      $ctrl.selectedTaxes = {};
      $ctrl.entity.taxes = $ctrl.entity.taxes || [];
    }

    $scope.$watchCollection(function () {
      return $ctrl.taxes && $ctrl.taxes.map(function (tax) {
          return tax.id;
        }) || [];
    }, filterEntityTaxes);

    function filterEntityTaxes(newValue, oldValue) {
      if (newValue !== oldValue && newValue.length < oldValue.length) {
        var entityTaxes = $ctrl.entity.taxes;
        for (var i = 0; i < entityTaxes.length; i++) {
          var tax = entityTaxes[i];
          if (newValue.indexOf(tax.id) === -1) {
            entityTaxes.splice(i, 1);
            i--;
          }
        }
      }
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
          return tax.name;
        }).join(', ') || '';
    }

    function createSelectedTaxes(taxes) {
      var selectedTaxes = {};
      for (var i = 0; i < taxes.length; i++) {
        var tax = taxes[i];
        selectedTaxes[tax.original.id] = true;
      }
      return selectedTaxes;
    }
  }

})();
