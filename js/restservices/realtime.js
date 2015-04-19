'use strict';

/* Services */

(function (window, $, undefined) {

    var services = angular.module('main.services');

    services.factory('RealTimeService', ['$http', '$timeout', '$window', function ($http, $timeout, $window) {

        var watcherId,
            defeeredSubscribers = [],
            subscribingInProcess = 0,
            subscribers = {};

        init();

        function init() {
            $http.post("realTime/createWatcher").success(function (resp) {

                watcherId = resp.id;

                if (defeeredSubscribers.length > 0) {

                    for (var i = 0; i < defeeredSubscribers.length; i++) {
                        var item = defeeredSubscribers[i];
                        factory.subscribe(item.url, item.scope, item.callback);
                    }

                    defeeredSubscribers = [];
                }

                watch();
            }).error(function (data, status, headers, config) {
                console.error("Cannot receive watcher Id !!!", data, status, headers, config);
                throw "Cannot initialize RealTimeService";
            });
        }

        function reinitialize() {
            watcherId = undefined;

            //TODO: This "for" relies on response from backend. ToDo: make enum through list, not the fields
            for (var subscriberId in subscribers) {

                var subscriberData = subscribers[subscriberId];

                if (subscriberData && !subscriberData.scope.$$destroyed) {
                    defeeredSubscribers.push(subscriberData);
                }
            }

            subscribers = {};

            init();
        }

        function watch() {

            if (subscribingInProcess > 0) {
                $timeout(watch, 300);
                return;
            }

            $http.post("realTime/watch/" + watcherId, Object.keys(subscribers)).then(function (response) {

                console.log(response.data);

                if (response.data == 'timeout' || response.data == 'destroyed' || response.status == 205) {
                    reinitialize();
                    return;
                }

                //TODO: This "for" relies on response from backend. ToDo: make enum through list, not the fields
                for (var subscriberId in response.data) {

                    var subscriberData = subscribers[subscriberId];

                    if (subscriberData && !subscriberData.scope.$$destroyed) {

                        var changes = response.data[subscriberId];

                        if (changes) {
                            for (var i = 0; i < changes.length; i++) {
                                subscriberData.callback(changes[i]);
                            }
                        }
                    }
                }

                watch();

            }, function (response) {

                if (!response || response.status === 0) {
//                $window.location.reload();
                    console.log("ERRRORRR?????", response);
                    $timeout(reinitialize, 1000);
                } else if (response.status == 205) {
                    reinitialize();
                } else {
                    console.log("ERRRORRR!!!!!!!!!!!!", response);
                    $timeout(watch, 300);
                }
            });
        }

        var factory = {
            subscribe: function (url, scope, callback) {

                if (watcherId) {

                    subscribingInProcess++;

                    $http.get("realTime/subscribe/" + watcherId + url).success(function (resp) {

                        subscribingInProcess--;

                        subscribers[resp.id] = {
                            url: url,
                            scope: scope,
                            callback: callback
                        };

                        scope.$on('$destroy', function () {
                            delete subscribers[resp.id];
                        });

                    }).error(function (data, status, headers, config) {

                        subscribingInProcess--;

                        if (status == 205) {

                            defeeredSubscribers.push({
                                url: url,
                                scope: scope,
                                callback: callback
                            });

                            reinitialize();
                        }

                        console.error("Cannot subscribe on " + url, data, status, headers, config);
                    });

                } else {
                    defeeredSubscribers.push({
                        url: url,
                        scope: scope,
                        callback: callback
                    });
                }
            }
        };

        return factory;

    }]);

})(window, jQuery);