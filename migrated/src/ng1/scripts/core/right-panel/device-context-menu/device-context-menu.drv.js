'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive('deviceContextMenu',
    ['$timeout', '$templateRequest', '$compile', 'DevicesService', 'quicktech.common.services.RemoteAccessService',
      function ($timeout, $templateRequest, $compile, DevicesService, RemoteAccessService) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {

            var getMenuPosition = function (popover, mouse, direction, scrollDir) {
              var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $(popover)[direction](),
                position = mouse;
              // opening menu would pass the side of the page
              if (mouse + menu > win && menu < mouse) {
                position -= menu;
              }
              return position;
            };
            var hideOtherPopovers = function () {
              element.siblings().popover('hide');
              $(document).off('click', hideThisPopover);
            };

            var hideThisPopover = function () {
              element.popover('hide');
              $(document).off('click', hideThisPopover);
            };


            $templateRequest('/ng1/scripts/core/right-panel/device-context-menu/device-context-menu.tpl.html').then(function (html) {
              var template = angular.element(html);

              element.popover({
                trigger: 'manual',
                html: true,
                content: template,
                container: 'body'
              });

              $compile(template)(scope);

              element.bind("contextmenu", function (e) {
                // Return native menu if pressing control
                if (e.ctrlKey) {
                  return;
                }

                // Hide already opened
                hideOtherPopovers();

                var customPopover;
                var offset = { left: 0, top: 0 };
                // if( typeof(settings.relativeTo) != 'undefined' ) {
                //     offset = $(settings.relativeTo).offset();
                // }

                element.one('inserted.bs.popover', function () {
                  customPopover = $('#' + element.attr('aria-describedby'));
                  customPopover.find('.popover-content').css('padding', 0);
                  customPopover.css({
                    'padding': 0,
                    'margin': 0,
                    // 'margin-top': attrs.customPopoverMenuMarginTop,
                    'width': 190,
                    'visibility': 'hidden'
                  });
                  customPopover.on('click', function (e) {
                    e.stopPropagation();
                  })
                });

                element.one('shown.bs.popover', function () {
                  var left = getMenuPosition(customPopover, (e.clientX - offset.left), 'width', 'scrollLeft');
                  var top = getMenuPosition(customPopover, (e.clientY - offset.top), 'height', 'scrollTop');
                  customPopover.css({
                    visibility: 'visible',
                    position: "fixed",
                    left: left,
                    top: top
                  });
                });

                element.popover('show');

                $(document).on('click', hideThisPopover);

                return false;
              });

            });

            scope.remoteAccess = function (connectionType) {
              var deviceId = scope.agent.id,
                companyId = scope.companyGroupedData.company.id;

              hideThisPopover();
              DevicesService.createRemoteSession(deviceId, companyId, connectionType, function (resp) {
                RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
              });
            };

            scope.restart = function () {
              DevicesService.sendPowerAction(scope.companyGroupedData.company.id, scope.agent.agentId, 'reboot');
              hideThisPopover();
            };

            scope.shutdown = function () {
              DevicesService.sendPowerAction(scope.companyGroupedData.company.id, scope.agent.agentId, 'shutdown');
              hideThisPopover();
            };

            scope.remove = function () {
              DevicesService.sendUninstallAgentRequest(scope.companyGroupedData.company.id, scope.agent.id);
              hideThisPopover();
            }

          }
        }
      }]);
})();
