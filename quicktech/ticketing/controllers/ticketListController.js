'use strict';

/* Controllers */
(function (window, $, undefined) {
	var app = angular.module('quicktech.ticketing');


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
		'CompaniesService', 'UsersService','$stateParams','$state','$rootScope', 'ActionRightsService',
		function ($scope, TicketsService, TicketTagsService, CompaniesService, UsersService, $stateParams, $state, $rootScope, ActionRightsService) {
			$scope.searchResult = []; 
			var allTickets = [];
           $(window).unbind('scroll'); // TODO: need to optimize used for unlimited downloading...

           // Remove the bulk actions, if visible - TODO: remember the current state of the app
           $('#bulk-actions').hide();
           $('.ticket-nav').removeClass("bulk-actions");
           $('#search-and-filter').show();


           $('#loading').show();
           var filter = $stateParams.listType;
           $scope.listType = $stateParams.listType;

           $scope.$parent.listType = $stateParams.listType; // Assigned to parent for displaying count based on filter

           $scope.tickets = TicketsService.getList($scope, {filter: filter}, function() {
           	$('#loading').hide();
           	$('.ticket.loading').hide();

           	setTimeout(function(){
           		if($state.params.id) {
           			$('#listing_' + $state.params.id).addClass('active');
           		}    
           	}, 10);
            //console.dir($scope.tickets);

            allTickets = $scope.tickets;

//TODO: need to optimize...
$(window).scroll(function() {
//TODO: don't bind scroll event when the page is ticket detail .. not even blank function
if(!$state.is('Tickets.Detail'))	
{
  if($(window).scrollTop() + $(window).height() > $(document).height() - 10) {
       //$(window).unbind('scroll');
       //console.log($scope.tickets.length < $scope.$parent.ticketCounts[$scope.filterType.toUpperCase()]);

       if($scope.tickets.length < $scope.$parent.ticketCounts[$scope.filterType.toUpperCase()]) {
       	$('#loading').show();
       	$('.ticket.loading').show();
       	TicketsService.loadMore($scope, function(){
       		$('#loading').hide();
       		$('.ticket.loading').hide();
       		setTimeout($scope.populateTechGusy, 1500);
       	});
       }
     }
   }

 });


});


$scope.ActionRightsService = ActionRightsService;

$scope.MarkedSpamByRole = function(ticket) {
	
	var markedByRole = 'USER';
	
	if(ticket.spamPerformer) {
		var user = UsersService.getOneById(ticket.spamPerformer.id);
		markedByRole = user.role;
	}

	return markedByRole;
}

// Methods are used in Spam Page
$scope.isMarkedByAdmin = function(ticket) {

	if(ticket.spamPerformer) {
		var user = UsersService.getOneById(ticket.spamPerformer.id);
		return user.role === 'ADMIN';
	}
	return false;
}

$scope.isNotMarkedByAdmin = function(ticket) {
	if(ticket.spamPerformer) {
		return !$scope.isMarkedByAdmin(ticket);
	}
	return false;
}

$scope.deleteForEver = function (ticket, hide) {
	TicketsService.deleteForever(ticket.id, function () {
		notification('"' + ticket.subject + '" is deleted forever.');
	});
}

$scope.$parent.loadAll = function() {

	if($scope.searchFilter.query !== '')
	{
		$scope.searchFilter.query=''; 

		$scope.searchFilter.priority = false;
		$scope.searchFilter.status = false;

		$scope.tickets = TicketsService.getList($scope, {filter: $stateParams.listType}, function() {
			$('#loading').hide();
			$('.ticket.loading').hide();

			setTimeout(function(){
				if($state.params.id) {
					$('#listing_' + $state.params.id).addClass('active');
				}    
			}, 10);
            //console.dir($scope.tickets);

            allTickets = $scope.tickets;
          });
	}
}


//$scope.testFilter = { query : "test" };





$scope.$parent.search = function() {
            //$scope.testFilter = {query: $scope.$parent.searchFilter.query};

            if($state.current.name === 'Tickets.Detail') {
            	$('body').removeClass('opened-ticket');
            	$('#listing_' + $stateParams.id).removeClass('active');

            	$state.go('Tickets', {'listType': $stateParams.listType});
            }

            var filter = $stateParams.listType;

            var PRIORITY = ['LOW', 'MEDIUM', 'HIGH'];
            var STATUS = ['ON_HOLD', 'IN_PROGRESS', 'COMPLETED'];
            
            var query = $scope.$parent.searchFilter.query;
            var priority = $scope.$parent.searchFilter.priority;
            var status = $scope.$parent.searchFilter.status;

            var params = {
            	filter: filter
            };

            if(query !== '') {
            	params.keyword = query;
            }

            if(priority === true) {
            	params.priority = PRIORITY[$scope.$parent.searchFilter.priorityValue];
            }

            if(status === true) {
            	params.status = STATUS[$scope.$parent.searchFilter.statusValue];
            }

            $('#loading').show();
            
            $scope.tickets = TicketsService.getList($scope, params, function() {
            	$('#loading').hide();
            	$('.ticket.loading').hide();
                //$scope.$parent.ticketCounts[$scope.filterType.toUpperCase()] = $scope.tickets.length;
                setTimeout($scope.populateTechGusy, 1500); //TODO: need to optimize to load users only once...
              });
          }
/*
        $scope.filterTickets = function(priority, status){
            console.log(priority);
            console.log(status);

            function(ticket) {
                return ticket.status = status;
            }

          };*/


          $scope.getAssignToUsers = function (company) {
           $scope.currentCompanyUser = UsersService.getAllByCompanyId(company.id);
         }

         $scope.setFocus = function(ticketId) {
           setTimeout(function(){
            $('.open #assignedTo').focus();
          }, 10);
         }
            // load users to assign tasks to
            //$scope.currentCompany = ;

        /*$scope.getUsers = function() {
                $scope.$apply(function() {
                    $scope.companyUsers.push(UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id));
                });
              console.dir($scope.companyUsers);
            };*/


            //setTimeout(function(){
            //$scope.companyUsers = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);
            //console.dir($scope.companyUsers);
            //},3000
            //)

            //console.log($scope.currentCompany);

  //          console.dir($scope.companyUsers);

  $scope.$parent.uncheckAll = function() {
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
  	//console.log(ticket.id, flag);

  	TicketsService.changeSpamFlag(ticket.id, flag, function () {
  		if(event!=null){
  			$(event.target).parents('div.dropdown').removeClass('open');
  		} else {
  			$('body').removeClass('opened-ticket');
  		}

  		if(flag) {
  			notification('"' + ticket.subject + '" is moved to spam.');	
  		} else {
  			notification('"' + ticket.subject + '" restored successfully.');	
  		}
  	});

  };

  
  $scope.deleteTicket = function (event, ticket, flag) {
  	
  	TicketsService.changeTrashFlag(ticket.id, flag, function () {
  		
  		if(event!=null){
  			$(event.target).parents('div.dropdown').removeClass('open');
  		}else {
  			$('body').removeClass('opened-ticket');
  		}

  		if(flag) {
  			notification('"' + ticket.subject + '" is deleted successfully.');
  		} else {
  			notification('"' + ticket.subject + '" restored successfully.');
  		}

  	});
  };


  $scope.$parent.toggleTagState = function(id) {
    //$('input#' + id + ' ~ .intermediate').removeClass('intermediate');

    //var checkbox = $('input#' + id);
    //checkbox.attr("checked", !checkbox.attr("checked"));
  }

  $scope.postAssignTicket = function (event, ticket, user) {
   TicketsService.assignTo(ticket.id, user.id, function () {

    /*$('div#assignTicketModel').modal('hide');
    if (claimCall) {
     $('body').removeClass('opened-ticket');
   }*/

   notification('"' + ticket.subject + '" claimed by you successfully.');

 });

 };

 $scope.enableBulkAction = function (event) {
  var selectedTickets = getSelectedTickets();
  var totalSelected = 0;
  if(selectedTickets !== null && selectedTickets !== undefined) {
    totalSelected = selectedTickets.length;
  }
  if(event.target.checked) {
    $('div#bulk-actions').show();
    $('div#search-and-filter').hide();
    
    //$('.total-selected').text($(event.target).parents('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length);
    $('.total-selected').text(totalSelected);
        //TODO: need to optimize don't show on each checkbox
        //$scope.markTagsSelected();
      } else {
       var anyItemSelected = false;
       angular.forEach($scope.tickets, function (item) {
        if(item.selected === true) {
         anyItemSelected = true;
       }
     });
       if(!anyItemSelected) {
        $('div#bulk-actions').hide();
        $('div#search-and-filter').show();
      }

      //$('.total-selected').text($(event.target).parents('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length);
      $('.total-selected').text(totalSelected);
    }

    $scope.updateState();
    event.stopPropagation();
  }

                /*setTimeout(function () {
                    if ($(event.target).parents('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
                        $('div#bulk-actions').show();
                        $(event.target).parents('div.ticket').addClass('selected');
                        $('div#search-and-filter').hide();
                        $('.total-selected').text($(event.target).parents('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length);
                    } else {
                        $('div#bulk-actions').hide();
                        $(event.target).parents('div.ticket').removeClass('selected');
                        $('div#search-and-filter').show();
                    }
                  }, 100);*/

/*$scope.selectService = function (event, service) {
    $(event.target).parents('div.col-1').find('input[name=ticketUpdateService]').val(service);
    $(event.target).parents('div.col-1').removeClass('open');
  }*/

  $scope.getSelectedTicketIds = function() {
   var tickets = getSelectedTickets();
   var ids = [];
   angular.forEach(tickets, function(ticket){
    ids.push(ticket.id);
  });

   return ids;
 }

 $scope.$parent.restoreBulkTickets = function() {

   var params = $scope.getSelectedTicketIds();

	//TODO: need to improve the way the restore button is called.

	if($scope.listType === 'trash') {

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

$scope.$parent.assignUsertoBulkTickets = function() {

	var tickets = $scope.getSelectedTicketIds();
	var user = $('#bulkUserId').val();
	var fullName = $('#bulkAssignedTo').val();
	
	$('#btnShowAssignUserforBulk').trigger('click');

	TicketsService.assignTo(tickets, user, function(){

		$('#bulk-actions').hide();
		$('.ticket-nav').removeClass("bulk-actions");
		$('#search-and-filter').show();

		$scope.$parent.ticketCounts[$scope.filterType.toUpperCase()] -= tickets.length;

		notification(tickets.length + ' tickets are assigned to "' + fullName + '"');
	});


}

// TODO: use a single method for both of the following...



$scope.assignUsertoTicket = function(ticketId) {
//console.log(ticketId);

var user = $('.open #assignedToUserId').val();
var fullName = $('.open #AssignedTo').val();

$('#btnShowAssignUserforBulk').trigger('click');

TicketsService.assignTo(ticketId, user, function(){
	notification('Ticket is assigned successfully!');

    //$scope.$parent.ticketCounts[$scope.filterType.toUpperCase()]--;
  });
}




$scope.$parent.markAsBulkSpam = function (event, flag) {

	var params = $scope.getSelectedTicketIds();

	TicketsService.changeSpamFlag(params, flag, function () {
		if(event!=null){
			$(event.target).parents('div.dropdown').removeClass('open');
		} else {
			$('body').removeClass('opened-ticket');
		}

		notification( params.length + ' ticket(s) are moved to spam.');
        $scope.uncheckAll(); //TODO: improve only hide uncheck not required.... same for bulk tickets
      });
};


$scope.$parent.claimBulkTicket = function(user) {
  
  var params = $scope.getSelectedTicketIds();

  TicketsService.assignTo(params, user.id, function () {

    notification(params.length + ' ticket(s) claimed by you successfully.');


    // TODO: don't repeat the show hide code - use a different strategy
    $('#bulk-actions').hide();
    $('.ticket-nav').removeClass("bulk-actions");
    $('#search-and-filter').show();


  });

}

//console.log($scope.currentUser.role);

$scope.$parent.deleteBulkTicket = function (event, flag) {

	var params = $scope.getSelectedTicketIds();

	//TODO: need to improve the way multiple bulk delete are handled..

	if($scope.listType === 'trash') {
		TicketsService.deleteForever(params, function () {
			notification( params.length + ' ticket(s) are deleted successfully.');
		});
	} else {
		TicketsService.changeTrashFlag(params, flag, function () {
			if(event!=null){
				$(event.target).parents('div.dropdown').removeClass('open');
			}else {
				$('body').removeClass('opened-ticket');
			}
			notification( params.length + ' ticket(s) are deleted successfully.');
			$scope.uncheckAll();
		});
	}


	

};

$scope.$parent.linkTags = function() {

	var params = {};
	var tickets = getSelectedTickets();

	angular.forEach(tickets, function(ticket){

		params[ticket.id] = [];
		var counter = 0;

		angular.forEach($scope.$parent.allTags, function(tag){
			if(tag.isSelected === true) {
				params[ticket.id][counter++] = tag.id;
			}
		});
	});

	//console.dir(params);

	TicketTagsService.link(params, function () {
		notification(tickets.length + ' Ticket(s) have been tagged successfully!');
		$scope.uncheckAll();
	});  
};


$scope.markTagsSelected= function() {
    //var count = $scope.selectedTicketsCount();
    //console.log(count);
/*    var selectedTickets = getSelectedTickets();
    
    var STATE = {
        intermediate : 1,
        checked : 2
    };


    var tagsState = [];

    angular.forEach(selectedTickets , function (ticket) {

        angular.forEach(ticket.tags , function (ticketTag) {
            tagsState.push({
                ticketTag.id = 
            });
            $scope.$parent.tags[ticketTag.id].state = STATE.intermediate;
            $scope.$parent.tags[ticketTag.id].counter++;
        });
    });

    angular.forEach($scope.$parent.tags , function (tag) {
        if(selectedTickets.length === tag.counter) {
            $scope.$parent.tags[ticketTag.id].state = STATE.checked;
        }
        console.log($scope.$parent.tags[ticketTag.id].state);
    });
*/
}

$scope.updateState = function() {
	//console.log('in function');
	angular.forEach($scope.$parent.allTags, function(tag){

		tag.state = 0;
		tag.isSelected = false;

		tag.state = $scope.checkboxState(tag.id);
		
		if(tag.state === 1 || tag.state === 2) {
			tag.isSelected = true;
		}
//        console.log(tag.state);
});
}

$scope.checkboxState = function(id) {

	var selectedTickets = getSelectedTickets();
    var checkboxState = 0; //unchecked
    var count = 0;

    //console.log(selectedTickets.length);

    angular.forEach(selectedTickets, function (ticket) {
    	angular.forEach(ticket.tags , function (ticketTag) {
    		if(ticketTag.id === id) {
                checkboxState = 2;      // intermediate
                count++;
                //break;
              }
            });
    });

    if(count === selectedTickets.length) {
    	checkboxState = 1;
    }

    return checkboxState;
  }

  function getSelectedTickets() {

   var selectedTickets = [];

   angular.forEach($scope.tickets, function (item) {
    if(item.selected === true) {
     selectedTickets.push(item);
   }
 });

   return selectedTickets;
 }

// TODO: improve method name and code...
//TODO: move all methods that are used in multiple views to a service.
$scope.postTagAs = function (event, ticketId) {

  //var ticketId = $scope.tickets[index].id;

  if ($(event.target).parents('ul.tag-list').find('input[type=checkbox]:checked').length > 0) {
    var tags = $(event.target).parents('ul.tag-list').find('input[type=checkbox]:checked');
    console.dir(tags);
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

   console.dir(postData);

   TicketTagsService.link(postData, function () {
                        //$('div#labelAs').modal('hide');
                        
                        notification('Ticket has been tagged successfully.');

                        /*$('div#notificationContainer div.alert-yellow').text('Ticket has been tagged successfully.');
                        $('div#notificationContainer').show();
                        setTimeout(function () {
                            $('div#notificationContainer').hide();
                          }, 3000);*/

 });
 }
}

function notification(msg) {

	$('#loading .alert-yellow').text(msg);

	$('#loading').show();

	setTimeout(function () {
		$('#loading').fadeOut();
	}, 3000);

	setTimeout(function () {
		$('#loading .alert-yellow').text('Loading ...');
	}, 4000);

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


$scope.getStatusCSS = function (tag) {
	if (tag)
		return tag.toLowerCase();
}

$scope.expand = function (event, ticketId) {

    //console.log(event.target.className);
    if(event.target.className === 'ticket has-actions' ||
    	event.target.className === 'ticket-title clearfix' ||
    	event.target.className === 'pull-left ng-binding' ||
    	event.target.className === 'ticket-meta clearfix' ||
    	event.target.className === 'ticket-excerpt ng-binding' ||
    	event.target.className === 'company-name ng-binding'
    	)
    {
        $scope.$parent.uncheckAll();    //uncheck any elements if selected.

        $state.go('Tickets.Detail', {'id': ticketId, 'listType': $stateParams.listType});
        $('.ticket-sidebar').find('.ticket').removeClass('active');
        
        $('#listing_' + ticketId).addClass('active');
      }
    };



//TODO: fix spells and internal strucutre
$scope.populateTechGusy = function() {

	var substringMatcher = function(strs) {
		return function findMatches(q, cb) {
			var matches, substringRegex;
			matches = [];
			var substrRegex = new RegExp(q, 'i');
			$.each(strs, function(i, str) {
				if (substrRegex.test(str.firstName) || substrRegex.test(str.lastName)) {
					matches.push(str);
				}
			});
			cb(matches);
		};
	};

	var techGuys = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);
	angular.forEach(techGuys, function(guy) {
		guy.fullName = guy.firstName + ' ' + guy.lastName;
	});
//console.log(techGuys);
var selected = false;

$('#the-basics .typeahead').typeahead('destroy'); // TODO: need to optimize the code

$('#the-basics .typeahead').typeahead({hint: true, highlight: true, minLength: 0},
{
	display: 'fullName',

	templates: {
		empty: '',
		suggestion: Handlebars.compile([
			'<div><a herf="javascript:void(0);" class="pull-left avatar-26 avatar m-r">',
			'<img src="html/assets/images/avatars/a4.jpg" alt="..." class="img-circle">',
			'</a>',
			'<div class="clearfix">',
			'<div class="user-name" data-userid={{name}}><a href="javascript:void(0);">{{firstName}} {{lastName}} "{{primaryEmail}}"</a></div>',
			'</div></div>'
			].join('\n'))
	},
	name: 'techGuys',
	source: substringMatcher(techGuys)
}).on('typeahead:beforeclose', function($e) { if(!selected) {$e.preventDefault();} })

.on('typeahead:select', function($e, item){

	$('#btnBulkAssignUser').removeClass('disabled');
	$('#bulkUserId').val(item.id);

	$('.open #btnAssignUser').removeClass('disabled');
	$('.open #assignedToUserId').val(item.id);

	selected = true;
});

$('#the-basics .typeahead').focus();

$('#the-basics .typeahead').on('keyup', function(event){

	if(event.which !== 13) {
		$('#btnBulkAssignUser').addClass('disabled');
		$('#btnAssignUser').addClass('disabled');
		selected = false;
	}

	if(event.which === 13 && selected) {
    //alert('enter pressed!');
  }

});

//console.log('settimeout called..');
}



setTimeout($scope.populateTechGusy, 1800);


                //$('ul.dropdown-status').parents('div.ticket-status').removeClass('open');

                //$scope.ticketDetail = TicketsService.getOne(ticket.id, $scope, true);
                //$('body').addClass('opened-ticket');

//                $('.datetimepicker').datetimepicker({
//                    format: 'MM/DD/YYYY'
//                });
                //$('.ticket-sidebar').find('.ticket').removeClass('active');
                //$(event.target).parents('.ticket').addClass('active');
            //};

            prepareTicketsModule();

            $scope.filterType = filter;

            if (filter == 'spam') {
            	$scope.reportedtickets = $scope.tickets;
            }

            if (filter === 'user')
            	filter = 'My Tickets';

            filter = filter && filter[0].toUpperCase() + filter.slice(1)

            $scope.$parent.panelTitle = filter;

          }]
          )

})(window, jQuery);