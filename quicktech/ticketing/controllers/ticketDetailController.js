'use strict';

/* Controllers */
(function (window, $, undefined) {
	var app = angular.module('quicktech.ticketing');


	app.filter('numberFixedLen', function () {
		return function (n, len) {
			var num = parseInt(n, 10);
			len = parseInt(len, 10);
			if (isNaN(num) || isNaN(len)) {
				return n;
			}
			num = ''+num;
			while (num.length < len) {
				num = '0'+num;
			}
			return num;
		};
	});


	app.controller('TicketDetailController', ['$scope', 'TicketsService', '$stateParams', '$state','$rootScope',
		'$location', 'ActionRightsService', 'Downloader', 'UsersService', 'ServicesService', 
		'CompaniesService', 'smoothScroll', 'ProductsService',
		function ($scope, TicketsService, $stateParams, $state, $rootScope, $location, 
			ActionRightsService, Downloader, UsersService, ServicesService, CompaniesService,
			smoothScroll, ProductsService) {

			//$(window).unbind('scroll'); // TODO: Attach event again when going back to tickets page.

			// Actions Rights Service to be used to show/hide actions
			$scope.ActionRightsService = ActionRightsService;

			$scope.listType = $stateParams.listType;

			$scope.isUpdateEmpty = false;

			$scope.allUpdatesLoaded = false;


			$scope.ticketUpdate = {};

			$scope.productFilter = {
				query: ''
			};

			$scope.product = {};
			

			$scope.selectProduct = function($event, product, $index){
				
				$event.preventDefault();

				if($index == -1) {
					$scope.product.name = product.name;
					$scope.product.id = product.versionedId.id;
					$scope.product.sale = product.sale;	
				} else {
					$scope.products[$index].item.name = product.name;
					$scope.products[$index].item.versionedId.id = product.versionedId.id;
					$scope.products[$index].sum = product.sale;
				}
				
			}

			$scope.searchProduct = function(product) {
				
				var q = $scope.productFilter.query.toLowerCase();

				if (product.name.toLowerCase().indexOf(q)!=-1) {
					return true;
				}

				return false;
			}

			if($stateParams.id === '') {
				$state.go('Tickets', {'listType': $stateParams.listType});
			}

			$('body').addClass('opened-ticket');

			$scope.ticketDetail = TicketsService.getOne($stateParams.id, $scope, true, function(){
				$('#loading').hide();
				$('.ticket-content').fadeIn();
				$scope.isTagChecked	= function(id) {
					for(var i=0; i< $scope.ticketDetail.tags.length; i++) {
						if($scope.ticketDetail.tags[i].id === id) return true;
					}
					return false;
				}
				//console.dir($scope.ticketDetail.updates);
			});

			/*$scope.setUpdatable = function() {
				$scope.isUpdateEmpty = true;
			}*/

			// Show scroll for ticket list...
			$(window).scroll(function() {
				var height = $('body').scrollTop();
				var width=$(window).width();
				var ticketListWidth =$(".tickets-list").width()+1;
				var ticketHeaderW=$(".ticket-content .ticket-header > div").width();

				if(height == "0") {
					$(".ticket-content .ticket-header > div").removeClass('ticket-fixed-header');
					$(".ticket-content .ticket-header > h3").css("margin-Top","10px");
					$(".ticket-content .ticket-header > div").css("width","");
				} else 
				if (height > "180") {
					$(".ticket-content .ticket-header > div").addClass('ticket-fixed-header');
					$(".ticket-content .ticket-header > h3").css("margin-Top","49px");
				}

			});

			// Inherit the code from parent to be used in template
			$scope.currentUser = $scope.$parent.currentUser;
			$scope.ticketMarkedSpamByRole = $scope.$parent.ticketMarkedSpamByRole;
			
			$scope.updateType = 'NOTE';

			// show the tab while adding a new update
			$scope.activateTab = function($event, type) {
				$event.preventDefault();
				//$event.stopPropagation();
				$(this).tab('show');
				$scope.updateType = type;
				//console.log($scope.updateType);
			}
			
			// ------------------------------- Service Update -------------------------------------
			
			$scope.service = {};
			$scope.service.selectedHour = null;
			$scope.service.selectedMin = null;

			$scope.serviceMeta = {};
			$scope.serviceMeta.hours = [1, 2, 3, 4, 5, 6];
			$scope.serviceMeta.minutes = [5, 10, 15, 20, 25, 30];

			$scope.productTotalAmount = 0;

			// saved services
			$scope.services = [];
			
			$scope.products = [];

			$scope.addProduct = function() {
				var newProduct = {
					item : {
						versionedId : {
							id : $scope.product.id
						},
						name : $scope.product.name
					},
					description : $scope.product.desc,
					sum : $scope.product.sale,
					quantity : $scope.product.qty
				};

				$scope.products.push(newProduct);

				$scope.productTotalAmount += parseInt($scope.product.sale) * parseInt($scope.product.qty);
				
				$scope.product.id = null;
				$scope.product.name =  null;
				$scope.product.desc =  null;
				$scope.product.sale =  null;
				$scope.product.qty =  null;

			}

			// add a new service in update
			$scope.serviceMeta.AddService = function() {

				if($scope.service.type === null || $scope.service.HourMin === null ||
					$('#datetimepicker1').val() === '' || $scope.service.desc === null) {
					
					alert('Please fill in all the fields.');
				return;
			}

			var newService = {
				type: $scope.service.type,
				HourMin: $scope.service.HourMin,
				selectedMin : $scope.service.selectedMin,
				selectedMinText : $scope.service.selectedMinText,
				selectedHour : $scope.service.selectedHour,
				selectedHourText : $scope.service.selectedHourText,
				date: $('#datetimepicker1').val(),
				desc: $scope.service.desc
			};

			$scope.services.push(newService);

				// attach event to the current row calendar
				var currentIndex = $scope.services.length - 1;
				setTimeout(function(){
					var elName = '#dtpicker_' + currentIndex;
					$(elName).datetimepicker({
						keepOpen: true,
						format: 'DD MMM YYYY',
						maxDate: new Date()
					}).on('dp.change', function(ev){
						$(elName).blur();
					});

				}, 1000);

				// Clear the row where the data was added
				$scope.service.type ='';
				$scope.service.HourMin = '';
				$('#datetimepicker1').val('');
				$scope.service.desc = '';
				$scope.service.selectedMin = null;
				$scope.service.selectedMinText = '';
				$scope.service.selectedHour = null;
				$scope.service.selectedHourText = '';
			}

			// remove the service from the list
			$scope.serviceMeta.removeService= function($index) {
				$scope.services.splice($index, 1);
			}

			// set the time for the service - TODO: improve use a directive for this type of input
			$scope.setTime = function($event, t, $index) {
				var el = $($event.target);

				if($index == -1) {
					switch(t) {
						case 'hour' :
					$scope.service.selectedHourText = el.text(); // For Display Purpose
					$scope.service.selectedHour = parseInt($scope.service.selectedHourText); // For comparing purpose in template
					break;
					case 'min' :
					$scope.service.selectedMinText = el.text();
					$scope.service.selectedMin = parseInt($scope.service.selectedMinText);
					break;
				}

				if($scope.service.selectedHour !== null && $scope.service.selectedMin !=null) {
					$scope.service.HourMin = $scope.service.selectedHourText + ':' + $scope.service.selectedMinText;
					$event.preventDefault();
				} else {
					$event.preventDefault();
					$event.stopPropagation();
				}

			} else {
				switch(t) {
					case 'hour' :
					console.log($index);
					//console.dir($scope.services[$index]);
					$scope.services[$index].selectedHourText = el.text(); // For Display Purpose
					$scope.services[$index].selectedHour = parseInt($scope.services[$index].selectedHourText); // For comparing purpose in template
					break;
					case 'min' :
					$scope.services[$index].selectedMinText = el.text();
					$scope.services[$index].selectedMin = parseInt($scope.services[$index].selectedMinText);
					break;
				}

				if($scope.services[$index].selectedHour && $scope.services[$index].selectedMin) {
					$scope.services[$index].HourMin = $scope.services[$index].selectedHourText + ':' + $scope.services[$index].selectedMinText;						
					$event.preventDefault();
				} else {
					$event.preventDefault();
					$event.stopPropagation();
				}
			}

		}


		//---------------------- Users --------------------------------------------------

		var allUsers = UsersService.getAllUsers();

		$scope.tech_users = [];
		$scope.vendor_users = [];
		$scope.client_users = [];

		setTimeout(function(){
			angular.forEach(allUsers, function(user){
				//console.log(user.accountType);
				if(user.accountType === 'CLIENT') {
					$scope.client_users.push(user);
				} else if(user.accountType === 'TECH') {
					$scope.tech_users.push(user);
				} else if(user.accountType === 'VENDOR') {
					$scope.vendor_users.push(user);
				}
			});	
		}, 1000); //TODO: find a better way to load users...
		
		// update users

		$scope.update_users = [];
		//$scope.update_user_mapping = {};

		$scope.addUsertoUpdate = function(user) {
			//console.log(user.isSelected);

			if(user.isSelected) {

				var isAlreadyAdded = false;
				
				for (var i = 0; i < $scope.update_users.length; i++) {
					if ($scope.update_users[i].id === user.id) {
						isAlreadyAdded = true;
					}
				}
				
				if(isAlreadyAdded === false) {
					$scope.update_users.push(user);	
				}
				
				//$scope.update_user_mapping[user.id] = $scope.update_users.length - 1;
			} else {
				//var index = $scope.update_user_mapping[user.id];
				for (var i = 0; i < $scope.update_users.length; i++) {
					if ($scope.update_users[i].id === user.id) {
						$scope.update_users.splice(i, 1);
					}
				}
				
			}	
			
			
		}

		/*$scope.agent = {};
		$scope.agent.tech = '';
		$scope.agent.vendor = '';
		
		$scope.client = {};
		$scope.client.user = '';*/
		$scope.userFilter = {};
		$scope.userFilter.query = '';

		/*$scope.$watch('userFilter.query', function(query) {
			$scope.query = query;
		});*/


$scope.searchUser = function() {
	$scope.userQuery = {query: $scope.userFilter.query};
}

		// TODO: optimize to use single base function...

		/*$scope.searchTechUser = function (user){
			//var query = $scope.agent.tech.toLowerCase();
			//var q = query.toLowerCase();
			var q = $scope.query.toLowerCase();
			console.log(q);
			if (user.firstName.toLowerCase().indexOf(q)!=-1 || user.lastName.toLowerCase().indexOf(q)!=-1) {
				return true;
			}
			return false;
		};

		$scope.searchVendorUser = function (user){
			//var query = $scope.agent.vendor.toLowerCase();
			//var q = query.toLowerCase();
			var q = $scope.query.toLowerCase();
			console.log(q);
			if (user.firstName.toLowerCase().indexOf(q)!=-1 || user.lastName.toLowerCase().indexOf(q)!=-1) {
				return true;
			}
			return false;
		};

		

		$scope.searchClientUser = function (user){
			//var q = $scope.client.user.toLowerCase();
			
			//var q = $scope.userFilter.query.toLowerCase();
			var q = $scope.query.toLowerCase();
			console.log(q);

			if (user.firstName.toLowerCase().indexOf(q)!=-1 || user.lastName.toLowerCase().indexOf(q)!=-1) {
				return true;
			}
			return false;
		};
		
		//$scope.agentQuery = '';

		/*$scope.userSearch = function(user) {
			console.log($scope.agentQuery);
			if($scope.agentQuery) {
				var agentQuery = $scope.agentQuery.toLowerCase(),

				fullname = user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase();

				if (fullname.indexOf(agentQuery) != -1) {
					return true;
				}

				return false;
			}

			return true;

		}*/

		$scope.getUserType = function(accountType) {
			if(accountType === 'TECH') {
				return "Team Member";
			} else if(accountType=== 'CLIENT') {
				return "Client";
			} else if(accountType === 'VENDOR') {
				return "Vendor";
			}
		}

		// Misc Stuff

			// TODO: impove method name...
			$scope.postAssignTicket = function (event, ticket, user) {
				$scope.$parent.postAssignTicket(event, ticket, user);
				$scope.collapse();
			}



			$scope.canBeReOpened = function(createdAt) {

				// get the date before thirty days
				var d = new Date();
				d.setDate(d.getDate()-30);
				
				// ticket can be re-opened if created within last thrity days
				return new Date($scope.ticketDetail.createdAt) > d ;
			}

			$scope.postTagAs = function (event, ticketId) {
				$scope.$parent.postTagAs(event, ticketId);
				$('#btnTicketSettings').trigger('click');
			}

			$scope.getFileType = function(contentType) {
				if(contentType === 'image/jpeg') return 'jpg';
			}

			$scope.deleteUpdate = function(ticketId, updateId) {
				if(confirm('Do you really want to delete the update?'))
				{
					TicketsService.deleteTicketUpdate(ticketId, updateId, function(){
						$scope.$parent.notification('Updated deleted successfully!');
					});
				}
			}

			$scope.markAsClosed = function (event, ticket) {
				TicketsService.changeStatus(ticket.id, 'COMPLETED', function () {
					$scope.$parent.notification('"' + ticket.subject + '" is closed successfully.');
					$scope.collapse();
				});
			}; 

			$scope.markAsOpen = function (event, ticket) {
				TicketsService.changeStatus(ticket.id, 'IN_PROGRESS', function () {
					$scope.$parent.notification('"' + ticket.subject + '" is successfully marked as open.');
					$scope.collapse();
				});
			}; 

			$scope.getUserNameById = function(actionUser) {

				if(actionUser !== undefined && actionUser !== null) {

					if(actionUser.id === $scope.currentUser.id) return "You";

					var user = UsersService.getOneById(actionUser.id);
					var userName = user.firstName + ' ' + user.lastName;

					return userName;	
				}

			}

			$scope.assignUsertoTicketDetailed = function(ticketId) {

				var user = $('.dropdown-submenu-wrapper #assignedToUserId').val();
				var fullName = $('.dropdown-submenu-wrapper #AssignedTo').val();

				$('#btnTicketSettings').trigger('click');

				TicketsService.assignTo(ticketId, user, function(){
					$scope.$parent.notification('Ticket is assigned successfully!');
					$scope.collapse();
				});
			}

			// TODO: check why delete ticket working without this function....
			$scope.deleteTicket = function (event, ticket, flag) {
				$scope.$parent.deleteTicket(event, ticket, flag);
				$scope.collapse();
			}

			$scope.collapse = function() {
				//$window.history.back();
				
				$('body').removeClass('opened-ticket');
				$('#listing_' + $stateParams.id).removeClass('active');

				$state.go('Tickets', {'listType': $stateParams.listType});
			}

			$scope.downloadAllAttachments = function(ticketId) {
				//console.log(ticketId);
				Downloader.downloadTicketAttachments(ticketId);
			}

			$scope.downloadFile = function(fileId) {
				//console.log(fileId);
				Downloader.downloadFile(fileId);
			}


			$scope.$on('$viewContentLoading', 
				function(event, viewConfig){ 
					$('#loading').show();
				});

			$scope.$on('$viewContentLoaded', 
				function(event){ 

					$('.ticket-content').hide();

					$(document).on('mouseenter', '#detailAssignTicketTo', function() {
						$('.dropdown-submenu-wrapper #assignedTo').focus();
					});


					$(document).on('click', '.dropdown-menu-services > li > a', function(e) {
						e.preventDefault();
						var selText = $(this).text();
						$(this).parents('.add-service').find('input.dropdown-toggle:first').val(selText);
						$scope.service.type = selText;
					});

					setTimeout(function(){
						$('#datetimepicker1').datetimepicker({
							keepOpen: true,
							format: 'DD MMM YYYY',
							maxDate: new Date()
						}).on('dp.change', function(ev){
							$('#datetimepicker1').blur();
						});


						$('.dropdown-menu-tabs a[data-toggle="tab"]').click(function (e) {
							e.preventDefault();
							e.stopPropagation();        
							
							$(this).tab('show');
						});

					}, 2000);


					$scope.productCategories = ProductsService.getCategories($scope, function(){
						if($scope.productCategories.length > 0) {
							var category = $scope.productCategories[0];
							$scope.loadCategoryProducts(null, category);
						}
					});

				});

$scope.catProducts = [];

$scope.loadCategoryProducts = function($event, category) {
	
	if($event !== null) {
		$event.preventDefault();
		$event.stopPropagation();	
	}

	if(category.isSelected) return;

	var catId = category.id;

	angular.forEach($scope.productCategories, function(category){
		if(category.id == catId) {
			category.isSelected = true;
		} else {
			category.isSelected = false;
		}
	});

	$scope.catProducts = ProductsService.getAllByCategory($scope, catId, function(){
		//console.dir($scope.catProducts);
	});
}

$scope.renderDateTime = function (time) {

	var d = new Date(time);

	if ( Object.prototype.toString.call(d) === "[object Date]" ) {
		if ( isNaN( d.getTime() ) );
		else {
			return d.toUTCString();
		}
	}

}

$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) { 

	if(toParams.id === fromParams.id) {
		event.stopPropagation();
	}

	$('#listing_' + $stateParams.id).removeClass('active');

	if(toParams.id === undefined) {
		$('body').removeClass('opened-ticket');
	}

});


$scope.getUpdateClass = function(updateType) {
	switch(updateType) {
		case 'NOTE':
		return 'icn-update-message';
		case 'SERVICE':
		return 'icn-update-service';
		case 'PRODUCT':
		return 'icn-update-product'
	}
}

$scope.getUpdateName = function(updateType) {
	switch(updateType) {
		case 'NOTE':
		return 'Note';
		case 'SERVICE':
		return 'Service';
		case 'PRODUCT':
		return 'Product'
	}
}

$scope.getUserFullNameById = function (userId) {
	var user = UsersService.getOneById(userId);
	if (user) {
		var firstName = user.firstName != undefined ? user.firstName : '';
		var lastName = user.lastName != undefined ? user.lastName : '';

		return firstName + ' ' + lastName;
	}
}

$scope.getlastName = function (userId) {
	var user = UsersService.getOneById(userId);
	if (user)
		return 
}

$scope.loadMoreUpdates = function(ticket) {

	$('#loading').show();

	TicketsService.loadRemainingTicketUpdates(ticket, function(){
		$('#loading').hide();
		$scope.allUpdatesLoaded = true;
	});

}

$scope.postTicketUpdate = function (event, ticketId) {

	event.preventDefault();

	var ticketUpdate = {};

	var note = '';

	ticketUpdate.products = [];
	ticketUpdate.services = [];
	ticketUpdate.attachments = [];
	ticketUpdate.sharedBetween = [];

	ticketUpdate.type = $scope.updateType;

				//var $ctrlDiv = $('div.add-' + type.toLowerCase());
				console.log($scope.updateType);
				if ($scope.updateType == 'NOTE') {
					ticketUpdate.note = $scope.ticketUpdate.note;
					//TODO: file uploading here...
					//note = $('div#tab-add-note').find('textarea[name=ticketUpdateNote]').val();
				} else if ($scope.updateType == 'SERVICE') {

					var count = 0;

					angular.forEach($scope.services, function(item){
						
						ticketUpdate.services[count] = {
							description : item.desc,
							//time : item.HourMin,
							///type : item.type,
							date : new Date(item.date).getTime()
						}

						//console.dir(ticketUpdate.services[count]);

						count++;
					});

				} else {

					ticketUpdate.products = $scope.products;
				}
                /*update.note = note;
                $('input[name=attachmentId]').each(function (i, entry) {
                	update.attachments[i] = {};
                	update.attachments[i].file = {};
                	update.attachments[i].file.id = entry.value;
                });*/

                //update.sharedBetween = [];
                
                /*var sharedWith = $('.ticket-actions-footer .control').find('input[type=checkbox]:checked');
                var sharedUsers = $('input[name=sharedUsers]:checked');
                update.sharedBetween = [];
                if (sharedUsers.length > 0) {
                	sharedUsers.each(function (i, ctrl) {
                		update.sharedBetween.push({"id": ctrl.value});

                	});
                }

                if (sharedWith.length > 0) {
                	sharedWith.each(function (i, ctrl) {
                		update.sharedBetween.push({"id": ctrl.value});

                	});
}*/
angular.forEach($scope.update_users, function(user){
	ticketUpdate.sharedBetween.push({"id" : user.id});	
});

TicketsService.saveTicketUpdate(ticketId, ticketUpdate, false, function () {

	//console.dir(ticketUpdate);

	$scope.$parent.notification('Update added successfully!');

	var element = document.getElementById('ticketUpdates');
	
	var options = {
		offset: 90,
		callbackAfter: function(element) {
			//#ffecb3
		}
	};
	
	smoothScroll(element, options);

	

                	/*$('div#tab-add-note').find('textarea[name=ticketUpdateNote]').val('');
                	$('ul.note-attachments li').remove();

                	var i = $ctrlDiv.length;
                	for (var c = 0; c < i; c++) {
                		if (c > 0) {
                			$ctrlDiv[0].remove();
                		} else {
                			$('input[name=ticketUpdateDescription]').val('');
                			$('input[name=ticketUpdateTime]').val('');
                			$('input[name=ticketUpdateService]').val('');
                			$('input[name=ticketUpdateDate]').val('');
                			$('input[name=product-name]').val('');
                			$('input[name=product-ids]').val('');
                			$('input[name=product-desc]').val('');
                			$('input[name=product-amount]').val('');
                			$('input[name=product-qty]').val('');
                		}
                	}
                	$('div#notificationContainer div.alert-yellow').text('Ticket updated added successfully.');
                	$('.ticket-actions-footer .control').find('input[type=checkbox]:checked').prop('checked', '');
                	setTimeout(function () {
                		$('div#notificationContainer').hide();
                	}, 3000);*/
});
};

}]);
}(window, jQuery));