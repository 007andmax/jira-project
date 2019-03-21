'use strict';

(function () {
  angular.module("quicktech.common.directives").directive('editAvatar', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'A',
      templateUrl: '/ng1/scripts/common/directives/avatar/avatar.tpl.html',
      scope: {
        model: '=',
        modelName: '@',
        isInvoice: '<isInvoice',
        attachFunc: '<attachFunc'
      },
      link: function (scope) {

        var urlGetters = {
          user: $rootScope.getUserAvatarUrl,
          company: $rootScope.getCompanyLogoUrl,
          techCompany: $rootScope.getCompanyLogoUrl
        };

        scope.imagePath = scope.modelName.toLowerCase().indexOf('company') > -1 ? 'logo' : 'avatar';

        scope.getUrl = function () {
          return urlGetters[scope.modelName](scope.model);
        };

      }
    }
  }]);

})();
