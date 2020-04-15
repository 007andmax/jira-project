'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('TagsService', ['$http', 'RealTimeService', 'Utils', '$rootScope', 'CompaniesService', function ($http, RealTimeService, Utils, $rootScope, CompaniesService) {

    var tagsColors = [];

    $http.get('/data/getColors').then(function (resp) {
      for (var i = 0; i < resp.data.length; i++) {
        var color = resp.data[i];
        var colorParsed = color.backgroundColor.split(',');
        colorParsed[3] = ' 0.21)';
        colorParsed = colorParsed.join(',');
        color.color = color.borderColor;
        color.backgroundColor = colorParsed;
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

      ticketTags.forEach(function(el) {
        if (!el.id) {
          $rootScope.newTagHasCreated = true;
        }
      })

      var future = $http({
        url: '/tags?ticketId=' + ticketId,
        method: 'PUT',
        data: ticketTags
      });

      Utils.handleCallback(future, callback);
    }

    function setTagsInCompany(tags, companyId, callback) {
      if (!tags || !Array.isArray(tags)) {
        throw 'tags is required and must be array!';
      }

      if (!companyId) {
        throw 'companyId is required!';
      }

      var future = $http({
        url: '/company/tags?companyId=' + companyId,
        method: 'PUT',
        data: tags
      });

      Utils.handleCallback(future, callback);
    }


    function getAllCompanies(scope, callback) {
      $http.get('/company/tags/getAll')
        .then(function(response) {
          if (callback) {
            callback(response);
          }

          RealTimeService.subscribe('/companyTagManagement', scope, function (newChange) {



            $rootScope.createdCompanyTag = newChange.data;
            //
            // if (newChange.action === 'TAG_SAVED_COMPANY_SCOPE') {
            //
            // } else if (newChange.action === 'TAG_REMOVED_COMPANY_SCOPE') {
            //
            // }
          });

          RealTimeService.subscribe('/companyTags', scope, function (newChange) {
          

            if (newChange.action === "TAG_COMPANY_SAVED") {
              if (newChange.data.tags) {
                $rootScope.createdCompanyTag = newChange.data.tags[0];
              } else {
                $rootScope.createdCompanyTag = newChange.data;
              }
            }


          });


        })
    }

    function filterCompanies(tags, callback) {
      $http.post('/company/clientsByTags', tags.map(function(el) { return el.id }))
        .then(function(res) {
          if (callback) {
            callback(res);
          }
        })
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

      $rootScope.newTagHasCreated = true;

      Utils.handleCallback(future, callback);
    }

    function saveForCompany(newTag, callback) {
      if (!newTag) {
        throw 'Tag object is required!';
      }

      if (!newTag.word) {
        throw 'Tag word is required!';
      }

      $http.post('/company/tags', newTag).then(function(res) {
        if (callback) {
          callback(res);

          $rootScope.tagForCompanyCreated = res.id || res.data.id;
        }
      })
    }

    return {
      search: search,
      setTagsInTicket: setTagsInTicket,
      setTagsInCompany: setTagsInCompany,
      getAll: getAll,
      getAllCompanies: getAllCompanies,
      saveForCompany: saveForCompany,
      removeAndReplace: removeAndReplace,
      save: save,
      getColors: getColors,
      filterCompanies: filterCompanies
    }

  }]);
})(window, jQuery);
