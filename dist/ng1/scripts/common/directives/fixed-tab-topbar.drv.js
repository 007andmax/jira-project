'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('fixedTabTopbar',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var $body = $('body'),
            topbar = element.find('[ftt-topbar-to-be-fixed]'),
            content = element.find('[ftt-tab-content]');

          $(window).scroll(function () {
            var height = $body.scrollTop();

            if (height <= attrs.fixedTabTopbar) {
              topbar.removeClass('tabs-topbar-fixed');
              content.css("margin-Top", "1px");
            } else {
              topbar.addClass('tabs-topbar-fixed');
              content.css("margin-Top", "54px");
            }
          });

        }
      }
    }]);
})();
