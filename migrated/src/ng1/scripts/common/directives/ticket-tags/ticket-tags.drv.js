'use strict';

(function () {
  angular.module("quicktech.common.directives").directive("ticketTags",
    ['$document', 'TagsService', 'CompaniesService', '$rootScope',
      function ($document, TagsService, CompaniesService, $rootScope) {
        return {
          restrict: 'E',
          templateUrl: '/ng1/scripts/common/directives/ticket-tags/ticket-tags.tpl.html',
          scope: {
            ticketId: '@',
            readonlyTags: '@?',
            ticketTags: '=',
            tagFilter: '<',
            onSaveFunc: '<',
            isCompany: "<",
            newDesign: '<',
            companyTags: '<',
            companyId: '<'
          },
          link: function ($scope, $element) {
            $scope.currentCompany = CompaniesService.getCurrentCompany();
            $scope.tagColors = TagsService.getColors();

            $scope.allTags = [];



            if (!$scope.readonlyTags) {
              var input = $element.find('input');
              input.on('keydown', function (e) {
                $scope.dropdownOpened = true;
                var word = input.val().trim();
                if (e.keyCode === 13 && word && !input.parent().find('.dropdown-menu-child-focused').length) {
                  $scope.addTag(word);
                  input.val('');
                }
                $scope.$apply();
              });






              if ($scope.isCompany) {
                TagsService.getAllCompanies($scope, function(resp) {
                  $scope.result = resp.data;
                  $scope.allTags = resp.data;
                  $scope.lastResult = resp.data;
                });

                $scope.$watch(function() {
                  return $rootScope.tagForCompanyCreated;
                }, function(val) {
                  if (val) {

                    TagsService.getAllCompanies($scope, function(resp) {
                      $scope.result = resp.data;
                      $scope.allTags = resp.data;
                      $scope.lastResult = resp.data;
                    });
                  }
                });

                $scope.$watch(function() {
                  return $rootScope.createdCompanyTag;
                }, function(val) {
                  if (val === 'string') {
                    $scope.allTags = $scope.allTags.filter(function(el) {
                      return el.id !== val;
                    });

                    $scope.result = $scope.result.filter(function(el) {
                      return el.id !== val;
                    });
                  }
                });

                // var tags = ['first', 'second', 'third', 'fourth'];

                // for (var i = 0; i < tags.length; i++) {
                //   TagsService.saveForCompany({ word: tags[i] }, function(res) {
                //     console.log(res);
                //   })
                // }
              } else {
                TagsService.getAll($scope, function (resp) {
                  $scope.result = resp;
                  $scope.allTags = resp;
                  $scope.lastResult = resp;
                });

                $scope.$watch(function() {
                  return $rootScope.newTagHasCreated;
                }, function(val) {
                  if (val) {
                    $rootScope.newTagHasCreated = false;
                    TagsService.getAll($scope, function (resp) {
                      $scope.result = resp;
                      $scope.allTags = resp;
                    });
                  }
                })
              }









              var menu = $element.find('.dropdown-menu');

              // menu.on('scroll', scrollHandler)


              function scrollHandler(e) {
                // if (!$scope.loadingOrRendering) {
                  var scrollTop = $(e.target).scrollTop(),
                    isNeedToLoadMoreTickets = scrollTop + menu[0].clientHeight >= menu[0].scrollHeight - 100;

                  if (isNeedToLoadMoreTickets) {
                    $rootScope.shouldDownloadNewTags = true;
                  }

                  // console.log(scrollTop, isNeedToLoadMoreTickets, menu[0], menu[0].scrollHeight, 'truee')

                  // if (isNeedToLoadMoreTickets && (!scope.tickets || scope.tickets.length < scope.globalSearch.count)) {
                  //   $scope.loadingOrRendering = true;
                  //   TicketsService.loadMore(lastListType);
                  // }
                // }
              }

              if (!$scope.isCompany) {
                $document.on('click', $scope.saveTags);
                $scope.$on('$destroy', function () {
                  $document.off('click', $scope.saveTags);
                });
              }

            }
          },
          controller: function ($scope) {

            if (!$scope.readonlyTags) {
              var lastQuery = '',
                tagsChanged = false,
                areNewTagsDownloading;
              $scope.$watch('newTag', searchTag);
              $scope.addTag = function (value) {
                if (typeof value === 'string') {
                  if (!$scope.currentCompany.allowCreateTags && !$rootScope.currentUser.isOwner && !$scope.tagFilter) {
                    return;
                  }
                  if ($scope.tagFilter) {
                    var tags = $scope.allTags;
                    var tag = $scope.allTags.find(function(el) {
                      return el.word.toLowerCase() === value.toLowerCase();
                    });
                    if (tag) {
                      if (!checkTagPresence(tag)) {
                        $scope.ticketTags.push(tag);
                      }
                      $scope.dropdownOpened = false;
                    }
                  } else {

                    if ($scope.isCompany) {
                      var createdTag = $scope.result.find(function(tag) {
                        return tag.word === value;
                      });

                      if (createdTag) {
                        if (!checkTagPresence(createdTag)) {
                          $scope.ticketTags.push(createdTag);
                        }
                        if ($scope.companyId) {
                          updateCompanyTags(false, createdTag);
                        }

                      } else {
                        var tagToCreate = {
                          word: value
                        };
                        if ($scope.companyId) {
                          updateCompanyTags(false, tagToCreate);
                        } else {
                          TagsService.saveForCompany(tagToCreate, function(res) {
                            tagToCreate.id = res.data.id;
                            $scope.ticketTags.push(tagToCreate);
                          })
                        }

                      }
                    } else {


                      $scope.ticketTags.push({
                        word: value,
                        colorCode: 0
                      });


                    }




                  }
                } else {
                  if (!checkTagPresence(value)) {
                    $scope.ticketTags.push(value);
                  }
                  if ($scope.companyId) {
                    updateCompanyTags(false);
                  }
                  $scope.dropdownOpened = false;
                }
                tagsChanged = true;
                $scope.newTag = '';
                lastQuery = '';
              };

              function checkTagPresence(tag) {
                return $scope.ticketTags.findIndex(function(el) {
                  return el.id === tag.id;
                }) !== -1;
              }


              $scope.removeTag = function (index) {
                $scope.ticketTags.splice(index, 1);
                tagsChanged = true;
                if ($scope.companyId) {
                  updateCompanyTags(true, $scope.ticketTags);
                }
              };

              // $scope.$watch(function() {
              //   return $rootScope.shouldDownloadNewTags;
              // }, function(val) {
              //   if (val && !areNewTagsDownloading) {
              //     $rootScope.shouldDownloadNewTags = false;
              //
              //     searchTag(lastQuery, true, $scope.result.length);
              //   }
              // })

              $scope.saveTags = function () {
                if (tagsChanged && !$scope.tagFilter) {
                  $scope.saving = true;
                  $scope.dropdownOpened = false;
                  TagsService.setTagsInTicket($scope.ticketTags, $scope.ticketId, function () {
                    $scope.savedTicketTags = angular.copy($scope.ticketTags);
                    $scope.saving = false;
                    tagsChanged = false;
                    var searchQuery = lastQuery;
                    lastQuery = undefined;
                    searchTag(searchQuery);
                  });
                } else if (tagsChanged && $scope.tagFilter) {
                  // $scope.onSaveFunc($scope.ticketTags)
                }
              };
              $scope.setFocus = function (event) {
                $scope.focusInput = !$scope.focusInput;
                $scope.dropdownOpened = true;
                event.stopPropagation();
              };
              $scope.setDropdownOpened = function (open) {

                // console.log('DSADADASDAS')
                if (!open) {
                  $scope.dropdownOpened = false;
                }
              };
            }

            function searchTag(query) {
              $scope.result = $scope.allTags.filter(function(tag) {
                return tag.word.indexOf(query) !== -1;
              });
            }

            function updateCompanyTags(remove, tagsToUpdate) {
              if (!remove) {
                tagsToUpdate && $scope.ticketTags.push(tagsToUpdate);
              }
              TagsService.setTagsInCompany($scope.ticketTags, $scope.companyId, function() {
                $scope.$broadcast();
              })
            }

            // function searchTag(query, forceLoad, offset) {
            //   // console.log(query, "QUEYR")
            //   if (forceLoad || (query !== undefined && (lastQuery !== query || (query === '' && lastQuery === '')))) {
            //     areNewTagsDownloading = true;
            //
            //     if (offset) {
            //       query += '&offset=' + offset;
            //     }
            //
            //     TagsService.search(query, function (resp) {
            //
            //       if (offset) {
            //         resp.forEach(function(el) {
            //           $scope.result.push(el);
            //         });
            //       } else {
            //         $scope.result = resp;
            //       }
            //
            //       $scope.lastResult = resp;
            //       lastQuery = query;
            //       areNewTagsDownloading = false;
            //
            //       console.log($scope.result, 'result')
            //     });
            //   }
            // }
          }
        }
      }]);
})();
