'use strict';
/* Services */
(function (window, $, undefined) {
  var numberPrefix = 'Tkt# ';
  var services = angular.module('main.services');
  services.factory('TicketsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'quicktech.common.services.SharedStateService', '$timeout','$filter',
    function ($http, $rootScope, RealTimeService, Utils, SharedStateService, $timeout,$filter) {
      var scope = $rootScope.$new();
      var ticketChangedActions = ['ASSIGNED_USER', 'PRIORITY_CHANGED', 'STATUS', 'TRASH', 'REPORT_AS_SPAM', 'RESTORE_FROM_SPAM', 'TICKET_SHARE', 'MARKED_AS_SPAM', 'EDITED_TICKET','RECURRING_TICKETS_OPEN', 'RECURRING_TICKETS_CLOSED'];
      var queries, loadingInProcess, lastListType, queriesForCompanyProfilePage;
      var MY_TICKETS = false;
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
      $rootScope.$on('getCountsTickets', function(){
        changeTicketsCounts();
      });
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
            groupFieldFilters: [
              {
                "fieldFilterDtos": [
                  {
                    "path":"status",
                    "operator":"NULL"
                  }
                ]
              },
              {
                "fieldFilterDtos": [
                  {
                    "path": "reportedAsSpamAt",
                    "operator": "NULL"
                  },
                  {
                    "path": "markedAsSpamAt",
                    "operator": "NULL"
                  },
                  {
                    "path": "trash",
                    "operator": "EQ",
                    "values": [false]
                  }
                ],
                "predicateRule":"OR"
              }
            ]
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
                  },
                  {  
                    "path":"multiAssignedUsers.id",
                    "operator":"IN",
                    "values":[  
                      currentUserId
                    ]
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
          RECURRING_TICKETS_OPEN: {
            excludeTrashSpam: true,
            groupFieldFilters: [
              {
                fieldFilterDtos: [
                  {
                    path: "status",
                    operator: "NOT_EQ",
                    values: [
                      "COMPLETED"
                    ]
                  },
                  {
                    path: "ticketSource",
                    operator: "EQ",
                    values: [
                      "FROM_RECURRING_TICKET"
                    ]
                  }
                ]
              }
            ],
            offset: 0
          },
          RECURRING_TICKETS_CLOSED: {
            excludeTrashSpam: true,
            groupFieldFilters: [
              {
                fieldFilterDtos: [
                  {
                    path: "status",
                    operator: "EQ",
                    values: [
                      "COMPLETED"
                    ]
                  },
                  {
                    path: "ticketSource",
                    operator: "EQ",
                    values: [
                      "FROM_RECURRING_TICKET"
                    ]
                  }
                ]
              }
            ],
            offset: 0
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
     
    
      function getTicketFromStorage(id) {
        return storage.tickets.find(function(ticket) {
          return ticket.id === id;
        })
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
      return {
        getTicketFromStorage: getTicketFromStorage,
        search: search,
        changePriority: changePriority,
        assignTo: assignTo,
        changeStatus: changeStatus,
        markAsSpam: markAsSpam,
        reportAsSpam: reportAsSpam,
        restoreFromSpam: restoreFromSpam,
        changeTrashFlag: changeTrashFlag,
        deleteForever: deleteForever,
        createTicket: createTicket,
        getActualNumber: getActualNumber,
        changeLinkedAgent: changeLinkedAgent,
        updateDiscount: updateDiscount,
      }
    }
  ]);
})(window, jQuery);
