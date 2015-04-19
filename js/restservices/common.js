'use strict';

/* Services */

(function (window, $, undefined) {

    var services = angular.module('main.services', []);

     services.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

        $provide.factory('myHttpInterceptor', [function () {

            function processResponse(response) {

                if (response.data.errorMessage === 'unauthorized' || response.data.authMessage === 'unauthorized') {
                    window.location.pathname = '/login';
                } else if (response.data.showMessage) {
                    alert(response.data.showMessage);
                    return {};
                }

                return response;
            }

            return {

                'request': function (config) {

                    if (config.url) {

                        if (!config.params) {
                            config.params = {};
                        }

                        config.params.t = new Date().getTime();
                    }

                    return config;
                },

                'response': processResponse

            };
        }]);

        $httpProvider.interceptors.push('myHttpInterceptor');

    }]);

    services.run(['$http', '$rootScope', function($http, $rootScope) {
        $http.get('/currentUser').success(function(resp){
            $rootScope.currentUser = resp;
        })
    }]);

    services.service('Downloader', function () {

        var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        var isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

        function downloadAttachments(id, model) {
            downloadByUrl('tickets/downloadAllAttachments?id=' + id + '&model=' + model);
        };

        function downloadByUrl(url) {

            //iOS devices do not support downloading. We have to inform user about this.
            if (/(iP)/g.test(navigator.userAgent)) {
                alert('Your device does not support files downloading. Please try again in desktop browser.');
                return false;
            }

            //If in Chrome or Safari - download via virtual link click
            if (isChrome || isSafari || isFirefox) {
                //Creating new link node.
                var link = document.createElement('a');
                link.href = url;

                if (link.download !== undefined) {
                    //Set HTML5 download attribute. This will prevent file from opening if supported.
                    var fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
                    link.download = fileName;
                }

                //Dispatching click event.
                if (document.createEvent) {
                    var e = document.createEvent('MouseEvents');
                    e.initEvent('click', true, true);
                    link.dispatchEvent(e);
                    return true;
                }
            }

            // Force file download (whether supported by server).
//            url += '?download';
//todo fix bug with multiple files download
            window.open(url, '_self');
            return true;

        }

        return {
            downloadByUrl: downloadByUrl,
            downloadAttachments: downloadAttachments
        };
    });

})(window, jQuery);