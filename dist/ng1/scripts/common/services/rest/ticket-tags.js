//'use strict';
//
///* Services */
//
//(function (window, $, undefined) {
//
//  var services = angular.module('main.services');
//
//  services.factory('TicketTagsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {
//
//    var serviceScope;
//
//    var storage = {
//      tags: undefined,
//      watchers: [],
//      dynamicLists: {},
//      addWatcher: function (scope) {
//
//        var watchers = this.watchers;
//
//        if (watchers.indexOf(scope.$id) < 0) {
//
//          watchers.push(scope.$id);
//
//          scope.$on('$destroy', function () {
//            var index = watchers.indexOf(scope.$id);
//            watchers.splice(index, 1);
//            checkAndFinish();
//          });
//        }
//      },
//      addDynamicList: function (tags, scope) {
//
//        var lists = this.dynamicLists;
//
//        if (!lists[scope.$id]) {
//          lists[scope.$id] = [];
//        }
//
//        lists[scope.$id].push(tags);
//
//        scope.$on('$destroy', function () {
//          delete lists[scope.$id];
//          checkAndFinish();
//        });
//
//      }
//    };
//
//    function sortTagList(a, b) {
//      return b.createdAt - a.createdAt;
//    }
//
//    function init(callback) {
//      serviceScope = $rootScope.$new();
//
//      storage.tags = Utils.customizeArray([]);
//
//      $http.get('/tag').then(function (resp) {
//
//        Utils.customizeArray(resp.data, storage.tags);
//        if (!storage.tags) {
//          return;
//        }
//        storage.tags.sort(sortTagList);
//
//        RealTimeService.subscribe('/tags', serviceScope, function (newChange) {
//
//          console.log(newChange);
//
//          if (!storage.tags) return;
//
//          if (newChange.action == 'TAG_SAVED') {
//
//            var tag = Utils.findById(storage.tags, newChange.data.id);
//
//            if (tag) {
//              Utils.customizeObj(newChange.data, tag);
//            } else {
//              storage.tags.unshift(Utils.customizeObj(newChange.data))
//              storage.tags.sort(sortTagList);
//            }
//          } else if (newChange.action == 'TAG_REMOVED') {
//
//            Utils.deleteById(storage.tags, newChange.data.id);
//
//            for (var listId in storage.dynamicLists) {
//              var dynamicLists = storage.dynamicLists[listId];
//
//              for (var dl = 0; dl < dynamicLists.length; dl++) {
//                Utils.deleteById(dynamicLists[dl], newChange.data.id);
//              }
//            }
//          }
//        });
//
//        if (callback) {
//          callback(resp.data);
//        }
//
//      }, function (resp) {
//
//        console.log("ERROR!!!!!", resp);
//
//        if (callback) {
//          callback(resp.data);
//        }
//      });
//    }
//
//    function checkAndFinish() {
//      if (storage.watchers.length === 0 && $.isEmptyObject(storage.dynamicLists)) {
//        serviceScope.$destroy();
//        storage.tags = undefined;
//      }
//    }
//
//    function makeDynamic(tags, scope) {
//
//      if (!scope || !scope.$id) {
//        throw 'First argument must be Angularjs scope!'
//      }
//
//      if (!storage.tags) {
//        init(function () {
//          makeDynamic(tags, scope);
//        });
//      } else {
//
//        for (var i = 0; i < tags.length; i++) {
//          tags[i] = Utils.findById(storage.tags, tags[i].id);
//        }
//
//        //      clear undefined, can happen when tag was deleted while ticket uploading
//        var index;
//        while ((index = tags.indexOf(undefined)) > -1) {
//          tags.splice(index, 1);
//        }
//
//        storage.addDynamicList(tags, scope);
//      }
//    }
//
//    function merge(tags, newIds) {
//
//      tags.splice(0, tags.length);
//
//      for (var i = 0; i < newIds.length; i++) {
//        var tag = Utils.findById(storage.tags, newIds[i]);
//
//        if (tag) tags.push(tag);
//      }
//    }
//
//    function getList(scope, callback) {
//
//      if (!scope || !scope.$id) {
//        throw 'First argument must be Angularjs scope!'
//      }
//
//      if (!storage.tags) {
//        init(callback);
//      } else if (callback) {
//        setTimeout(function () {
//          callback(storage.tags.staticCopy())
//        }, 100);
//      }
//
//      storage.addWatcher(scope);
//
//      return storage.tags;
//    }
//
//    function save(ticketTag, callback) {
//      if (!ticketTag) throw 'ticketTag is required argument!';
//
//      var url = '/tag',
//        method = 'POST';
//
//      if (ticketTag.id) {
//        url += '/' + ticketTag.id;
//        method = 'PUT';
//      }
//
//      var future = $http({
//        url: url,
//        method: method,
//        data: ticketTag
//      });
//
//      Utils.handleCallback(future, callback);
//
//    }
//
//    function deleteTag(tagId, callback) {
//
//      if (!tagId) throw 'tagId is required argument!';
//
//      var future = $http({
//        url: '/tag/' + tagId,
//        method: 'DELETE'
//      });
//
//      Utils.handleCallback(future, callback);
//    }
//
//    function link(linkMap, callback) {
//
//      if (!linkMap) throw 'linkMap is required argument!';
//
//      var future = $http({
//        url: '/tag/link',
//        method: 'POST',
//        data: linkMap
//      });
//
//      Utils.handleCallback(future, callback);
//    }
//
//    function getTicketsCounts(scope, callback) {
//
//      if (!scope || !scope.$id) {
//        throw 'First argument must be Angularjs scope!'
//      }
//
//      var counts = Utils.customizeObj({});
//
//      $http.get('/tag/counts').then(function (resp) {
//        Utils.customizeObj(resp.data, counts);
//
//        if (callback) {
//          callback(resp.data);
//        }
//
//      }, function (resp) {
//        if (callback) {
//          callback(resp.data);
//        }
//      });
//
//      RealTimeService.subscribe('/tagCounts', scope, function (newChange) {
//
//        console.log(newChange);
//
//        if (newChange.action == 'TAG_COUNTS') {
//          Utils.customizeObj(newChange.data, counts);
//        }
//      });
//
//      return counts;
//
//    }
//
//    return {
//      _makeDynamic: makeDynamic,
//      _merge: merge,
//      getList: getList,
//      save: save,
//      deleteTag: deleteTag,
//      link: link,
//      getTicketsCounts: getTicketsCounts
//    }
//
//  }]);
//
//})(window, jQuery);
