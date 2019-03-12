'use strict';

(function (window, $) {

  var draftNumberPrefix = 'Ibx#';

  var services = angular.module('main.services');

  services.factory('DraftsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {

      var storage = {
          sources: [],
          drafts: [],
          lastDraftParams: {}
        },
        scope = $rootScope.$new();

      RealTimeService.subscribe('/drafts', scope, function (newChange) {
        var source, draft;

        if (newChange.action === 'DRAFT_CREATED') {

          draft = newChange.data;
          for (var i = 0; i < storage.sources.length; i++) {
            source = storage.sources[i];
            if (source.source === draft.source) {
              source.amount++;
              if (source.drafts && source.drafts.length) {
                draft.number = draftNumberPrefix + draft.number;
                return source.drafts.unshift(draft);
              }
            }
          }
          storage.sources.push({ source: draft.source, amount: 1 });

        } else if (newChange.action === 'DRAFT_DELETED') {

          var draftId = newChange.data.id;
          draft = Utils.findById(storage.drafts, draftId);
          Utils.deleteById(storage.drafts, draftId);

          for (var j = 0; j < storage.sources.length; j++) {
            source = storage.sources[j];

            if (source.source === draft.source) {
              if (source.amount > 1) {
                source.amount--;
              } else {
                storage.sources.splice(j, 1);
                j--;
              }
              break;
            }
          }
        }
      });

      function fetchDrafts(openedSource, callback) {
        if (openedSource) {
          storage.drafts = [];
          storage.lastDraftParams.source = openedSource;
          loadMoreDrafts(openedSource, callback);
        }
      }

      function loadMoreDrafts(source, callback) {
        storage.lastDraftParams.offset = storage.drafts.length;

        $http.post('/drafts', storage.lastDraftParams, { params: { source: source } }).then(function (resp) {

          if (resp && resp.config.params.source === storage.lastDraftParams.source) {

            for (var i = 0; i < resp.data.length; i++) {
              var draft = resp.data[i];
              draft.number = draftNumberPrefix + draft.number;

              var existedDraft = Utils.findById(storage.drafts, draft.id);

              if (existedDraft) {
                Utils.customizeObj(draft, existedDraft);
              } else {
                storage.drafts.push(Utils.customizeObj(draft));
              }

            }

            if (callback) {
              callback(storage.drafts);
            }
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });
      }

      function getSources(callback) {
        $http.get('/drafts').then(function (resp) {
          storage.sources = resp.data;

          if (callback) {
            callback(resp.data);
          }
        });
      }

      function getFullDraft(draftId, callback) {
        $http.get('/drafts/' + draftId).then(function (resp) {
          var draft = resp.data;
          draft.number = draftNumberPrefix + draft.number;
          if (callback) {
            callback(draft);
          }
        });
      }

      function deleteForever(ids, callback) {
        var future = $http.post('/drafts/delete', { draftIds: ids });
        Utils.handleCallback(future, callback);
      }

      return {
        getDrafts: fetchDrafts,
        loadMoreDrafts: loadMoreDrafts,
        getSources: getSources,
        getFullDraft: getFullDraft,
        deleteForever: deleteForever
      }

    }

  ]);

})(window, jQuery);
