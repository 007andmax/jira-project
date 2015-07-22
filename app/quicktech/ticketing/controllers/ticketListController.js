'use strict';

/* Controllers */
(function (window, $, undefined) {
  var app = angular.module('quicktech.core.tickets');


  app.directive('includeReplace', function () {
    return {
      require: 'ngInclude',
      restrict: 'A', /* optional */
      link: function (scope, el, attrs) {
        el.replaceWith(el.children());
      }
    };
  });


  app.controller('TicketListController', ['$scope', 'TicketsService', 'TicketTagsService',
      'CompaniesService', 'UsersService', '$stateParams', '$state', '$rootScope', 'ActionRightsService', 'quicktech.common.services.SharedStateService',
      'quicktech.common.services.UserNotificationService',
      function ($scope, TicketsService, TicketTagsService, CompaniesService, UsersService, $stateParams, $state,
                $rootScope, ActionRightsService, SharedStateService, UserNotificationService) {

        var headerSharedState = SharedStateService.getSharedState('ticketsHeader');

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('ticketsHeader');
        })

        $scope.searchResult = [];
        var allTickets = [];
        $(window).unbind('scroll'); // TODO: need to optimize used for unlimited downloading...

        // Remove the bulk actions, if visible - TODO: remember the current state of the app
        $('#bulk-actions').hide();
        $('.ticket-nav').removeClass("bulk-actions");
        $('#search-and-filter').show();


        UserNotificationService.show('Loading ...');
        var filter = $stateParams.listType;
        $scope.listType = $stateParams.listType;

        $scope.$parent.listType = $stateParams.listType; // Assigned to parent for displaying count based on filter

        $scope.tickets = TicketsService.getList($scope, {filter: filter}, function () {
          UserNotificationService.hide();
          $('.ticket.loading').hide();

          setTimeout(function () {
            if ($state.params.id) {
              $('#listing_' + $state.params.id).addClass('active');
            }
          }, 10);

          allTickets = $scope.tickets;

          //console.log(allTickets);

          $(window).scroll(function () { //TODO: need to optimize... //TODO: don't bind scroll event when the page is ticket detail

            if ($state.is('Tickets')) {
              if ($(window).scrollTop() + $(window).height() > $(document).height() - 10) {

                if ($scope.tickets.length < headerSharedState.count) {
                  UserNotificationService.show('Loading ...');
                  $('.ticket.loading').show();
                  TicketsService.loadMore($scope, function () {
                    UserNotificationService.hide();
                    $('.ticket.loading').hide();
                    UsersService._addInitListener($scope.populateTechGusy);
                  });
                }
              }
            }

          });

          UsersService._addInitListener($scope.populateTechGusy);
        });
        $scope.techGuys = [];
        $scope.loadTechGuys = function () {
          var curCompanyUsers = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);
          $scope.techGuys = [];

          for (var i = 0; i < curCompanyUsers.length; i++) {
            var user = curCompanyUsers[i].staticCopy();

            if (user.id !== $scope.currentUser.id) {
              user.fullName = $rootScope.getUserName(user);
              $scope.techGuys.push(user);
            }

          }

        }

        if ($scope.techGuys.length === 0) {
          UsersService._addInitListener($scope.loadTechGuys);
        }

        $scope.ActionRightsService = ActionRightsService;
        $scope.$parent.allSelectedTicketsMarkedByAdmin = false;
        $scope.$parent.allSelectedTicketsReportedAsSpam = false;

        $scope.MarkedSpamByRole = function (ticket) {

          var markedByRole = 'USER';

          if (ticket.spamPerformer) {
            var user = UsersService.getOneById(ticket.spamPerformer.id);
            markedByRole = user.role;
          }

          return markedByRole;
        }

// Methods are used in Spam Page
        $scope.isMarkedByAdmin = function (ticket) {

          if (ticket.spamPerformer) {
            var user = UsersService.getOneById(ticket.spamPerformer.id);
            return user.role === 'ADMIN';
          }
          return false;
        }

        $scope.isNotMarkedByAdmin = function (ticket) {
          if (ticket.spamPerformer) {
            return !$scope.isMarkedByAdmin(ticket);
          }
          return false;
        }

        $scope.getUserFullNameById = function (id) {
          var user = UsersService.getOneById(id);
          return user.firstName + ' ' + user.lastName;
        }

        $scope.getUserInitialsById = function (id) {

          var fullName = $scope.getUserFullNameById(id);
          var matches = fullName.match(/\b(\w)/g);
          var initials = matches.join('');

          return initials;
        }


        $scope.deleteForEver = function (ticket) {
          TicketsService.deleteForever(ticket.id, function () {
            notification('"' + ticket.subject + '" is deleted forever.');
          });
        }

        $scope.$parent.loadAll = function () {

          if (headerSharedState.searchFilter.query !== '') {
            headerSharedState.searchFilter.query = '';
            headerSharedState.searchFilter.priority = false;
            headerSharedState.searchFilter.status = false;

            $scope.tickets = TicketsService.getList($scope, {filter: $stateParams.listType}, function () {
              UserNotificationService.hide();
              $('.ticket.loading').hide();

              setTimeout(function () {
                if ($state.params.id) {
                  $('#listing_' + $state.params.id).addClass('active');
                }
              }, 10);
              allTickets = $scope.tickets;
            });
          }
        }

        $scope.$parent.search = function () {

          if ($state.current.name === 'Tickets.Detail') {
            $('body').removeClass('opened-ticket');
            $('#listing_' + $stateParams.id).removeClass('active');

            $state.go('Tickets', {'listType': $stateParams.listType});
          }

          var filter = $stateParams.listType;

          var PRIORITY = ['LOW', 'MEDIUM', 'HIGH'];
          var STATUS = ['ON_HOLD', 'IN_PROGRESS', 'COMPLETED'];

          var query = headerSharedState.searchFilter.query;
          var priority = headerSharedState.searchFilter.priority;
          var status = headerSharedState.searchFilter.status;

          var params = {
            filter: filter
          };

          if (query !== '') {
            params.keyword = query;
          }

          if (priority === true) {
            params.priority = PRIORITY[headerSharedState.searchFilter.priorityValue];
          }

          if (status === true) {
            params.status = STATUS[headerSharedState.searchFilter.statusValue];
          }

          UserNotificationService.show('Loading ...');

          $scope.tickets = TicketsService.getList($scope, params, function () {
            UserNotificationService.hide();
            $('.ticket.loading').hide();
            //setTimeout($scope.populateTechGusy, 1500); //TODO: need to optimize to load users only once...
          });
        }

        $scope.getAssignToUsers = function (company) {
          $scope.currentCompanyUser = UsersService.getAllByCompanyId(company.id);
        }

        $scope.setFocus = function (ticketId) {
          setTimeout(function () {
            $('.open #assignedTo').focus();
          }, 10);
        }


        $scope.$parent.uncheckAll = function () {
          $('#bulk-actions').hide();
          $('.ticket-nav').removeClass("bulk-actions");
          $('#search-and-filter').show();

          angular.forEach($scope.tickets, function (item) {
            item.selected = false;
            $('#listing_' + item.id).removeClass('selected');
          });
        }


        $scope.changeStatus = function (event, ticket, status, filterType) {
          TicketsService.changeStatus(ticket.id, status, function () {
            $(event.target).parents('div.dropdown').removeClass('open');
            $('div#notificationContainer div.alert-yellow').text(ticket.subject + ' priority is changed to ' + status);
            $('div#notificationContainer').show();
            if (filterType && filterType == 'closed') {
              $('body').removeClass('opened-ticket');
            }
            if (filterType && filterType === 'open' && status === 'COMPLETED') {
              $('body').removeClass('opened-ticket');
            }
            setTimeout(function () {
              $('div#notificationContainer').hide();
            }, 3000);
          });
        };

        $scope.markAsSpam = function (event, ticket, flag) {

          TicketsService.changeSpamFlag(ticket.id, flag, function () {
            if (event != null) {
              $(event.target).parents('div.dropdown').removeClass('open');
            } else {
              $('body').removeClass('opened-ticket');
            }

            if (flag) {
              notification('"' + ticket.subject + '" is moved to spam.');

            } else {
              notification('"' + ticket.subject + '" restored successfully.');
            }
          });

        };


        $scope.deleteTicket = function (event, ticket, flag) {

          TicketsService.changeTrashFlag(ticket.id, flag, function (response) {

            if (response.code === 403) {
              notification('Error: ' + response.message);
            } else {
              if (event != null) {
                $(event.target).parents('div.dropdown').removeClass('open');
              } else {
                $('body').removeClass('opened-ticket');
              }
              if (flag) {
                notification('"' + ticket.subject + '" is deleted successfully.');
              } else {
                notification('"' + ticket.subject + '" restored successfully.');
              }
            }


          });
        };

        $scope.postAssignTicket = function (event, ticket, user) {
          TicketsService.assignTo(ticket.id, user.id, function () {
            notification('"' + ticket.subject + '" claimed by you successfully.');
          });
        };

        $scope.enableBulkAction = function (event) {
          var selectedTickets = getSelectedTickets();
          var totalSelected = 0;
          if (selectedTickets !== null && selectedTickets !== undefined) {
            totalSelected = selectedTickets.length;
          }
          if (event.target.checked) {
            $('div#bulk-actions').show();
            $('div#search-and-filter').hide();

            $('.total-selected').text(totalSelected);

            // logid for spam different type of reported/marked spam bulk actions
            $scope.updateBulkActionBar(selectedTickets);

            //TODO: need to optimize don't show on each checkbox

          } else {
            var anyItemSelected = false;
            angular.forEach($scope.tickets, function (item) {
              if (item.selected === true) {
                anyItemSelected = true;
              }
            });
            if (!anyItemSelected) {
              $('div#bulk-actions').hide();
              $('div#search-and-filter').show();
            }
            $('.total-selected').text(totalSelected);

            $scope.updateBulkActionBar(selectedTickets);
          }
          $scope.updateState();
          event.stopPropagation();
        }

        $scope.updateBulkActionBar = function (selectedTickets) {
          if ($scope.listType == 'spam' && $scope.currentUser.role === 'ADMIN') {
            var markedCount = 0;
            var reportedCount = 0;

            angular.forEach(selectedTickets, function (ticket) {
              if ($scope.isMarkedByAdmin(ticket)) {
                markedCount++;
              } else {
                reportedCount++;
              }
            });

            if (markedCount == selectedTickets.length) {
              $scope.$parent.allSelectedTicketsMarkedByAdmin = true;
            } else {
              $scope.$parent.allSelectedTicketsMarkedByAdmin = false;
            }

            if (reportedCount == selectedTickets.length) {
              $scope.$parent.allSelectedTicketsReportedAsSpam = true;
            } else {
              $scope.$parent.allSelectedTicketsReportedAsSpam = false;
            }
          }
        }

        $scope.getSelectedTicketIds = function () {
          var tickets = getSelectedTickets();
          var ids = [];
          angular.forEach(tickets, function (ticket) {
            ids.push(ticket.id);
          });

          return ids;
        }

        $scope.$parent.deleteBulkTicketsForever = function ($event, isDelete) {

          var params = $scope.getSelectedTicketIds();

          TicketsService.deleteForever(params, function () {
            notification(params.length + ' ticket(s) are deleted forever.');
          });
        }

        $scope.$parent.restoreBulkTickets = function () {

          var params = $scope.getSelectedTicketIds();
          //TODO: need to improve the way the restore button is called.

          if ($scope.listType === 'trash') {

            TicketsService.changeTrashFlag(params, false, function () {
              $('#bulk-actions').hide();
              $('.ticket-nav').removeClass("bulk-actions");
              $('#search-and-filter').show();

              notification(params.length + ' tickets are restored successfully.');
            });
          } else {
            TicketsService.changeSpamFlag(params, false, function () {

              $('#bulk-actions').hide();
              $('.ticket-nav').removeClass("bulk-actions");
              $('#search-and-filter').show();

              notification(params.length + ' tickets are restored successfully.');
            });
          }

        }

        $scope.$parent.changeBulkPriority = function (event, priority) {

          var params = $scope.getSelectedTicketIds();

          TicketsService.changePriority(params, priority, function () {
            $(event.target).parents('div.dropdown').removeClass('open');
            notification('Priority for ' + params.length + ' Ticket(s) has been set!');
            $scope.uncheckAll();
          });
        };

        $scope.$parent.changeBulkStatus = function (status) {

          var params = $scope.getSelectedTicketIds();

          TicketsService.changeStatus(params, status, function () {
            notification('Status for ' + params.length + ' ticket(s) is updated!');
            $scope.uncheckAll();
          });
        };

        $scope.$parent.assignUsertoBulkTickets = function () {

          var tickets = $scope.getSelectedTicketIds();
          var user = $('#bulkUserId').val();
          var fullName = $('#bulkAssignedTo').val();

          $('#btnShowAssignUserforBulk').trigger('click');

          TicketsService.assignTo(tickets, user, function () {

            $('#bulk-actions').hide();
            $('.ticket-nav').removeClass("bulk-actions");
            $('#search-and-filter').show();

            //$scope.$parent.ticketCounts[$scope.filterType.toUpperCase()] -= tickets.length;

            notification(tickets.length + ' tickets are assigned to "' + fullName + '"');
          });
        }

// TODO: use a single method for both of the following...

        $scope.assignUsertoTicket = function (ticketId) {

          var user = $('.open #assignedToUserId').val();
          var fullName = $('.open #AssignedTo').val();

          $('#btnShowAssignUserforBulk').trigger('click');

          TicketsService.assignTo(ticketId, user, function () {
            notification('Ticket is assigned successfully!');
          });
        }

        $scope.$parent.markAsBulkSpam = function (event, flag) {

          var params = $scope.getSelectedTicketIds();

          TicketsService.changeSpamFlag(params, flag, function () {
            if (event != null) {
              $(event.target).parents('div.dropdown').removeClass('open');
            } else {
              $('body').removeClass('opened-ticket');
            }

            notification(params.length + ' ticket(s) are moved to spam.');
            $scope.uncheckAll(); //TODO: improve only hide uncheck not required.... same for bulk tickets
          });
        };


        $scope.$parent.claimBulkTicket = function (user) {

          var params = $scope.getSelectedTicketIds();

          TicketsService.assignTo(params, user.id, function () {
            notification(params.length + ' ticket(s) claimed by you successfully.');
            // TODO: don't repeat the show hide code - use a different strategy
            $('#bulk-actions').hide();
            $('.ticket-nav').removeClass("bulk-actions");
            $('#search-and-filter').show();
          });

        }

        $scope.$parent.deleteBulkTicket = function (event, flag) {

          var params = $scope.getSelectedTicketIds();
          //TODO: need to improve the way multiple bulk delete are handled..
          if ($scope.listType === 'trash') {
            TicketsService.deleteForever(params, function () {
              notification(params.length + ' ticket(s) are deleted successfully.');
            });
          } else {
            TicketsService.changeTrashFlag(params, flag, function () {
              if (event != null) {
                $(event.target).parents('div.dropdown').removeClass('open');
              } else {
                $('body').removeClass('opened-ticket');
              }
              notification(params.length + ' ticket(s) are deleted successfully.');
              $scope.uncheckAll();
            });
          }
        };


        $scope.$parent.linkTags = function () {

          var params = {};
          var tickets = getSelectedTickets();

          angular.forEach(tickets, function (ticket) {

            params[ticket.id] = [];
            var counter = 0;

            angular.forEach(headerSharedState.allTags, function (tag) {
              if (tag.isSelected === true) {
                params[ticket.id][counter++] = tag.id;
              }
            });
          });

          TicketTagsService.link(params, function () {
            notification(tickets.length + ' Ticket(s) have been tagged successfully!');
            $scope.uncheckAll();
          });
        };

        $scope.updateState = function () {
          angular.forEach(headerSharedState.allTags, function (tag) {
            tag.state = 0;
            tag.isSelected = false;
            tag.state = $scope.checkboxState(tag.id);

            if (tag.state === 1 || tag.state === 2) {
              tag.isSelected = true;
            }
          });
        }

        $scope.checkboxState = function (id) {
          var selectedTickets = getSelectedTickets();
          var checkboxState = 0; //unchecked
          var count = 0;

          angular.forEach(selectedTickets, function (ticket) {
            angular.forEach(ticket.tags, function (ticketTag) {
              if (ticketTag.id === id) {
                // intermediate state
                checkboxState = 2;
                count++;
              }
            });
          });

          if (count === selectedTickets.length) {
            checkboxState = 1;
          }

          return checkboxState;

        }

        function getSelectedTickets() {
          var selectedTickets = [];
          angular.forEach($scope.tickets, function (item) {
            if (item.selected === true) {
              selectedTickets.push(item);
            }
          });

          return selectedTickets;
        }

// TODO: improve method name and code...
//TODO: move all methods that are used in multiple views to a service.
        $scope.postTagAs = function (event, ticketId) {

          if ($(event.target).parents('ul.tag-list').find('input[type=checkbox]:checked').length > 0) {
            var tags = $(event.target).parents('ul.tag-list').find('input[type=checkbox]:checked');
            //console.dir(tags);
            var tagsArr = [];
            tags.each(function (i, tag) {
              tagsArr[i] = {};
              tagsArr[i].id = tag.value;
            });
            var postData = {};

            postData[ticketId] = [];
            for (var j = 0; j < tagsArr.length; j++) {
              postData[ticketId][j] = tagsArr[j].id;
            }

            TicketTagsService.link(postData, function () {
              notification('Ticket has been tagged successfully.');
            });
          } else {
            var postData = {};
            postData[ticketId] = [];
            TicketTagsService.link(postData, function () {
              notification('Ticket has been tagged successfully.');
            });
          }
        }

        function notification(msg) {

          UserNotificationService.show(msg);

          setTimeout(function () {
            UserNotificationService.hide();
          }, 3000);

        }

        $scope.notification = notification;

        $scope.lowerCaseWithOutUnderScore = function (str) {
          if (str == 'IN_PROGRESS') {
            return 'progress';
          } else if (str == 'COMPLETED') {
            return 'completed';
          } else if (str == 'ON_HOLD') {
            return 'onhold';
          }
        }

        $scope.changePriority = function (event, ticket, priority) {
          TicketsService.changePriority(ticket.id, priority, function () {
            $(event.target).parents('div.dropdown').removeClass('open');
            $('div#notificationContainer div.alert-yellow').text(ticket.subject + ' priority is changed to ' + priority);
            $('div#notificationContainer').show();
            setTimeout(function () {
              $('div#notificationContainer').hide();
            }, 3000);
          });
        };

        $scope.renderDateTime = function (time) {
          var str = '';
          var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          var currentDate = new Date().getDate();
          var currentMonth = new Date().getMonth();
          var currentYear = new Date().getFullYear();
          var providedYear = new Date(time).getFullYear();
          var providedMonth = new Date(time).getMonth();
          var providedDate = new Date(time).getDate();
          if (currentYear <= providedYear) {
            str = new Date(time).getDate() + " " + month[new Date(time).getMonth()] + " " + new Date(time).getFullYear();
          } else if (currentMonth <= providedMonth) {
            str = new Date(time).getDate() + " " + month[new Date(time).getMonth()];
          } else if (currentDate < providedDate) {
            str = new Date(time).getHours() + ":" + new Date(time).getMinutes();
          } else {
            str = new Date(time).getDate() + " " + month[new Date(time).getMonth()];
          }
          return str;
        }

        $scope.getSpamIconToolTip = function (listType) {
          if (listType === 'unassigned') {
            return 'Report As Spam';
          } else if (listType === 'spam') {
            return 'Mark As Spam';
          }
        }

        $scope.getStatusCSS = function (tag) {
          if (tag)
            return tag.toLowerCase();
        }

        $scope.expand = function (event, ticketId) {

          if (event.target.className === 'ticket has-actions' ||
            event.target.className === 'ticket-title clearfix' ||
            event.target.className === 'pull-left ng-binding' ||
            event.target.className === 'ticket-meta clearfix' ||
            event.target.className === 'ticket-excerpt ng-binding' ||
            event.target.className === 'company-name ng-binding' ||
            event.target.className === 'ticket-meta clearfix ng-scope'
          ) {
            $scope.$parent.uncheckAll();    //uncheck any elements if selected.

            $state.go('Tickets.Detail', {'id': ticketId, 'listType': $stateParams.listType});
            $('.ticket-sidebar').find('.ticket').removeClass('active');

            $('#listing_' + ticketId).addClass('active');
          }
        };

        $scope.populateTechGusy = function () {
          setTimeout($scope.populateTechGusy_typeahead, 500);
        }

        $scope.populateTechGusy_typeahead = function () {

          var substringMatcher = function (strs) {
            return function findMatches(q, cb) {
              var matches, substringRegex;
              matches = [];

              q = q.trim().toLowerCase();

              $.each(strs, function (i, str) {
                var firstName = str.firstName !== undefined ? str.firstName.toLowerCase() : '';
                var lastName = str.lastName !== undefined ? str.lastName.toLowerCase() : '';
                var fullName = str.fullName !== undefined ? str.fullName.toLowerCase() : '';
                var primaryEmail = str.primaryEmail !== undefined ? str.primaryEmail.toLowerCase() : '';
                if (firstName.indexOf(q) !== -1
                  || lastName.indexOf(q) !== -1
                  || primaryEmail.indexOf(q) !== -1
                  || fullName.indexOf(q) !== -1) {
                  matches.push(str);
                }
              });
              //var substrRegex = new RegExp(q, 'i');
              /*$.each(strs, function(i, str) {
               if (substrRegex.test(str.firstName)
               || substrRegex.test(str.lastName)
               || substrRegex.test(str.fullName)
               || substrRegex.test(str.primaryEmail) ) {
               matches.push(str);
               }
               });*/

              cb(matches);
            };
          };

          var selected = false;

          $('#the-basics .typeahead').typeahead('destroy'); // TODO: need to optimize the code

          $('#the-basics .typeahead').typeahead({hint: true, highlight: true, minLength: 0},
            {
              display: 'fullName',

              templates: {
                empty: '',
                suggestion: Handlebars.compile([
                  '<div><a herf="javascript:void(0);" class="pull-left avatar-26 avatar m-r">',
                  '<img src="images/avatars/a4.jpg" alt="..." class="img-circle">',
                  '</a>',
                  '<div class="clearfix">',
                  '<div class="user-name" data-userid={{name}}><a href="javascript:void(0);">{{firstName}} {{lastName}} "{{primaryEmail}}"</a></div>',
                  '</div></div>'
                ].join('\n'))
              },
              name: 'techGuys',
              source: substringMatcher($scope.techGuys)
            }).on('typeahead:beforeclose', function ($e) {
              if (!selected) {
                $e.preventDefault();
              }
            })

            .on('typeahead:select', function ($e, item) {

              $('#btnBulkAssignUser').removeClass('disabled');
              $('#bulkUserId').val(item.id);

              $('.open #btnAssignUser').removeClass('disabled');
              $('.open #assignedToUserId').val(item.id);

              selected = true;
            });

          $('#the-basics .typeahead').focus();

          $('#the-basics .typeahead').on('keyup', function (event) {

            if (event.which !== 13) {
              $('#btnBulkAssignUser').addClass('disabled');
              $('#btnAssignUser').addClass('disabled');
              selected = false;
            }

            if (event.which === 13 && selected) {
              //alert('enter pressed!');
            }

          });


          $('.tt-menu').jScrollPane({
            autoReinitialise: true,
            verticalDragMinHeight: 54,
            verticalDragMaxHeight: 54,
          });

        }

        prepareTicketsModule();

        $scope.filterType = filter;

        if (filter == 'spam') {
          $scope.reportedtickets = $scope.tickets;
        }

        if (filter === 'user')
          filter = 'My Tickets';

        filter = filter && filter[0].toUpperCase() + filter.slice(1)

        headerSharedState.panelTitle = filter;

      }]
  )

})(window, jQuery);
