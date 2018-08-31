'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('TagsService', ['$http', 'RealTimeService', 'Utils', function ($http, RealTimeService, Utils) {

    var tagsColors = [];

    $http.get('/data/getColors').then(function (resp) {
      for (var i = 0; i < resp.data.length; i++) {
        var color = resp.data[i];
        tagsColors.push(color);
      }
    });

    function getColors() {
      return tagsColors;
    }

    function search(keyword, callback) {

      if (!keyword) {
        $http.get('/tags/getAll').then(function (response) {

          if (callback) {
            callback(response.data);
          }

          return response.data;
        });
      }

      $http.get('/tags/search?word=' + (keyword ? keyword.toLowerCase() : '')).then(function (response) {

        if (callback) {
          callback(response.data);
        }

        return response.data;
      });
    }

    function setTagsInTicket(ticketTags, ticketId, callback) {

      if (!ticketTags || !Array.isArray(ticketTags)) {
        throw 'ticketTags is required and must be array!';
      }

      if (!ticketId) {
        throw 'ticketId is required!';
      }

      var future = $http({
        url: '/tags?ticketId=' + ticketId,
        method: 'PUT',
        data: ticketTags
      });

      Utils.handleCallback(future, callback);
    }

    function getAll(scope, callback) {
      var tags = [];

      if (!scope || !scope.$id) {
        throw 'First argument must be AngularJS scope!';
      }

      $http.get('/tags/getAll').then(function (response) {

        if (callback) {
          tags = angular.copy(response.data);
          callback(tags);
        } else {
          for (var i = 0, len = response.data.length; i < len; i++) {
            var tag = response.data[i];
            tags.push(tag);
          }
        }

        RealTimeService.subscribe('/tagManagement', scope, function (newChange) {

          if (newChange.action === 'TAG_SAVED') {
            var tagForUpdate = Utils.findById(tags, newChange.data.id);

            if (tagForUpdate) {
              Utils.customizeObj(newChange.data, tagForUpdate);

              if (callback) {
                callback(tags);
              }
            } else {
              tags.push(newChange.data);
              if (callback) {
                callback(tags);
              }
            }
          } else if (newChange.action === 'TAG_REMOVED') {
            Utils.deleteById(tags, newChange.data);

            if (callback) {
              callback(tags);
            }
          }
        });

      });

      return tags;
    }

    function changeColor(tagId, colorCode, callback) {
      if (!tagId) {
        throw 'Tag id required!';
      }

      if (!colorCode) {
        throw 'Color code is required';
      }

      if (colorCode <= 0 || colorCode >= 9) {
        throw 'Color code should be less then 10 and greater or equal then 0';
      }

      var future = $http.put('/tags/changeColorForTag?tagId=' + tagId + '&colorCode=' + colorCode, {});

      Utils.handleCallback(future, callback);
    }

    function changeWord(tagId, word, callback) {
      if (!tagId) {
        throw 'Tag id required!';
      }

      if (!word) {
        throw 'Word is required!';
      }

      var future = $http.put('/tags/setWordForTag?tagId=' + tagId + '&word=' + word, {});

      Utils.handleCallback(future, callback);
    }

    function remove(tagId, callback) {
      if (!tagId) {
        throw 'Tag id required!';
      }

      var future = $http.delete('/tags/removeTag?tagId=' + tagId);

      Utils.handleCallback(future, callback);
    }

    function removeAndReplace(tagIdForDelete, tagIdForReplace, callback) {
      if (!tagIdForDelete) {
        throw 'Tag id for delete required!';
      }

      if (!tagIdForReplace) {
        throw 'Tag id for replace required!';
      }

      var future = $http.delete('/tags/removeAndReplaceTag?toDeleteId=' + tagIdForDelete + '&replaceToId=' + tagIdForReplace);

      Utils.handleCallback(future, callback);
    }

    function save(newTag, callback) {
      if (!newTag) {
        throw 'Tag object is required!';
      }

      if (!newTag.word) {
        throw 'Tag word is required!';
      }

      var future = $http.post('/tags', newTag);

      Utils.handleCallback(future, callback);
    }

    return {
      search: search,
      setTagsInTicket: setTagsInTicket,
      getAll: getAll,
      changeColor: changeColor,
      changeWord: changeWord,
      remove: remove,
      removeAndReplace: removeAndReplace,
      save: save,
      getColors: getColors
    }

  }]);
})(window, jQuery);
