'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('SubscriptionsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService) {

      function saveUserSubscription(userSubscription, callback) {
        if (!userSubscription) {
          throw 'userSubscription is required argument!';
        }

        var url = '/subscription',
          method = 'POST';

        if (userSubscription.id) {
          url += '/' + userSubscription.id;
          method = 'PUT';
        }

        var future = $http({
          url: url,
          method: method,
          data: userSubscription
        });

        Utils.handleCallback(future, callback);

      }

      function changeSubscriptionsForUsers(userIds, type, toSubscribe, callback) {

        var future = $http({
          url: '/subscription/changeSubscriptionsForUsers?type=' + type + '&toSubscribe=' + !!toSubscribe,
          method: 'POST',
          data: userIds
        });

        Utils.handleCallback(future, callback);
      }

      function deleteUserSubscription(userSubscriptionId, callback) {

        if (!userSubscriptionId) throw 'userSubscriptionId is required argument!';

        var future = $http({
          url: '/subscription/' + userSubscriptionId,
          method: 'DELETE'
        });

        Utils.handleCallback(future, callback);
      }

      function getUserSubscriptionsByCompanyId(companyId, scope, callback) {

        if (!companyId) throw 'companyId is required argument!';

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        return getRealTimeUserSubscriptions({
          url: '/subscription/company/users/' + companyId,
          method: 'GET'
        }, companyId, scope, callback);
      }

      function getAllClientUserSubscriptions(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        return getRealTimeUserSubscriptions({
          url: '/subscription/clientUsers',
          method: 'GET'
        }, CompaniesService.getCurrentCompany().id, scope, callback);
      }

      function getUserSubscriptionsByUserIds(userIds, scope, callback) {

        if (!userIds || userIds.length == 0) throw 'userIds is required argument!';

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        if (!Array.isArray(userIds)) userIds = [userIds];

        return getRealTimeUserSubscriptions({
          url: '/subscription/users/',
          method: 'POST',
          data: userIds
        }, CompaniesService.getCurrentCompany().id, scope, callback, userIds);
      }

      function getRealTimeUserSubscriptions(config, companyId, scope, callback, userIds) {

        var userSubscriptions = Utils.customizeObj({});

        $http(config).then(function (resp) {

          for (var i = 0; i < resp.data.length; i++) {
            var subscription = resp.data[i];
            Utils.defineReadOnlyProperty(userSubscriptions, subscription.user.id, Utils.customizeObj(subscription));
          }

          RealTimeService.subscribe('/subscription/' + companyId, scope, function (newChange) {

            if (newChange.action == 'SUBSCRIPTION_SAVED') {
              if (!newChange.data.user) {
                return;
              }

              if (!userIds || userIds.indexOf(newChange.data.user.id) > -1) {
                Utils.defineReadOnlyProperty(userSubscriptions, newChange.data.user.id, Utils.customizeObj(newChange.data));
              }
            } else if (newChange.action == 'SUBSCRIPTION_DELETED') {
              delete userSubscriptions[newChange.data.user.id];
            }
          });

          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        return userSubscriptions;
      }

      return {
        saveUserSubscription: saveUserSubscription,
        changeSubscriptionsForUsers: changeSubscriptionsForUsers,
        deleteUserSubscription: deleteUserSubscription,
        getUserSubscriptionsByCompanyId: getUserSubscriptionsByCompanyId,
        getAllClientUserSubscriptions: getAllClientUserSubscriptions,
        getUserSubscriptionsByUserIds: getUserSubscriptionsByUserIds

      }
    }]);

})(window, jQuery);
