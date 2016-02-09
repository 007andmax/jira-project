'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.RemoteAccessService',
    ['ConstantsService', 'DevicesService', '$http',
      function (ConstantsService, DevicesService, $http) {

        function connectRemoteAccess(sessionId, conectionType, isOneTime) {

          if (!sessionId) {
            throw 'SessionId is required';
          }

          if (!conectionType) {
            throw 'conectionType is required';
          }

          if (isOneTime) {

            DevicesService.getSessionId(sessionId, conectionType, function (realSessionId) {
              if (!realSessionId || !realSessionId.sessionId || realSessionId.sessionId.length < 1) {
                throw "Not session Id"
              } else {
                createRemoteAccess(realSessionId.sessionId);
              }
            });

          } else {
            createRemoteAccess(sessionId);
          }

          function createRemoteAccess(realSessionId) {

            var url;

            var remoteConnectPort = ConstantsService.getConstant('remote.connect.port');
            var restServerAddress = ConstantsService.getConstant('rest.server.address');

            url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + realSessionId;

            function viewerNotOpen() {
              if (confirm("Cannot share screen, probably you have not installed viewer. Would you like to download it?")) {
                window.location.href = '/data/connection-viewer';
              }
            }

            window.isFocused = true;

            $(window).on('focus', function () {
              window.isFocused = true;
            });

            $(window).on('blur', function () {
              window.isFocused = false;
            });

            var checkFunc = null;

            if (navigator.userAgent.indexOf('Firefox') >= 0) {
              checkFunc = checkFirefox;
            } else if (navigator.userAgent.indexOf('Opera') >= 0) {
              checkFunc = checkOpera;
            } else if (navigator.userAgent.indexOf('Chrome') >= 0) {
              checkFunc = checkChrome;
            } else if (navigator.userAgent.indexOf('Safari') >= 0) {
              checkFunc = checkSafari;
            } else {
              checkFunc = checkSafari;
            }

            function checkFirefox(url) {

              var f = document.createElement('iframe');
              f.style.display = 'none';
              f = document.body.appendChild(f);

              try {
                f.contentWindow.location = url;
              } catch (e) {
                viewerNotOpen();
              }

              document.body.removeChild(f);
            }

            function checkSafari(url) {

              if (navigator.userAgent.indexOf('Windows') >= 0) {

                var w = window.open(url, '', 'width=50, height=50');
                setTimeout(function () {
                  try {

                    if (w.location != 'about:blank') {
                    }
                    w.close();
                    window.focus();
                  }
                  catch (e) {
                    w.close();
                    window.focus();
                    viewerNotOpen();
                  }
                }, 10000);

              } else {

                document.location = url;

                setTimeout(function () {
                  if (window.isFocused) {
                    viewerNotOpen();
                  }
                }, 10000);
              }
            }

            function checkOpera(url) {

              var f = document.createElement('iframe');
              f.style.display = 'none';
              f = document.body.appendChild(f);
              f.contentWindow.location = url;

              setTimeout(function () {
                try {
                  if (f.contentWindow.location != 'something') {
                  }
                }
                catch (e) {
                  viewerNotOpen();
                }
                document.body.removeChild(f);
              }, 0);
            }

            function checkChrome(url) {

              setTimeout(function () {
                if (window.isFocused) {
                  viewerNotOpen();
                }
              }, 3000);

              var a = document.createElement("a");
              a.setAttribute("href", url);
              a.style.display = "none";
              a.onerror = getProtocol;
              a.click();

              function getProtocol() {
                viewerNotOpen();
              }

            }

            checkFunc(url);
          }

        }

        return {
          connectRemoteAccess: connectRemoteAccess
        }

      }]);

})(window, jQuery);


