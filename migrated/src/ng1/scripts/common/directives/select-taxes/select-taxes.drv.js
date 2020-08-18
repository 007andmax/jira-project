'use strict';

(function () {

  angular.module("quicktech.common.directives").component('selectTaxes', {
    templateUrl: '/ng1/scripts/common/directives/select-taxes/select-taxes.tpl.html',
    bindings: {
      taxes: '=',
      entity: '=',
      entityType: '@?',
      onClose: '=?',
      isIcon: '@?',
      isPreviewMode: '@?',
      activePlaceholder: '<activePlaceholder',
      showPlaceholder: '<showPlaceholder',
      wrong: '<wrong'
    },
    controller: selectTaxesCtrl
  });

  selectTaxesCtrl.$inject = ['$scope', '$uibModal', '$rootScope'];
  function selectTaxesCtrl($scope, $uibModal, $rootScope) {
    var $ctrl = this;
    this.updateEntityTaxList = updateEntityTaxList;
    this.getSelectedTaxNames = getSelectedTaxNames;
    this.onDropdownToggle = onDropdownToggle;

    //$ctrl.isIcon = $scope.$eval($ctrl.isIcon);
    this.showIcon = $ctrl.isIcon ? true : false;
    this.previewMode = $ctrl.isPreviewMode ? true : false;

    console.log("$ctrl.entity.taxes",$ctrl.entity.taxes);
    $ctrl.searchTax = '';
    if ($ctrl.entity.taxes && $ctrl.entity.taxes.length) {
      $ctrl.selectedTaxes = createSelectedTaxes($ctrl.entity.taxes);
    } else {
      $ctrl.selectedTaxes = {};

      $ctrl.entity.taxes = $ctrl.entity.taxes || [];


    }

    $scope.showPlaceholder = self.showPlaceholder;

    $scope.$watch(function () {
      return $ctrl.taxes;
    }, generateTaxList, true);

    $scope.addNewTax = function() {
      var modalInstance = $uibModal.open({
        templateUrl: '/ng1/scripts/common/directives/select-taxes/add-new-tax.tpl.html',
        animation: true,
        backdrop: false,
        size: 'md',
        controller: 'taxModalCtrl',
        windowClass: 'create-popup margin-top-modal-dialog',
        resolve: {
          isModalTax: true
        }

      });
    };

    $scope.$watch(function() {
      return $rootScope.newTaxIsSaved;
    }, function(val) {
      if (val) {
        // $ctrl.taxList.push(val);
        $rootScope.newTaxIsSaved = null;

        $ctrl.updateEntityTaxList && $ctrl.updateEntityTaxList(val)
        $ctrl.selectedTaxes[val.id] = val;
      }
    })

    //  add taxes to the list from entity
    //  it's needed to make it possible to manage related taxes even when original is deleted
    // $ctrl.taxes = $ctrl.taxes.staticCopy();
    function generateTaxList() {
      $ctrl.taxList = angular.copy($ctrl.taxes);
      for (var i = 0; i < $ctrl.entity.taxes.length; i++) {
        var entityTax = $ctrl.entity.taxes[i];
        var sameOriginalTax = $ctrl.taxList.find(function (tax) {
          return tax.name === entityTax.name && tax.rate === entityTax.rate ;
        });

        if (sameOriginalTax) {
          sameOriginalTax.id = entityTax.id;
        } else {
          $ctrl.taxList.push(entityTax);
        }
      }
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
      var value = $ctrl.entity.taxes.map(function (tax) {
          return tax.name + ' ' + tax.rate + '%';
        }).join(', ') || ($ctrl.activePlaceholder ? "" : 'No taxes');

      if (value) {
        $rootScope.taxPlaceholderIsUp = true;
      }

      return value;
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
