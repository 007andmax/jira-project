'use strict';

(function () {

  angular.module("quicktech.core.quickSupport").directive('openMailManager',
    ['CompaniesService', '$location', 'ConstantsService',
      function (CompaniesService, $location, ConstantsService) {
        return {
          restrict: 'A',
          scope: {
            openMailManager: '='
          },
          link: function (scope, element) {

            var currentCompany = CompaniesService.getCurrentCompany();
            var host = ConstantsService.getConstant('server.url', function (resp) {
              host = resp;
            });
            var link = host + 'remote?key=' + scope.openMailManager;

            var subject = currentCompany.name + " remote support agent";
            var body = "Follow that link(" + link + ") to download agent";

            element.click(function () {
              window.open("mailto:?subject=" + subject + "&body=" + body, '_parent');
            })

          }
        }
      }]);
})();
