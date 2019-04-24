'use strict';


/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('RealTimeService', ['$timeout', '$rootScope', function ($timeout, $rootScope) {

    var stompClient,
      isInitialized,
      stompEndpoint = "/realtime",
      subscriptionConfigs = {},
      globalSubscriptionId = guid(),
      reconnectDelay = 5000;

    subscriptionConfigs[globalSubscriptionId] = {
      url: '/global',
      scope: $rootScope,
      callback: globalNotify,
      id: globalSubscriptionId
    };

    init();

    function init() {

      stompClient = Stomp.over(new SockJS(stompEndpoint));

      stompClient.connect({}, function (frame) {
        isInitialized = true;

        for (var id in subscriptionConfigs) {
          var config = subscriptionConfigs[id];

          if (!config.scope.$$destroyed) {
            subscribeConfig(config);
          }
        }

        //return frame.headers['user-name'];
      }, function (error) {

        if (stompClient) {
          stompClient.disconnect();
        }

        if (isInitialized) {
          console.log("Lost connection!! Trying to reconnect", error);
          init();

        } else {
          console.error("Cannot establish web socket connection", error);
          setTimeout(init, reconnectDelay);
        }

        isInitialized = false;
        console.log('erease stompClient')
        stompClient = undefined;
      });
    }

    function subscribeConfig(config) {

      if (!isInitialized) {
        return;
      }

      if (stompClient) {
        var subscription = stompClient.subscribe(
          "/user/watch" + config.url,
          function (message) {
            var newChange = JSON.parse(message.body);
            // commit console.log before prod update
            console.log(newChange);
            config.callback(newChange);
            config.scope.$apply();
          });

        config.scope.$on('$destroy', function (info) {
          if (info.targetScope && info.targetScope.$id === config.scope.$id) {
            subscription.unsubscribe();
            delete subscriptionConfigs[config.id];
          }
        });
      }

    }

    //global notification should be broadcasted to all subscribers
    function globalNotify(newChange) {

      for (var id in subscriptionConfigs) {

        var config = subscriptionConfigs[id];

        if (!config.scope.$$destroyed && config.callback !== globalNotify) {
          config.callback(newChange);
        }
      }
    }

    function addSubscription(url, scope, callback) {
      var subscriberId = guid();

      return subscriptionConfigs[subscriberId] = {
        url: url,
        scope: scope,
        callback: callback,
        id: subscriberId
      };
    }

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    return {
      subscribe: function (url, scope, callback) {
        subscribeConfig(
          addSubscription(url, scope, callback)
        );
      }
    }

  }]);

})(window, jQuery);
