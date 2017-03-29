'use strict';

(function () {

  angular.module("quicktech.common.directives").component('selectDiscount', {
    templateUrl: '/html/scripts/common/directives/select-discount/select-discount.tpl.html',
    bindings: {
      discount: '=',
      entity: '=',
      entityType: '@?',
      onClose: '=?'
    },
    controller: selectDiscountCtrl
  });

  function selectDiscountCtrl() {
    var $ctrl = this;
    this.showInputField = showInputField;

    $ctrl.isShowInputField = false;
    function showInputField() {
      $ctrl.isShowInputField = !$ctrl.isShowInputField;
    }

  }

})();
