'use strict';

/* Services */

(function (window, $, undefined) {

  var numberPrefix = 'Tkt# ';

  var services = angular.module('main.services');

  services.factory('TicketsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'quicktech.common.services.SharedStateService', '$timeout',
    function ($http, $rootScope, RealTimeService, Utils, SharedStateService, $timeout) {

      var scope = $rootScope.$new();
      var ticketChangedActions = ['ASSIGNED_USER', 'PRIORITY_CHANGED', 'STATUS', 'TRASH', 'REPORT_AS_SPAM', 'RESTORE_FROM_SPAM', 'TICKET_SHARE', 'MARKED_AS_SPAM', 'EDITED_TICKET'];
      var queries, loadingInProcess, lastListType, queriesForCompanyProfilePage;
      var operators = {
        NULL: function (value) {
          return value === null || value === undefined;
        },
        NOT_NULL: function (value) {
          return !operators.NULL(value);
        },
        EQ: function (value1, value2) {
          return value1 == value2;
        },
        NOT_EQ: function (value1, value2) {
          return !operators.EQ(value1, value2);
        },
        GT: function (value1, value2) {
          return value1 > value2;
        },
        GE: function (value1, value2) {
          return value1 >= value2;
        },
        LT: function (value1, value2) {
          return value1 < value2;
        },
        LE: function (value1, value2) {
          return value1 <= value2;
        },
        LIKE: function (str1, str2) {
          return str1 && str1.indexOf(str2) !== -1;
        },
        IN: function (value, array) {
          if (array && array.length) {
            for (var i = 0; i < array.length; i++) {
              var item = array[i];

              if (angular.equals(value, item)) {
                return true;
              }
            }
          }
          return false;
        }
      };

      var allCountsCallback;

      var storage = {
        lastParams: {},
        tickets: [],
        ticketsQuantity: 0,
        leftPanelCounters: {}
      };

      var globalSearch = SharedStateService.getSharedState('globalSearch');

      var userId;

      var unwatch = $rootScope.$watch('currentUser.id', function (currentUserId) {
        if (currentUserId) {
          userId = currentUserId;
          queries = getQueries(currentUserId);
          unwatch();
          queriesForCompanyProfilePage = {
            ALL: getQueries(currentUserId).ALL,
            UNASSIGNED: getQueries(currentUserId).UNASSIGNED,
            ON_HOLD: getQueries(currentUserId).ON_HOLD,
            IN_PROGRESS: getQueries(currentUserId).IN_PROGRESS,
            COMPLETED: getQueries(currentUserId).COMPLETED
          }
        }
      });



      var ticketsSharedState = SharedStateService.getSharedState('ticketsHeader');

      function getQueries(currentUserId) {
        return {
          ALL: { excludeTrashSpam: true },
          UNASSIGNED: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'assignedUser',
                operator: 'NULL'
              }]
            }]
          },
          USER: {
            "excludeTrashSpam": true,
            "groupFieldFilters": [
              {
                "predicateRule": "OR",
                "fieldFilterDtos": [
                  {
                    "path": "assignedUser.id",
                    "operator": "EQ",
                    "values": [
                      currentUserId
                    ]
                  },
                  {
                    "path": "assignedUser.id",
                    "operator": "NULL",
                    "values": []
                  }
                ]
              },
              {
                "predicateRule": "OR",
                "fieldFilterDtos": [
                  {
                    "path": "status",
                    "operator": "EQ",
                    "values": ["ON_HOLD"]
                  },
                  {
                    "path": "status",
                    "operator": "EQ",
                    "values": ["IN_PROGRESS"]
                  },
                  {
                    "path": "status",
                    "operator": "NULL",
                    "values": []
                  }
                ]
              }
            ],
            "offset": 0
          },
          SHARED: {
            excludeTrashSpam: true,
            orderByFilters: [{
              path: 'shares.date',
              order: 'DESC',
              aggregation: 'MIN'
            }],
            groupFieldFilters: [{
              predicateRule: 'AND',
              fieldFilterDtos: [{
                path: 'shares.user.id',
                operator: 'EQ',
                values: [currentUserId]
              }, {
                path: 'status',
                operator: 'NOT_EQ',
                values: ['COMPLETED']
              }]
            }, {
              predicateRule: 'OR',
              fieldFilterDtos: [{
                path: 'assignedUser.id',
                operator: 'NULL'
              }, {
                path: 'assignedUser.id',
                operator: 'NOT_EQ',
                values: [currentUserId]
              }]
            }]
          },
          OPEN: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'status',
                operator: 'NOT_EQ',
                values: ['COMPLETED']
              }]
            }]
          },
          CLOSED: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'status',
                operator: 'EQ',
                values: ['COMPLETED']
              }]
            }]
          },
          TRASH: {
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'trash',
                operator: 'EQ',
                values: [true]
              }]
            }]
          },
          SPAM: {
            groupFieldFilters: [{
              predicateRule: 'OR',
              fieldFilterDtos: [{
                path: 'spamMarker',
                operator: 'NOT_NULL'
              }, {
                path: 'spamReporter',
                operator: 'NOT_NULL'
              }]
            }]
          },
          ON_HOLD: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'status',
                operator: 'EQ',
                values: ['ON_HOLD']
              }]
            }]
          },
          IN_PROGRESS: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'status',
                operator: 'EQ',
                values: ['IN_PROGRESS']
              }]
            }]
          },
          COMPLETED: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'status',
                operator: 'EQ',
                values: ['COMPLETED']
              }]
            }]
          },
          EXAMPLE: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'number',
                operator: 'EQ',
                values: ['0000']
              }]
            }]
          },

        };
      }




      function fetchTickets(listType, userId, companyId, callback) {

          var query = queries[listType.toUpperCase()]

          // console.log(ticketsSharedState.filter, 'FILTER')
          if(ticketsSharedState.filter.companyId || ticketsSharedState.filter.clientUserId || ticketsSharedState.filter.techUserId || (ticketsSharedState.filter.tags && ticketsSharedState.filter.tags.length)) {
            var groupedQuery = {
              excludeTrashSpam: true,
              groupFieldFilters: [{
                predicateRule: 'AND',
                fieldFilterDtos: []
              }]
            };

            if(ticketsSharedState.filter.companyId && ticketsSharedState.filter.companyId !== '' && ticketsSharedState.filter.companyId !== ' ') {
              var coompanyIdQuery = {
                path: 'companyId',
                operator: 'EQ',
                values: [ticketsSharedState.filter.companyId]
              };
              groupedQuery.groupFieldFilters[0].fieldFilterDtos.push(coompanyIdQuery);
              // groupedQuery.groupFieldFilters[0].fieldFilterDtos.push({
              //   // path: 'company.id',
              //   // operator: 'EQ',
              //   // values: [companyId]
              //   "path": "tags.id",
              //   "operator": "IN",
              //   "values": [
              //     "9cb72af9-4629-4fdd-a4e8-b4d3d6012509"
              //   ]
              // })
            }

            if (ticketsSharedState.filter.tags && ticketsSharedState.filter.tags.length > 0) {
              var tagsQuery = {
                "path": "tags.id",
                "operator": "IN",
                "values": ticketsSharedState.filter.tags.map(function(el) { return el.id })
              }

              // var queriesList = ticketsSharedState.filter.tags.map(function(el) {
              //   return {
              //     "path": "tags.id",
              //     "operator": "IN",
              //     "values": [el.id]
              //   }
              // });
              //
              //
              // console.log(queries, "QUERIS")
              //
              // queriesList.forEach(function(query) {
              //   groupedQuery.groupFieldFilters[0].fieldFilterDtos.push(query);
              // })

              // if (!queriesList || !queriesList.length) {
              //   groupedQuery.groupFieldFilters[0].fieldFilterDtos.push({
              //     "path": "tags.id",
              //     "operator": "IN",
              //     "values": []
              //   })
              // }



              groupedQuery.groupFieldFilters[0].fieldFilterDtos.push(tagsQuery)
            }

            if(ticketsSharedState.filter.clientUserId) {
              var userIdQuery = {
                path: 'createdUserId',
                operator: 'EQ',
                values: [ticketsSharedState.filter.clientUserId]
              };
              groupedQuery.groupFieldFilters[0].fieldFilterDtos.push(userIdQuery);
            }

            if(ticketsSharedState.filter.techUserId) {
              var techUserIdQuery = {
                path: 'assignedUser.id',
                operator: 'EQ',
                values: [ticketsSharedState.filter.techUserId]
              };
              groupedQuery.groupFieldFilters[0].fieldFilterDtos.push(techUserIdQuery);
            }

            if(query && query.groupFieldFilters) {
              var ticketFilterQuery = query.groupFieldFilters[0].fieldFilterDtos[0];
              groupedQuery.groupFieldFilters[0].fieldFilterDtos.push(ticketFilterQuery)
            }

            storage.lastParams = angular.copy(groupedQuery);
            getCompanyTicketCount(storage.lastParams);
          } else {
            storage.lastParams = angular.copy(query);
          }

          storage.tickets = [];

          if (userId) {
            storage.lastParams.groupFieldFilters = storage.lastParams.groupFieldFilters || [];
            storage.lastParams.groupFieldFilters.push({
              fieldFilterDtos: [{
                path: 'createdUser.id',
                operator: 'EQ',
                values: [userId]
              }]
            });
          }

          if (companyId) {
            storage.lastParams.groupFieldFilters = storage.lastParams.groupFieldFilters || [];
            storage.lastParams.groupFieldFilters.push({
              fieldFilterDtos: [{
                path: 'company.id',
                operator: 'EQ',
                values: [companyId]
              }]
            });
          }
          loadMore(listType, callback);
      }

      function loadMore(listType, callback) {

        lastListType = listType;
        // if(storage && storage.lastParams) {
        //   storage.lastParams.offset = storage.tickets.length;
        // }
        storage.lastParams.offset = storage.tickets.length;
        // storage.lastParams.offset = 14;
        loadingInProcess = true;

        $http.post('/v2/tickets/getTickets', storage.lastParams, { params: { listType: listType } }).then(function (resp) {

          if (resp && resp.config.params.listType === lastListType) {

            for (var i = 0; i < resp.data.length; i++) {
              var ticket = resp.data[i];
              ticket.number = numberPrefix + ticket.number;

              var existedTicket = Utils.findById(storage.tickets, ticket.id);

              if (existedTicket) {
                Utils.customizeObj(ticket, existedTicket);
              } else {
                storage.tickets.push(Utils.customizeObj(ticket));
              }
            }

            if (callback) {
              callback(storage.tickets, listType);
            }
          }

          loadingInProcess = false;
        }, function (resp) {
          loadingInProcess = false;
          if (callback) {
            callback(resp.data);
          }
        });
      }

      function getTicketFromStorage(id) {
        return storage.tickets.find(function(ticket) {
          return ticket.id === id;
        })
      }

      function ticketSearch(data, callback) {
        if (!data.length) data = [];
        var url = window.location.href.split('/');

        if (url.indexOf('tickets') === -1) return;
        var filter = url.slice(-1)[0].toUpperCase();
        var filters = storage.lastParams.groupFieldFilters && storage.lastParams.groupFieldFilters[0].fieldFilterDtos;

        var userId, companyId, techId;

        // console.log(storage.lastParams.groupFieldFilters[0].fieldFilterDtos, "PARAMS", filter);

        if (filters && Array.isArray(filters)) {
          companyId = filters.find(function(el) {
            return el.path === 'companyId';
          })

          userId = filters.find(function(el) {
            return el.path === 'createdUserId';
          })

          techId = filters.find(function(el) {
            return el.path === 'assignedUser.id';
          })
        }




        var request = {
          "filter" : filter ? filter : 'ALL',
          "view": "normal",
          "priority":null, //null, low, medium, high
          "status": null, // null, ON_HOLD, IN_PROGRESS, COMPLETED
          "lastId":null,
          "companyId": companyId ? companyId.value : null,
          "userId": userId ? userId.value : null,
          "keyword":null,
          "targetUser": techId ? techId.value : null
        }

        request.tagIds = data;

        // $http.post('/v2/tickets/search', request).then(function(resp) {
        //   if (callback) {
        //     callback(resp)
        //   }
        // })
      }

      function search(callback, keyword, companyId) {
        if (!keyword || keyword === '[$empty$]' || keyword === 'undefined') {
          keyword = '';
        }

        return $http.get('/v2/tickets/searchByKeyword?keyword=' + keyword + '&companyId=' + (companyId || ''))
          .then(function (resp) {
            if (callback) {
              callback(resp.data);
            }
            return resp.data;
          });
      }

      function getOne(ticket, targetScope, callback) {

        if (!ticket || !ticket.id) {
          throw 'Invalid first argument! It must be object with "id" field!';
        }

        storage.openedTicket = ticket;

        $http.get('/v2/tickets/' + ticket.id).then(function (resp) {

          resp.data.number = numberPrefix + resp.data.number;
          Utils.customizeObj(resp.data, ticket);

          if (callback) {
            callback(ticket);
          }

        }, function () {
          if (callback) {
            callback(ticket);
          }
        });

        RealTimeService.subscribe('/ticketUpdates/' + ticket.id, targetScope, function (newChange) {

          if (newChange.action == 'UPDATE_SAVED' || newChange.action == 'UPDATE_CREATED') {
            // console.log(newChange, 'NEWWWWCHANGeEE')
            var update = Utils.findById(ticket.updates, newChange.data.id),
              attachments = newChange.data.attachments;

            if (update) {
              Utils.customizeObj(newChange.data, update);
            } else {
              update = Utils.customizeObj(newChange.data);
              ticket.updates.unshift(update);
            }

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

        RealTimeService.subscribe('/tagsSpecifying/' + ticket.id, targetScope, function (newChange) {

          if (newChange.action === 'TAG_TICKET_SPECIFYING_SAVED') {
            ticket.tags.splice(0, ticket.tags.length);
            for (var i = 0; i < newChange.data.length; i++) {
              ticket.tags.push(newChange.data[i]);
            }

            if (callback) {
              callback(ticket);
            }
          }
        });

        targetScope.$on('$destroy', function () {
          storage.openedTicket = undefined;
        });
      }

      function getLeftPanelCounts(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        $http.get('/data/getCounters').then(function (resp) {
          Utils.customizeObj(resp.data, storage.leftPanelCounters);

          if (callback) {
            callback(storage.leftPanelCounters);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        RealTimeService.subscribe('/leftPanelCounts', scope, function (newChange) {

          if (newChange.action == 'LEFT_PANEL_COUNTS') {

            Utils.customizeObj(newChange.data, storage.leftPanelCounters);
          }
        });

        return storage.leftPanelCounters;
      }

      function getCount(callback) {
        storage.ticketsQuantityCallback = callback;

        $http.post('/v2/tickets/count', storage.lastParams).then(function (resp) {
          storage.ticketsQuantity = resp.data;

          if (callback) {
            callback(storage.ticketsQuantity);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });
      }

      function getAllCounts(callback) {
        allCountsCallback = callback;
        console.log('12351235');

        $http.post('/v2/tickets/counts', queries).then(function (resp) {
          storage.ticketsQuantityMap = resp.data;

          if (callback) {
            callback(storage.ticketsQuantityMap);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });


      }

      function getAllCountsByCompanyId(scope, companyId, callback) {
        var typeOfQueries = ['ALL', 'UNASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'];
        var queryForCompanyCounters = {
          ALL: {},
          UNASSIGNED: {},
          IN_PROGRESS: {},
          ON_HOLD: {},
          COMPLETED: {}
        };

        var groupedQuery = {
          excludeTrashSpam: true,
          groupFieldFilters: [{
            predicateRule: 'AND',
            fieldFilterDtos: []
          }]
        };
        if(companyId) {
          var coompanyIdQuery = {
            path: 'companyId',
            operator: 'EQ',
            values: []
          };
          coompanyIdQuery.values.push(companyId);
          groupedQuery.groupFieldFilters[0].fieldFilterDtos.push(coompanyIdQuery);
        }

        typeOfQueries.forEach(function(query){
          if(queries.hasOwnProperty(query)){
            var q = queries[query];
            var gq = angular.copy(groupedQuery);
            if(q && q.groupFieldFilters) {
              var ticketFilterQuery = q.groupFieldFilters[0].fieldFilterDtos[0];
              gq.groupFieldFilters[0].fieldFilterDtos.push(ticketFilterQuery);
            }
            queryForCompanyCounters[query] = gq;
          }
        });


        $http.post('/v2/tickets/counts', queryForCompanyCounters).then(function (resp) {
          storage.ticketsQuantityMapByCompany = resp.data;

          if (callback) {
            callback(storage.ticketsQuantityMapByCompany);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        RealTimeService.subscribe('/leftPanelCountsCompany/'+companyId, scope, function (newChange) {
          if (newChange.action === "LEFT_PANEL_COUNTS_COMPANY") {

            Utils.customizeObj(newChange.data, storage.ticketsQuantityMapByCompany);
            //callback && callback(storage.ticketsQuantityMapByCompany)
          }
        });

        return storage.ticketsQuantityMapByCompany;
      }

      function getCompanyTicketCount(query) {
        $http.post('/v2/tickets/counts', {COUNT: query}).then(function(resp) {
          if(resp) {
            globalSearch.count = resp.data.COUNT;
          }
        })

      }

      function changePriority(ticketId, priority, callback) {
        if (!ticketId || !priority) {
          throw 'ticketId and priority is required arguments!';
        }
        changeTicket('priority', ticketId, priority.toUpperCase(), callback);
      }

      function assignTo(ticketId, userId, callback) {
        if (!ticketId || !userId) {
          throw 'ticketId and userId is required arguments!';
        }
        changeTicket('assign', ticketId, userId, callback);
      }

      function changeStatus(ticketId, status, callback, recipientsIds) {
        if (!ticketId || !status) {
          throw 'ticketId and status is required arguments!';
        }
        changeTicket('status', ticketId, status.toUpperCase(), callback, recipientsIds);
      }

      function markAsSpam(ticketId, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('markAsSpam', ticketId, false, callback);
      }

      function reportAsSpam(ticketId, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('reportAsSpam', ticketId, false, callback);
      }

      function restoreFromSpam(ticketId, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('restoreFromSpam', ticketId, false, callback);
      }

      function changeTrashFlag(ticketId, value, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('trash', ticketId, !!value, callback);
      }

      function changeLinkedAgent(ticketId, agentId, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('linkedAgent', ticketId, agentId, callback);
      }

      function updateDiscount(ticketId, discountId, callback) {
        var ticketIds = Array.isArray(ticketId) ? ticketId : [ticketId];
        changeTicket('updateDiscount', ticketIds, discountId || '', callback);
      }

      function changeTicket(action, id, value, callback, recipientsIds) {
        var url, data = { value: value };

        if (Object.prototype.toString.call(id) === '[object Array]') {
          url = '/v2/tickets/' + action;
          data.ids = id;
        } else {
          url = '/v2/tickets/' + id + '/' + action;
        }

        // if (value === 'COMPLETED') {
          data.recipientsIds = recipientsIds;
        // }

        var future = $http.put(url, data);

        Utils.handleCallback(future, callback)
      }

      function deleteForever(ticketId, callback) {

        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }

        var ids = ticketId;

        if (Object.prototype.toString.call(ticketId) !== '[object Array]') {
          ids = [ticketId];
        }

        var future = $http.post('/v2/tickets/delete/', { ids: ids });
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
        $http.get('/data/actualNumber?type=TICKET').success(function (resp) {
          if (callback) {
            callback(resp.number);
          }
        });

        RealTimeService.subscribe('/number/TICKET', scope, function (change) {
          if (change.action === 'NUMBER_CHANGED') {
            if (callback) {
              callback(Utils.getFormattedNumber(change.data));
            }
          }
        });
      }

      function createTicketUpdate(ticketUpdate, close, callback, type) {

        console.log(ticketUpdate, 'ticketUpdate');
        if (!ticketUpdate) {
          throw 'ticketUpdate is required arguments!';
        }
        if (!ticketUpdate.ticket.id) {
          throw 'ticketUpdate.ticket.id is required!';
        }
        if (ticketUpdate.id) {
          throw 'TicketUpdate must be new, without ticketUpdate.id!';
        }
        if (!ticketUpdate.type) {
          throw 'ticketUpdate.type is required!';
        }

        if (((!ticketUpdate.note && !(ticketUpdate.attachments && ticketUpdate.attachments.length)) && !ticketUpdate.products && !ticketUpdate.services) || (ticketUpdate.services && ticketUpdate.services.length === 1 && !(ticketUpdate.services[0].item && Object.keys(ticketUpdate.services[0].item).length))) {
          if (close) {
            ticketUpdate = {"type":"NOTE","shares":[],"ticket":ticketUpdate.ticket,"note": "Ticket has been closed","attachments":[]}

          }
        }

        var future = $http.post('/v2/tickets/updates?close=' + !!close, ticketUpdate);
        Utils.handleCallback(future, callback);
      }

      function deleteTicketUpdate(ticketId, updateId, callback) {
        var future = $http.delete('/v2/tickets/' + ticketId + '/updates/' + updateId);
        Utils.handleCallback(future, callback);
      }

      function loadRemainingTicketUpdates(ticket, callback) {

        var loadedIds = [];

        if (ticket.updates) {
          for (var i = 0; i < ticket.updates.length; i++) {
            loadedIds.push(ticket.updates[i].id)
          }
        }

        $http.post('/v2/tickets/' + ticket.id + '/updates/fetch', loadedIds).then(function (resp) {
          ticket.updates = ticket.updates || [];
          Utils.customizeArray(resp.data, ticket.updates);
          Utils.defineReadOnlyProperty(ticket, 'unloadedUpdates', 0);

          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });
      }

      function markUpdateAsRead(ticketId, updateIds, callback) {

        if (!ticketId || !updateIds) {
          throw 'ticketId and updateIds is required parameters';
        }

        var future = $http.post('/v2/tickets/' + ticketId + '/updates/read', updateIds);
        Utils.handleCallback(future, callback);
      }

      function changeTicketsCounts() {

        $http.post('/v2/tickets/counts', queries).then(function (resp) {
          angular.copy(resp.data, storage.ticketsQuantityMap);
        })
      }


      function deleteTicketExpense(ticketId, updateId, products, services, callback) {

        $http({
          url: '/v2/tickets/' + ticketId +  '/updates/' + updateId + '/deleteExpenses',
          method: 'DELETE',
          data: {
            productExpenseIds: products.length ? products : null,
            serviceExpenseIds: services.length ? services : null
          },
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          }
        }).then(function(resp) {
          if (callback) {
            callback(resp);
          }
        })
      }


      function updateNote(ticketId, updateId, note, callback) {
        $http.put('/v2/tickets/' + ticketId + '/updates/' + updateId + '/updateNote', {
          note: note
        }).then(function(resp) {
            if (callback) callback(resp);
          })
      }

      // function increase

      RealTimeService.subscribe('/tickets', scope, function (newChange) {

        changeTicketsCounts(); //realtime ticket counts change
        // $timeout(changeTicketsCounts, 300)
        // $timeout(changeTicketsCounts, 600)
        // $timeout(changeTicketsCounts, 1000)
        // $timeout(changeTicketsCounts, 1400)
        // $timeout(changeTicketsCounts, 1800)

        // ALL: {},
        // UNASSIGNED: {},
        // IN_PROGRESS: {},
        // ON_HOLD: {},
        // COMPLETED: {}

        if (newChange.data && newChange.data.number) {
          newChange.data.number = numberPrefix + newChange.data.number;
        }

        var ticketIndex = Utils.indexOfId(storage.tickets, newChange.data.id),
          ticketById = storage.tickets[ticketIndex];

        if (newChange.action === 'CREATED_TICKET') {

          // console.log(storage, "CREATED")

          // storage.ticketsQuantityMap.ALL = 1000000000;

          // console.log(storage.ticketsQuantityMap, globalSearch, "TICKETS")


          if (isTicketMatchesFilters(newChange.data, storage.lastParams)) {

            if (ticketById) {
              Utils.customizeObj(newChange.data, ticketById);
            } else if (insertToFitOrdering(newChange.data, storage.tickets)) { //returns true if inserted successfully
              storage.ticketsQuantity++;
            }
          } else if (ticketById) {
            Utils.deleteById(storage.tickets, ticketById.id);
            storage.ticketsQuantity--;
          }
          storage.ticketsQuantityCallback && storage.ticketsQuantityCallback(storage.ticketsQuantity);



        } else if (ticketChangedActions.indexOf(newChange.action) > -1) {
          var isUpdate = newChange.action === 'EDITED_TICKET';
          var global = globalSearch.count;

          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            Utils.customizeObj(newChange.data, storage.openedTicket);
          }

          if (isTicketMatchesFilters(newChange.data, storage.lastParams)) {

            if (ticketById) {
              Utils.customizeObj(newChange.data, ticketById);
            } else if (insertToFitOrdering(newChange.data, storage.tickets)) { //returns true if inserted successfully
              storage.ticketsQuantity++;
              global++;
            }

          } else if (ticketById) {
            storage.tickets.splice(ticketIndex, 1);
            storage.ticketsQuantity--;
            global--;
          }

          storage.ticketsQuantityCallback && storage.ticketsQuantityCallback(isUpdate ? global : storage.ticketsQuantity);

        } else if (newChange.action === 'READ') {
          if (ticketById) {
            Utils.defineReadOnlyProperty(ticketById, 'unread', false);
          }
          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            Utils.defineReadOnlyProperty(storage.openedTicket, 'unread', false);
          }

        } else if (newChange.action === 'TICKET_UPDATES_READ') {
          if (ticketById) {
            Utils.defineReadOnlyProperty(ticketById, 'hasNewUpdates', false);
          }
          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            Utils.defineReadOnlyProperty(storage.openedTicket, 'hasNewUpdates', false);
          }

        } else if (newChange.action === 'TICKET_DELETED') {



          $rootScope.deletedTicket = newChange.data.id;
          if (ticketIndex != null) {
            storage.tickets.splice(ticketIndex, 1);

            if (newChange.data.trash || newChange.data.spam) {
              storage.ticketsQuantity--;
              storage.ticketsQuantityCallback && storage.ticketsQuantityCallback(storage.ticketsQuantity);
            }
          }

          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            $rootScope.$broadcast('ticket_is_not_available_anymore', newChange.data);
            storage.openedTicket = undefined;
          }

        } else if (newChange.action === 'TICKET_BILLABLE') {
          if (ticketById) {
            Utils.defineReadOnlyProperty(ticketById, 'isBillable', newChange.data.isBillable);
          }
          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            Utils.defineReadOnlyProperty(storage.openedTicket, 'isBillable', newChange.data.isBillable);
          }

        } else if (newChange.action === 'TICKET_INVOICED') {
          if (ticketById) {
            Utils.defineReadOnlyProperty(ticketById, 'hasInvoice', newChange.data.hasInvoice);
          }
          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            Utils.defineReadOnlyProperty(storage.openedTicket, 'hasInvoice', newChange.data.hasInvoice);
          }

        } else if (newChange.action === 'LINKED_AGENT_CHANGED') {
          for (var i = 0; i < newChange.data.ticketIds.length; i++) {
            var ticketId = newChange.data.ticketIds[i],
              ticket = Utils.findById(storage.tickets, ticketId);
            if (newChange.data.deviceId && ticket) {
              Utils.defineReadOnlyProperty(ticket, 'agent', { deviceId: newChange.data.deviceId });
            } else if (ticket) {
              Utils.defineReadOnlyProperty(ticket, 'agent', null);
            }

            if (storage.openedTicket && ticketId === storage.openedTicket.id) {
              if (newChange.data.deviceId) {
                Utils.defineReadOnlyProperty(storage.openedTicket, 'agent', { deviceId: newChange.data.deviceId });
              } else {
                Utils.defineReadOnlyProperty(storage.openedTicket, 'agent', null);
              }
            }
          }
        } else if (newChange.action === 'DISCOUNT_CHANGED') {
          for (var i = 0; i < newChange.data.length; i++) {
            var data = newChange.data[i];
            if (storage.openedTicket && data.ticketId === storage.openedTicket.id) {
              Utils.defineReadOnlyProperty(storage.openedTicket, 'discount', data.discount);
            }
          }
        }
      });

      //is need to insert ticket now or it will be received later by lazy loading
      function insertToFitOrdering(newTicket, list) {
        var lastParams = storage.lastParams,
          orderByList = angular.copy(lastParams.orderByFilters);

        var orderByCreatedAt = {
          path: 'createdAt',
          order: 'DESC'
        };

        if (!orderByList) {
          orderByList = [orderByCreatedAt];
        } else if (orderByList.every(function (item) {
            return item.path !== orderByCreatedAt.path;
          })) {
          orderByList.push(orderByCreatedAt);
        }

        var insertIndex = getIndexToInsert(newTicket, list, orderByList);
        if (insertIndex < list.length || list.length < 15) {
          list.splice(insertIndex, 0, newTicket);
          return true;
        }
        return false;
      }

      function getIndexToInsert(newTicket, list, orderByList) {
        for (var index = 0; index < list.length; index++) {
          var ticket = list[index];

          for (var j = 0; j < orderByList.length; j++) {
            var orderBy = orderByList[j],
              path = orderBy.path.split('.'),
              direction = orderBy.order,
              aggregation = orderBy.aggregation,
              valueFromTicketInList,
              valueFromNewTicket,
              sortFunc,
              aggregationFunc;

            if (direction === 'DESC') {
              sortFunc = function (value1, value2) {
                return value1 >= value2;
              };
            } else {
              sortFunc = function (value1, value2) {
                return value1 <= value2;
              };
            }

            if (aggregation) {
              var arrayName = path.pop();
              aggregationFunc = Math[aggregation.toLowerCase()];
              valueFromTicketInList = getValueByAggregation(ticket[arrayName], path, aggregationFunc);
              valueFromNewTicket = getValueByAggregation(newTicket[arrayName], path, aggregationFunc);
            } else {
              valueFromTicketInList = getValueByPath(ticket, path);
              valueFromNewTicket = getValueByPath(newTicket, path);
            }

            if (sortFunc(valueFromNewTicket, valueFromTicketInList)) {
              return index;
            }
          }
        }

        return list.length;
      }

      function isTicketMatchesFilters(ticket, params) {
        var conditionsGroup = params.groupFieldFilters,
          groupRule = params.predicateRule;

        if (params.excludeTrashSpam && (ticket.trash || ticket.markedAsSpamAt || ticket.reportedAsSpamAt)) {
          return false;
        }


        for (var prop in conditionsGroup) {
          var conditionGroup = conditionsGroup[prop],
            conditions = conditionGroup.fieldFilterDtos,
            rule = conditionGroup.predicateRule,
            conditionsResult = rule !== 'OR';


          for (var i = 0; i < conditions.length; i++) {
            var condition = conditions[i];

            if (rule === 'OR' && checkCondition(condition, ticket)) {
              conditionsResult = true;
              break;
            } else if ((!rule || rule === 'AND') && !checkCondition(condition, ticket)) {
              conditionsResult = false
            }
          }

          if (groupRule === 'OR' && conditionsResult) {
            return true;
          } else if ((!groupRule || groupRule === 'AND') && !conditionsResult) {
            return false;
          }
        }

        return groupRule !== 'OR';
      }

      function checkCondition(condition, ticket) {
        var path = condition.path.split('.'),
          operator = condition.operator,
          values = condition.values,
          valueFromTicket = ticket;

        valueFromTicket = getValueByPath(valueFromTicket, path);

        if (Array.isArray(valueFromTicket)) {
          for (var j = 0; j < valueFromTicket.length; j++) {
            var value = getValueByPath(valueFromTicket[j], valueFromTicket.path.split('.'));

            if (checkValueByOperator(value, operator, values)) {
              return true;
            }
          }
          return false
        } else {
          return checkValueByOperator(valueFromTicket, operator, values);
        }
      }

      function checkValueByOperator(valueToCheck, operator, values) {
        if (operator === 'IN') {
          if (values) {
            for (var i = 0; i < values.length; i++) {
              var value = values[i];
              if (value === valueToCheck) {
                return true;
              }
            }
          }
          return false;
        } else {
          if (values) {
            if (operator === "NOT_EQ" && values[0] === 'COMPLETED' && !valueToCheck) return false;
            return operators[operator](valueToCheck, values[0]);
          } else {
            return operators[operator](valueToCheck);
          }
        }
      }

      function getValueByPath(source, path) {
        var result = angular.copy(source);

        for (var i = 0; i < path.length; i++) {
          result = result[path[i]];
          if (result === null || result === undefined) {
            return result;
          } else if (Array.isArray(result)) {
            result.path = path.slice(i + 1).join('.');
            return result;
          }
        }

        return result;
      }

      function getValueByAggregation(array, path, aggregationFunc) {
        if (array && path && aggregationFunc) {
          var result = getValueByPath(array[0], path);

          for (var i = 1; i < array.length; i++) {
            var item = array[i],
              value = item;

            for (var j = 0; j < path.length; j++) {
              value = value[path[j]];
              if (value === null || value === undefined) {
                break;
              }
            }

            result = aggregationFunc(result, value);
          }

          return result;
        }
      }

      function updateExpenseInTicketUpdate(expense, callback) {

        if (!expense) {
          throw 'expense is required!';
        }
        if (!expense.ticketUpdateId) {
          throw 'ticketUpdateId is required!';
        }
        if (!expense.serviceExpense && !expense.productExpense) {
          throw 'serviceExpense or productExpense is required!';
        }

        var future = $http.put('/v2/tickets/ticketUpdate/updateExpense', expense);
        Utils.handleCallback(future, callback);
      }

      function getCurrentlyWorkingWith(targetScope, callback) {

        if (!targetScope || !targetScope.$id) {
          throw 'First argument must be Angularjs scope!';
        }

        return Utils.getListByUrl('/v2/tickets/currentlyWorkingWith', callback, function (list) {

          RealTimeService.subscribe('/tickets', targetScope, function (newChange) {
            if (newChange.action == 'CURRENTLY_WORKING_WITH') {
              list.splice(0, list.length);
              Utils.customizeArray(newChange.data, list);
            }
          });
        });
      }

      function saveEditedTicket(ticket, callback) {
        var future = $http.put('/v2/tickets/edit', ticket);
        Utils.handleCallback(future, callback);
      }

      return {
        getList: fetchTickets,
        getCurrentlyWorkingWith: getCurrentlyWorkingWith,
        loadMore: loadMore,
        getTicketFromStorage: getTicketFromStorage,
        search: search,
        ticketSearch: ticketSearch,
        getCount: getCount,
        getCounts: getLeftPanelCounts,
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
        updateExpenseInTicketUpdate: updateExpenseInTicketUpdate,
        changeLinkedAgent: changeLinkedAgent,
        save: saveEditedTicket,
        updateDiscount: updateDiscount,
        getAllCounts: getAllCounts,
        getAllCountsByCompanyId: getAllCountsByCompanyId,
        getCompanyTicketCount: getCompanyTicketCount,
        deleteTicketExpense: deleteTicketExpense,
        updateNote: updateNote,
      }А

    }

  ]);
А
})(window, jQuery);
