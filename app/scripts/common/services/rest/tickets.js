'use strict';

/* Services */

(function (window, $, undefined) {

  var numberPrefix = 'Tkt# ';

  var services = angular.module('main.services');

  services.factory('TicketsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService) {

      var ticketChangedActions = ['ASSIGNED_USER', 'PRIORITY_CHANGED', 'STATUS', 'TRASH', 'REPORT_AS_SPAM', 'RESTORE_FROM_SPAM', 'TICKET_INVOICED', 'TICKET_SHARE', 'MARKED_AS_SPAM'];

      var idCounter = 0;

      var storage = {
        lists: {},
        tickets: {},
        counts: {}
      };

      function normalizeAndCopyParams(params) {

        params = angular.extend({}, params);

        if (params.keyword) {
          params.keyword = params.keyword.toUpperCase();
        }
        if (params.filter) {
          params.filter = params.filter.toUpperCase();
        }
        if (params.priority) {
          params.priority = params.priority.toUpperCase();
        }
        if (params.status) {
          params.status = params.status.toUpperCase();
        }

        return params;
      }

      function sortTicketUpdateList(a, b) {
        return a.createdAt - b.createdAt;
      }

//  only one list per scope !
      function getList(scope, params, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        if (!params || !params.filter) {
          throw "'filter' is mandatory parameter that must be counted in second argument"
        }

        params = normalizeAndCopyParams(params);

        var list = Utils.customizeObj([]);

        storage.lists[scope.$id] = {
          params: params,
          scope: scope,
          list: list
        };

        loadMore(scope, callback);

        scope.$on('$destroy', function () {
          delete storage.lists[scope.$id];
        });

        return list;

      }

      function loadMore(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        var listData = storage.lists[scope.$id];

        if (!listData) {
          throw 'There is no ticket list for scope ' + scope.$id;
        }

        if (listData.loadingInProcess) {
          console.log('Loading tickets already in process');
          return;
        }

        if (listData.list.length > 0) {
          listData.params.lastId = listData.list[listData.list.length - 1].id;
        } else {
          delete listData.params.lastId;
        }

        listData.loadingInProcess = true;

        $http({
          method: 'GET',
          url: '/v2/tickets',
          params: listData.params
        }).then(function (response) {

          if (response) {

            for (var i = 0; i < response.data.length; i++) {
              var ticket = response.data[i];

              ticket.number = numberPrefix + ticket.number;

              //if (ticket.tags) {
              //    TicketTagsService._makeDynamic(ticket.tags, scope);
              //}

              //if (ticket.company) {
              //    ticket.company = CompaniesService.getOneById(ticket.company.id);
              //}

              var rtTicket = Utils.findById(listData.list, ticket.id);

              if (rtTicket) {
                Utils.customizeObj(ticket, rtTicket);
              } else {
                listData.list.push(Utils.customizeObj(ticket));
              }

            }

            listData.loadingInProcess = false;

            if (callback) {
              callback(response.data);
            }
          }

          listData.loadingInProcess = false;
        }, function (response) {
          listData.loadingInProcess = false;
          if (callback) {
            callback(response.data);
          }
        });
      }

      function search(params, callback) {

        if (!params || !params.filter) {
          throw "'filter' is mandatory parameter that must be counted in first argument"
        }

        if (!params.keyword) {
          throw "'keyword' is mandatory parameter that must be counted in first argument"
        }

        if (params.keyword.length < 3) {
          throw "minimal length of 'keyword' is 3 characters"
        }

        params = normalizeAndCopyParams(params);

        var result = [];

        return $http({
          method: 'GET',
          url: '/v2/tickets/search',
          params: params
        }).then(function (response) {

          for (var i = 0; i < response.data.length; i++) {
            result.push(response.data[i]);
          }

          if (callback) {
            callback(result);
          }

          return result;

        }, function (response) {
          if (callback) {
            callback(response);
          }
        });
      }


      function getOne(id, ticketsType, scope, detailed, callback) {

        if (!id) {
          throw 'Id is mandatory argument!'
        }

        if (!ticketsType) {
          throw 'ticketsType is mandatory argument!'
        }

        if (!scope || !scope.$id) {
          throw 'Third argument must be Angularjs scope!'
        }

        var storageId = idCounter++;
        var ticket = { id: id };
        var ticketsType = ticketsType.toUpperCase() === 'SPAM' ? '' : ticketsType.toUpperCase();
        var url = '/v2/tickets/' + id + '?ticketsType=' + ticketsType;

        if (detailed) {
          url += '&view=extended';
        }

        storage.tickets[storageId] = { ticket: ticket, scope: scope };

        scope.$on('$destroy', function () {
          delete storage.tickets[storageId];
        });

        $http.get(url).then(function (resp) {

          if (resp.data.code === 400) {

            if (callback) {
              callback(resp.data);
            }

            return;
          }

          resp.data.number = numberPrefix + resp.data.number;

          Utils.customizeObj(resp.data, ticket);

          //if (ticket.tags) {
          //    TicketTagsService._makeDynamic(ticket.tags, scope);
          //}

          if (detailed) {
            ticket.updates.sort(sortTicketUpdateList);
          }

          if (callback) {
            callback(resp.data);
          }

        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        if (detailed) {
          RealTimeService.subscribe('/ticketUpdates/' + id, scope, function (newChange) {

            console.log(newChange);

            if (newChange.action == 'UPDATE_SAVED' || newChange.action == 'UPDATE_CREATED') {

              var canSeeUpdate = ticketsType.toUpperCase() !== 'SHARED'
                || newChange.data.user.id === $rootScope.currentUser.id;

              if (!canSeeUpdate) {

                // user can see shared updates
                for (var i = 0; i < newChange.data.shares.length && !canSeeUpdate; i++) {

                  var user = newChange.data.shares[i].user;

                  canSeeUpdate = user && user.id === $rootScope.currentUser.id;
                }
              }

              if (canSeeUpdate) {

                var update = Utils.findById(ticket.updates, newChange.data.id);

                if (update) {
                  Utils.customizeObj(newChange.data, update);
                } else {
                  update = Utils.customizeObj(newChange.data);
                  ticket.updates.push(update);
                }
              } else {
                Utils.deleteById(ticket.updates, newChange.data.id);
              }

              ticket.updates.sort(sortTicketUpdateList);

              var attachments = newChange.data.attachments;

              if (attachments && attachments.length) {

                for (var i = 0; i < attachments.length; i++) {
                  var attachment = attachments[i];
                  ticket.attachments.push(attachment);
                }
              }

            } else if (newChange.action == 'UPDATE_DELETED') {
              Utils.deleteById(ticket.updates, newChange.data.id);
            }
          });

          RealTimeService.subscribe('/tagsSpecifying/' + id, scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'TAG_TICKET_SPECIFYING_SAVED') {
              ticket.tags.splice(0, ticket.tags.length);
              for (var i = 0; i < newChange.data.length; i++) {
                ticket.tags.push(newChange.data[i]);
              }
              if (callback) {
                callback(ticket);
              }
              return ticket;
            }
          });
        }
        return ticket;
      }

      function getCounts(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        var storageId = idCounter++;
        var counts = Utils.customizeObj({});

        storage.counts[storageId] = counts;

        scope.$on('$destroy', function () {
          delete storage.counts[storageId];
        });

        $http.get('/data/getCounters').then(function (resp) {
          Utils.customizeObj(resp.data, counts);

          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        RealTimeService.subscribe('/leftPanelCounts', scope, function (newChange) {
          console.log(newChange);

          if (newChange.action == 'LEFT_PANEL_COUNTS') {
            Utils.customizeObj(newChange.data, counts);
          }
        });
        return counts;
      }

      function getCountsByTypesAndCompany(scope, companyId, ticketTypes, callback) {

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!ticketTypes || ticketTypes.length == 0) {
          throw 'ticketTypes is required!'
        }

        var counts = Utils.customizeObj({});

        getCountsFromServer();

        RealTimeService.subscribe('/ticketsCount', scope, function (newChange) {
          console.log(newChange);

          if (newChange.action == 'TICKETS_COUNT_CHANGED') {
            getCountsFromServer()
          }
        });

        function getCountsFromServer() {

          $http({
            url: '/v2/tickets/counts/',
            data: {
              companyId: companyId,
              types: ticketTypes
            },
            method: 'POST'
          }).then(function (resp) {
            Utils.customizeObj(resp.data, counts);

            if (callback) {
              callback(resp.data);
            }
          }, function (resp) {
            if (callback) {
              callback(resp.data);
            }
          });
        }

        return counts;

      }

      function getCount(params, scope, callback) {

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }
        if (!params || !params.filter) {
          throw "'filter' is mandatory parameter that must be counted in first argument"
        }

        params = normalizeAndCopyParams(params);

        var count = Utils.customizeObj({});

        $http({
          method: 'GET',
          url: '/v2/tickets/countByType',
          params: params
        }).then(function (resp) {
          Utils.customizeObj(resp.data, count);

          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        RealTimeService.subscribe('/ticketsCount', scope, function (newChange) {
          console.log(newChange);

          if (newChange.action == 'TICKETS_COUNT_CHANGED') {
            $http({
              method: 'GET',
              url: '/v2/tickets/countByType',
              params: params
            }).then(function (data) {
              Utils.customizeObj(data.data, count);

              if (callback) {
                callback(data.data);
              }
            }, function (data) {
              if (callback) {
                callback(data.data);
              }
            });
          }
        });
        return count;
      }

      function changePriority(ticketId, priority, callback) {
        if (!ticketId || !priority) throw 'ticketId and priority is required arguments!';
        changeTicket('priority', ticketId, priority.toUpperCase(), callback);
      }

      function assignTo(ticketId, userId, callback) {
        if (!ticketId || !userId) throw 'ticketId and userId is required arguments!';
        changeTicket('assign', ticketId, userId, callback);
      }

      function changeStatus(ticketId, status, callback) {
        if (!ticketId || !status) throw 'ticketId and status is required arguments!';
        changeTicket('status', ticketId, status.toUpperCase(), callback);
      }

      function markAsSpam(ticketId, callback) {
        if (!ticketId) throw 'ticketId is required arguments!';
        changeTicket('markAsSpam', ticketId, false, callback);
      }

      function reportAsSpam(ticketId, callback) {
        if (!ticketId) throw 'ticketId is required arguments!';
        changeTicket('reportAsSpam', ticketId, false, callback);
      }

      function restoreFromSpam(ticketId, callback) {
        if (!ticketId) throw 'ticketId is required arguments!';
        changeTicket('restoreFromSpam', ticketId, false, callback);
      }

      function changeTrashFlag(ticketId, value, callback) {
        if (!ticketId) throw 'ticketId is required arguments!';
        changeTicket('trash', ticketId, !!value, callback);
      }

      function changeTicket(action, id, value, callback) {
        var url, data = { value: value };

        if (Object.prototype.toString.call(id) === '[object Array]') {
          url = '/v2/tickets/' + action;
          data.ids = id;
        } else {
          url = '/v2/tickets/' + id + '/' + action;
        }

        var future = $http.put(url, data);

        Utils.handleCallback(future, callback)
      }

      function deleteForever(ticketId, callback) {

        if (!ticketId) throw 'ticketId is required arguments!';

        var ids = ticketId;

        if (Object.prototype.toString.call(ticketId) !== '[object Array]') {
          ids = [ticketId];
        }

        var future = $http({
          url: '/v2/tickets/delete/',
          data: {
            ids: ids
          },
          method: 'POST'
        });

        Utils.handleCallback(future, callback)
      }

      function claimUser(ticketId) {
        $http.get('/tickets/claimUser?ticketId=' + ticketId);
      }

      function createTicket(ticket, callback) {

        if (ticket.priorityLevel) {
          ticket.priorityLevel = ticket.priorityLevel.toUpperCase();
        }

        var future = $http.post('/v2/tickets', ticket);

        Utils.handleCallback(future, callback);
      }

      function getActualNumber(scope, callback) {
        $http.get('/data/actualNumber?type=TICKET').success(function (ticketNumber) {
          callback(ticketNumber.number);
        });

        RealTimeService.subscribe('/number/TICKET', scope, function (change) {
          console.log(change);
          if (change.action === 'NUMBER_CHANGED') {
            callback(Utils.getFormattedNumber(change.data));
          }
        });
      }

      function createTicketUpdate(ticketUpdate, close, callback) {

        if (!ticketUpdate) throw 'ticketUpdate is required arguments!';
        if (!ticketUpdate.ticket.id) throw 'ticketUpdate.ticket.id is required!';
        if (ticketUpdate.id) throw 'TicketUpdate must be new, without ticketUpdate.id!';
        if (!ticketUpdate.type) throw 'ticketUpdate.type is required!';
        if (!ticketUpdate.note && !ticketUpdate.products && !ticketUpdate.services) throw 'In TicketUpdate must be or note or products or services!';

        var future = $http({
          url: '/v2/tickets/updates',
          method: 'POST',
          params: {
            close: !!close
          },
          data: ticketUpdate
        });

        Utils.handleCallback(future, callback);

      }

      function deleteTicketUpdate(ticketId, updateId, callback) {
        var future = $http({
          url: '/v2/tickets/' + ticketId + '/updates/' + updateId,
          method: 'DELETE'
        });

        Utils.handleCallback(future, callback);
      }

      function loadRemainingTicketUpdates(ticket, callback) {

        if (!ticket.id || !ticket.updates) throw 'You can load updates only for detailed ticket!';
        if (ticket.updates.length == 0) throw 'There is no updates';

        var loadedIds = [];

        for (var i = 0; i < ticket.updates.length; i++) {
          loadedIds.push(ticket.updates[i].id)
        }

        $http({
          url: '/v2/tickets/' + ticket.id + '/updates/fetch',
          method: 'POST',
          data: loadedIds
        }).then(function (resp) {

          Utils.customizeArray(resp.data, ticket.updates);

          Utils.defineReadOnlyProperty(ticket, 'unloadedUpdates', 0);

          ticket.updates.sort(sortTicketUpdateList);

          if (callback) callback(resp.data);
        }, function (resp) {
          if (callback) callback(resp.data);
        });
      }

      function markUpdateAsRead(ticketId, updateIds, callback) {

        if (!ticketId || !updateIds) throw 'ticketId and updateIds is required parameters';

        var future = $http({
          url: '/v2/tickets/' + ticketId + '/updates/read',
          method: 'POST',
          data: updateIds
        });

        Utils.handleCallback(future, callback);
      }

      //todo unsubscribe when there is no need in ticket notifications
      var newScope = $rootScope.$new();

      RealTimeService.subscribe('/tags', newScope, function (newChange) {

        if (newChange.action === 'TAG_TICKET_SAVED') {
          for (var key in storage.lists) {

            var listData = storage.lists[key];

            var ticketById = Utils.findById(listData.list, newChange.data.ticketId);

            if (ticketById) {
              ticketById.tags.splice(0, ticketById.tags.length);
              for (var i = 0; i < newChange.data.tags.length; i++) {
                ticketById.tags.push(newChange.data.tags[i]);
              }
            }
          }
        }
      });

      RealTimeService.subscribe('/tickets', newScope, function (newChange) {
        console.log(newChange);

        if (newChange.data && newChange.data.number) {
          newChange.data.number = numberPrefix + newChange.data.number;
        }

        if (newChange.action === 'CREATED_TICKET') {

          var ticket = Utils.customizeObj(newChange.data, {});

          //delete ticket.sharedBetween;

          for (var key in storage.lists) {

            var listData = storage.lists[key];

            if (isTicketMatchesFilters(newChange.data, listData.params)) {
              var ticketById = Utils.findById(listData.list, newChange.data.id);

              if (ticketById) {
                Utils.customizeObj(newChange.data, ticketById);
              } else {
                listData.list.unshift(ticket);
              }
            }
          }
          //} else if (newChange.action === 'MARKED_AS_SPAM') {
          //
          //    for (var key in storage.lists) {
          //
          //        var listData = storage.lists[key],
          //            ticketIndex = Utils.indexOfId(listData.list, newChange.data.id),
          //            isTicketInList = ticketIndex > -1,
          //            isTicketAvailable = isTicketMatchesFilters(newChange.data, listData.params);
          //
          //        console.log('isTicketInList = ' + isTicketInList + '   /   isTicketAvailable = ' + isTicketAvailable);
          //
          //        if (isTicketInList && isTicketAvailable) {
          //            Utils.customizeObj(newChange.data, listData.list[ticketIndex]);
          //
          //        } else if (isTicketInList && !isTicketAvailable) {
          //            listData.list.splice(ticketIndex, 1);
          //
          //        } else if (!isTicketInList && isTicketAvailable) {
          //            listData.list.unshift(Utils.customizeObj(newChange.data));
          //
          //        }
          //
          //        if(isTicketAvailable){
          //
          //        }
          //
          //    }

        } else if (ticketChangedActions.indexOf(newChange.action) > -1) {

          var ticket = Utils.customizeObj(newChange.data, {});

          //delete ticket.sharedBetween;

          for (var key in storage.lists) {

            var listData = storage.lists[key],
              needSort = false;

            var ticketIndex = Utils.indexOfId(listData.list, ticket.id);

            if (ticketIndex > -1) {
              if (isTicketMatchesFilters(newChange.data, listData.params)) {
                Utils.customizeObj(ticket, listData.list[ticketIndex]);
                needSort = true;
              } else {
                listData.list.splice(ticketIndex, 1);
                $rootScope.$broadcast("ticket_is_not_available_anymore",
                  {
                    ticketId: newChange.data.id,
                    ticketType: listData.params.filter
                  })
              }
            } else if (isTicketMatchesFilters(newChange.data, listData.params)) {

              if (listData.list.length === 0) {
                listData.list.push(ticket);
              } else {
                var last = listData.list[listData.list.length - 1];

                // todo make a butch length configurable!!!!!!
                if (listData.list.length < 15 || compareTickets(ticket, last, listData.params) <= 0) {
                  listData.list.push(ticket);
                  needSort = true
                }
              }
            }

            if (needSort) {
              listData.list.sort(function (a, b) {
                return compareTickets(a, b, listData.params);
              });
            }
          }

          for (var key in storage.tickets) {
            var storageTicket = storage.tickets[key].ticket;

            if (storageTicket.id === ticket.id) {
              Utils.customizeObj(ticket, storageTicket);
            }
          }

        } else if (newChange.action === 'READ') {

          applyChangeToTicket(newChange.data.id, function (ticket) {
            Utils.defineReadOnlyProperty(ticket, 'unread', false);
          })

        } else if (newChange.action === 'TICKET_UPDATES_READ') {

          applyChangeToTicket(newChange.data.id, function (ticket) {
            Utils.defineReadOnlyProperty(ticket, 'hasNewUpdates', false);
          })

        } else if (newChange.action === 'TICKET_COLLAPSED' || newChange.action === 'TICKET_DELETED') {

          for (var key in storage.lists) {
            Utils.deleteById(storage.lists[key].list, newChange.data.id);
          }

          for (var key in storage.tickets) {
            var storageTicketData = storage.tickets[key];

            if (storageTicketData.ticket.id === newChange.data.id) {
              delete storage.tickets[key];
              storageTicketData.scope.$broadcast("ticket_is_not_available_anymore", { ticketId: newChange.data.id })
            }
          }

        } else if (newChange.action === 'TAG_LINKED') {

          //  newChange.data is a linkMap
          for (var ticketId in newChange.data) {
            applyChangeToTicket(ticketId, function (ticket) {
              //TicketTagsService._merge(ticket.tags, newChange.data[ticket.id]);
            })
          }

        } /*else if (newChange.action === 'COMPANY_ARCHIVED') {

         for (var key in storage.lists) {

         var list = storage.lists[key].list;

         for (var i = 0; i < list.length; i++) {

         var ticket = list[i];

         if (ticket.company.id === newChange.data.id) {
         list.splice(i, 1);
         i--;
         }
         }

         if (list.length < window.layLoadingPageSize) {
         loadMore(storage.lists[key].scope);
         }
         }

         for (var key in storage.tickets) {
         var storageTicketData = storage.tickets[key];
         var storageTicket = storageTicketData.ticket;

         if (storageTicket.company.id === newChange.data.id) {
         delete storage.tickets[key];
         storageTicketData.scope.$broadcast("ticket_is_not_available_anymore", {ticketId: newChange.data.id})
         }
         }
         }*/ else if (newChange.action === 'TICKET_BILLABLE') {
          applyChangeToTicket(newChange.data.id, function (ticket) {
            Utils.defineReadOnlyProperty(ticket, 'isBillable', newChange.data.isBillable);
          })
        }
      });

      function applyChangeToTicket(ticketId, callback) {
        for (var key in storage.lists) {

          var list = storage.lists[key].list;

          for (var i = 0; i < list.length; i++) {

            var ticket = list[i];
            if (ticket.id === ticketId) {
              callback(ticket);
              break;
            }
          }

        }

        for (var key in storage.tickets) {
          var storageTicket = storage.tickets[key].ticket;

          if (storageTicket.id === ticketId) {
            callback(storageTicket);
          }
        }
      }

      function compareTickets(a, b, params) {

        if (params.filter === 'USER') {

          if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') {
            return 1;
          } else if (b.status === 'COMPLETED' && a.status !== 'COMPLETED') {
            return -1;
          }
        }

        return getTicketOrderingValue(b, params) - getTicketOrderingValue(a, params);
      }

      function getTicketOrderingValue(ticket, params) {
        return orderingFunctions[params.filter](ticket);
      }

      function defaultOrdering(ticket) {
        return ticket.assignedAt || ticket.createdAt;
      }

      var orderingFunctions = {
        URGENT: defaultOrdering,
        UNASSIGNED: function (t) {
          return t.createdAt
        },
        USER: function (t) {
          return t.closedAt || t.assignedAt
        },
        OPEN: function (t) {
          return t.assignedAt
        },
        CLOSED: function (t) {
          return t.closedAt
        },
        SHARED: function (t) {
          return t.sharedToCurrentUserAt
        },
        ALL: defaultOrdering,
        NOT_SPAM_OR_TRASH: defaultOrdering,
        USER_SPAM: function (t) {
          return t.reportedAsSpamAt
        },
        ADMIN_REPORTED_AS_SPAM: function (t) {
          return t.reportedAsSpamAt
        },
        ADMIN_MARKED_AS_SPAM: function (t) {
          return t.markedAsSpamAt
        },
        TRASH: function (t) {
          return t.deletedAt
        }
      };

      function isTicketMatchesFilters(ticket, params) {
//  todo write tests for all cases
        if (params.filter == 'URGENT') {

          if ((ticket.priorityLevel != 'HIGH' || ticket.status == 'COMPLETED')) {
            return false;
          }

          if ($rootScope.currentUser.role !== 'ADMIN' && !ticket.sharedToCurrentUserAt) {
            return false;
          }
        }

        //if (params.filter == 'UNASSIGNED' && (ticket.assignedUser && ticket.assignedUser.id)) {
        //  return false;
        //}

        if (params.filter == 'USER' && (!ticket.assignedUser || ticket.assignedUser.id != $rootScope.currentUser.id)) {
          return false;
        }

        if (params.filter == 'OPEN' && ticket.status == 'COMPLETED') {
          return false;
        }

        if (params.filter == 'CLOSED') {

          if (ticket.status != 'COMPLETED') {
            return false;
          }

          if ($rootScope.currentUser.role !== 'ADMIN' && $rootScope.currentUser.role !== 'SUPER_TECH_ADMIN'
            && (!ticket.assignedUser || ticket.assignedUser.id != $rootScope.currentUser.id)) {
            return false;
          }
        }

        if (params.filter == 'SHARED' && !ticket.sharedToCurrentUserAt) {
          return false;
        }

        if (params.filter == 'USER_SPAM') {

          if (!ticket.spamReporter || !ticket.spamReporter.id || $rootScope.currentUser.id != ticket.spamReporter.id) {
            return false;
          }
        }

        if (params.filter == 'ADMIN_REPORTED_AS_SPAM'
          && ((!ticket.spamReporter || !ticket.spamReporter.id) || (ticket.spamMarker && ticket.spamMarker.id))) {
          return false;
        }

        if (params.filter == 'ADMIN_MARKED_AS_SPAM'
          && (!ticket.spamMarker || !ticket.spamMarker.id)) {
          return false;
        }

        if (params.filter == 'TRASH' && !ticket.trash) {
          return false;
        }

        if (params.filter !== 'USER_SPAM' && params.filter !== 'ADMIN_REPORTED_AS_SPAM' && params.filter !== 'ADMIN_MARKED_AS_SPAM' && params.filter !== 'TRASH' && ((ticket.spamMarker && ticket.spamMarker.id) || (ticket.spamReporter && ticket.spamReporter.id) || ticket.trash)) {
          return false;
        }

        if (params.companyId && params.companyId != ticket.company.id) {
          return false;
        }

        if (params.status && params.status != ticket.status) {
          return false;
        }

        if (params.priority && params.priority != ticket.priorityLevel) {
          return false;
        }
        return true;
      }

      function updateExpenseInTicketUpdate(expense, callback) {

        if (!expense) throw 'expense is required!';
        if (!expense.ticketUpdateId) throw 'ticketUpdateId is required!';
        if (!expense.serviceExpense && !expense.productExpense) throw 'serviceExpense or productExpense is required!';

        var future = $http({
          url: '/v2/tickets/ticketUpdate/updateExpense',
          method: 'PUT',
          data: expense
        });

        Utils.handleCallback(future, callback);
      }

      function getCurrentlyWorkingWith(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!';
        }

        return Utils.getListByUrl('/v2/tickets/currentlyWorkingWith', callback, function (list) {

          RealTimeService.subscribe('/tickets', scope, function (newChange) {

            console.log(newChange);

            if (newChange.action == 'CURRENTLY_WORKING_WITH') {
              list.splice(0, list.length);
              Utils.customizeArray(newChange.data, list);
            }
          });
        });
      }

      return {
        getList: getList,
        getCurrentlyWorkingWith: getCurrentlyWorkingWith,
        loadMore: loadMore,
        search: search,
        getCount: getCount,
        getCounts: getCounts,
        getCountsByTypesAndCompany: getCountsByTypesAndCompany,
        getOne: getOne,
        changePriority: changePriority,
        assignTo: assignTo,
        changeStatus: changeStatus,
        markAsSpam: markAsSpam,
        reportAsSpam: reportAsSpam,
        restoreFromSpam: restoreFromSpam,
        changeTrashFlag: changeTrashFlag,
        deleteForever: deleteForever,
        claimUser: claimUser,
        createTicket: createTicket,
        getActualNumber: getActualNumber,
        createTicketUpdate: createTicketUpdate,
        deleteTicketUpdate: deleteTicketUpdate,
        loadRemainingTicketUpdates: loadRemainingTicketUpdates,
        markUpdateAsRead: markUpdateAsRead,
        updateExpenseInTicketUpdate: updateExpenseInTicketUpdate
      }

    }]);

})(window, jQuery);
