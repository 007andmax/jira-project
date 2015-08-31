'use strict';

/* Controllers */
(function (window, $, undefined) {
  var app = angular.module('quicktech.core.tickets');

  app.filter('numberFixedLen', function () {
    return function (n, len) {
      var num = parseInt(n, 10);
      len = parseInt(len, 10);
      if (isNaN(num) || isNaN(len)) {
        return n;
      }
      num = '' + num;
      while (num.length < len) {
        num = '0' + num;
      }
      return num;
    };
  });

  app.controller('TicketDetailController', ['$scope', 'TicketsService', '$stateParams', '$state', '$rootScope',
    '$location', 'ActionRightsService', 'Downloader', 'ServicesService', 'UsersService',
    'CompaniesService', 'ProductsService', 'FilesService',
    function ($scope, TicketsService, $stateParams, $state, $rootScope, $location,
              ActionRightsService, Downloader, ServicesService, UsersService, CompaniesService,
              ProductsService, FilesService) {

      //$(window).unbind('scroll'); // TODO: Attach event again when going back to tickets page.

      $scope.ActionRightsService = ActionRightsService;
      $scope.listType = $stateParams.listType;
      $scope.allUpdatesLoaded = false;
      $scope.ticketUpdate = {};
      $scope.ticketUpdate.note = '';

      //var UsersService = $scope.$parent.UsersService;

      $scope.productFilter = {
        query: ''
      };

      $scope.canUserDeleteUpdate = function (update) {

        var isUpdateCreator = false;

        if (update.user !== undefined)
          isUpdateCreator = $scope.currentUser.id === update.user.id;

        if ($scope.isOwnerOrAdmin() || isUpdateCreator) return true;

        return false;
      }


      $scope.cannotDeleteUpdate = function (update) {
        return !$scope.canUserDeleteUpdate(update)
      };

      $scope.deleteUpdate = function (update) {
        // ticket owner, ticket update creator and admin can delete ticket update
        if ($scope.listType === 'closed' ||
          $scope.listType === 'trash' ||
          $scope.listType === 'spam' || !$scope.canUserDeleteUpdate(update))
          return;

        if (confirm('Do you really want to delete the update?')) {
          TicketsService.deleteTicketUpdate($scope.ticketDetail.id, update.id, function () {
            $scope.$parent.notification('Updated deleted successfully!');
          });
        }
      }

      $scope.product = {};

      $scope.isOwnerOrAdmin = function () {
        // only owner/admin of the ticket can edit service and product expenses
        var isOwner = false;
        if ($scope.ticketDetail.assignedTo !== undefined)
          isOwner = $scope.currentUser.id === $scope.ticketDetail.assignedTo.id;

        return isOwner || $scope.currentUser.role === 'ADMIN';
      }

      $scope.isNotOwnerAndAdmin = function () {
        return !$scope.isOwnerOrAdmin();
      }

      $scope.showEditMode = function (product) {


        if ($scope.listType == 'closed' ||
          $scope.listType === 'trash' ||
          $scope.listType === 'spam' || !$scope.isOwnerOrAdmin())
          return;

        angular.forEach($scope.ticketDetail.updates, function (update) {
          angular.forEach(update.products, function (product) {
            if (product.editMode === true) {
              product.editMode = undefined;
            }
          });
        });

        product.editMode = true;

        $scope.editProduct = product.staticCopy();
      }

      $scope.showServiceEditMode = function (service) {
        // only owner of the ticket can edit service and product expenses
        if ($scope.listType === 'closed' ||
          $scope.listType === 'trash' ||
          $scope.listType === 'spam' || !$scope.isOwnerOrAdmin())
          return;

        angular.forEach($scope.ticketDetail.updates, function (update) {
          angular.forEach(update.services, function (service) {
            if (service.editMode === true) {
              service.editMode = undefined;
            }
          });
        });

        service.editMode = true;

        //console.log(service);

        $scope.editService = {
          item: {
            name: service.item.name
          },
          HourMin: service.HourMin,
          description: service.description,
          quantity: service.quantity,
          billableQuantity: service.billableQuantity,
          date: service.date
        };


        $scope.editService.date = $scope.getFormattedDate($scope.toUTCDate($scope.editService.date));
        $scope.editService.HourMin = $scope.getTimeinFormat($scope.editService.quantity);

        var splitTime = $scope.editService.HourMin.split(':');

        $scope.editService.selectedHourText = splitTime[0];
        $scope.editService.selectedHour = parseInt(splitTime[0]);
        $scope.editService.selectedMinText = splitTime[1];
        $scope.editService.selectedMin = parseInt(splitTime[1]);

        setTimeout(function () {
          $('#datetimepicker2').datetimepicker({
            keepOpen: true,
            format: 'DD MMM YYYY',
            maxDate: new Date()
          }).on('dp.change', function (ev) {
            $('#datetimepicker2').blur();
            $scope.editService.date = $('#datetimepicker2').val();
          });
        }, 500)

      }

      $scope.deleteForEver = function (ticket) {
        TicketsService.deleteForever(ticket.id, function () {
          $scope.$parent.notification('"' + ticket.subject + '" is deleted forever.');
          $scope.collapse();
        });
      }

      $scope.selectProductForEdit = function ($event, product, $index, updateIndex) {

        $scope.editProduct.item.name = product.name;
        $scope.editProduct.item.versionedId = {id: product.versionedId.id};
        $scope.editProduct.sum = product.sale;
      }

      $scope.selectProduct = function ($event, product, $index) {

        $event.preventDefault();

        if ($index == -1) {
          $scope.product.name = product.name;
          $scope.product.id = product.versionedId.id;
          $scope.product.sale = product.sale;
          //$scope.product.desc = product.description;
        } else {
          $scope.products[$index].item.name = product.name;
          $scope.products[$index].item.versionedId.id = product.versionedId.id;
          $scope.products[$index].sum = product.sale;
        }

      }

      $scope.lowerCaseWithOutUnderScore = $scope.$parent.lowerCaseWithOutUnderScore;

      /*$scope.getUserMessage = function() {
       // TODO: create directive for this... MUST

       var msg = '';

       var assignPerformer = $scope.ticketDetail.assignPerformer !== undefined ? $scope.ticketDetail.assignPerformer.id : 0;
       var assignedUser = $scope.ticketDetail.assignedUser !== undefined ? $scope.ticketDetail.assignedUser.id : 0;
       var currentUser = $scope.currentUser.id;
       var isReassigned = $scope.ticketDetail.isReassigned;
       var assignedAt = $scope.renderDateTime($scope.ticketDetail.assignedAt);

       var subject = '<strong>You</strong>';
       var action = 'claimed';
       var this_ticket = 'this ticket';
       var on = 'on';
       var to = 'to';

       if(assignPerformer === currentUser && assignedUser === currentUser) {
       msg = [subject, action, this_ticket, on, assignedAt].join(' ');
       } else if (assignPerformer === currentUser && assignedUser !== currentUser) {
       if(isReassigned) {
       action = 're-assigned';
       msg = [subject, action, this_ticket, to, '<strong>',
       $scope.getUserNameById(assignedUser), '</strong>',
       on, assignedAt].join(' ');
       } else {
       action = 'assigned';
       msg = [subject, action, this_ticket, to, '<strong>',
       $scope.getUserNameById(assignedUser), '</strong>',
       on, assignedAt].join(' ');
       }
       } else if (assignPerformer !== currentUser && assignedUser !== currentUser) {
       subject = '<strong>' + $scope.getUserNameById(assignedUser) + '</strong>';
       }
       }

       return msg;
       }*/

      $scope.markAsSpam = function (event, ticket, flag) {
        $scope.$parent.markAsSpam(event, ticket, flag);
        $scope.collapse();
      }

      $scope.changeStatus = function (event, ticket, status, filterType) {
        $scope.$parent.changeStatus(event, ticket, status, filterType);
        $scope.$parent.notification('Ticket status updated successfully!');
      }

      $scope.searchProduct = function (product) {

        var q = $scope.productFilter.query.toLowerCase();

        if (product.name.toLowerCase().indexOf(q) != -1) {
          return true;
        }

        return false;
      }

      $scope.getFirstName = function (userId) {
        var user = UsersService.getOneById(userId);
        if (user)
          return user.firstName != undefined ? user.firstName : '';
      }

      $scope.getLastName = function (userId) {
        var user = UsersService.getOneById(userId);
        if (user)
          return user.lastName != undefined ? user.lastName : '';
      }

      if ($stateParams.id === '') {
        $state.go('Tickets', {'listType': $stateParams.listType});
      }

      $('body').addClass('opened-ticket');

      $scope.updateService = function (updateIndex, serviceIndex) {
        var update = $scope.ticketDetail.updates[updateIndex].staticCopy();

        angular.forEach(update.services, function (service) {
          delete service.editMode;
        });

        //console.dir($scope.editService);

        update.services[serviceIndex].quantity = $scope.getTimeinPoints($scope.editService.selectedHour,
          $scope.editService.selectedMin);
        update.services[serviceIndex].billableQuantity = $scope.getTimeinPoints($scope.editService.selectedHour,
          $scope.editService.selectedMin);

        //console.log($scope.editService.date);

        update.services[serviceIndex].date = $scope.toUTCDate($scope.editService.date);
        update.services[serviceIndex].description = $scope.editService.description;
        update.services[serviceIndex].item.name = $scope.editService.item.name;

        update.services[serviceIndex].updatedAt = new Date();
        update.updatedAt = new Date();

        // hack!
        update.services[serviceIndex].createdAt = new Date(update.services[serviceIndex].createdAt);

        //console.dir(update);

        TicketsService.saveTicketUpdate($scope.ticketDetail.id, update, false, function () {
          $scope.$parent.notification('Update changed successfully!');
          $scope.editService = {};
          $scope.ticketDetail.updates[updateIndex].services[serviceIndex].editMode = undefined;
        });

      }

      $scope.updateProduct = function (updateIndex, productIndex) {

        var update = $scope.ticketDetail.updates[updateIndex].staticCopy();

        angular.forEach(update.products, function (product) {
          delete product.editMode;
        });

        //console.log($scope.editProduct.description);

        update.products[productIndex].quantity = $scope.editProduct.quantity;
        update.products[productIndex].sum = $scope.editProduct.sum;
        update.products[productIndex].description = $scope.editProduct.description;

        update.products[productIndex].item.name = $scope.editProduct.item.name;
        update.products[productIndex].item.versionedId.id = $scope.editProduct.item.versionedId.id;
        update.products[productIndex].item.updatedAt = new Date();

        //console.dir(update);

        TicketsService.saveTicketUpdate($scope.ticketDetail.id, update, false, function () {
          $scope.$parent.notification('Update changed successfully!');
          $scope.editProduct = {};
          $scope.ticketDetail.updates[updateIndex].products[productIndex].editMode = undefined;
        });

      }

      $scope.ticketDetail = TicketsService.getOne($stateParams.id, $scope, true, function () {
        $('#loading').hide();
        $('.ticket-content').fadeIn();

        $scope.isTagChecked = function (id) {
          for (var i = 0; i < $scope.ticketDetail.tags.length; i++) {
            if ($scope.ticketDetail.tags[i].id === id) return true;
          }
          return false;
        }

        $scope.companyServices = ServicesService.getAllByCompany($scope, $scope.ticketDetail.company.id,
          function () {
            // console.dir($scope.companyServices);
          });

        //console.dir($scope.ticketDetail);

      });


      $(window).scroll(function () {
        var height = $('body').scrollTop();
        var width = $(window).width();
        var ticketListWidth = $(".tickets-list").width() + 1;
        var ticketHeaderW = $(".ticket-content .ticket-header > div").width();

        if (height == "0") {
          $(".ticket-content .ticket-header > div").removeClass('ticket-fixed-header');
          $(".ticket-content .ticket-header > h3").css("margin-Top", "10px");
          $(".ticket-content .ticket-header > div").css("width", "");
        } else if (height > "180") {
          $(".ticket-content .ticket-header > div").addClass('ticket-fixed-header');
          $(".ticket-content .ticket-header > h3").css("margin-Top", "49px");
        }

      });

      // Inherit the code from parent to be used in template
      $scope.currentUser = $scope.$parent.currentUser;
      $scope.ticketMarkedSpamByRole = $scope.$parent.ticketMarkedSpamByRole;

      $scope.updateType = 'NOTE';

      // show the tab while adding a new update
      $scope.activateTab = function ($event, type) {
        $event.preventDefault();
        //$event.stopPropagation();
        $(this).tab('show');
        $scope.updateType = type;
        //console.log($scope.updateType);
      }

      // ------------------------------- Service Update -------------------------------------


      $scope.service = {};
      $scope.service.id = 0;
      $scope.service.name = '';
      $scope.service.selectedHour = null;
      $scope.service.selectedMin = null;
      $scope.serviceMeta = {};
      $scope.serviceMeta.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      $scope.serviceMeta.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      $scope.productTotalAmount = 0;

      // saved services
      $scope.services = [];
      $scope.products = [];
      $scope.files = [];


      $scope.addProduct = function () {

        if ($scope.product.qty == undefined) $scope.product.qty = 1;

        var newProduct = {
          item: {
            versionedId: {
              id: $scope.product.id
            },
            name: $scope.product.name
          },
          description: $scope.product.desc,
          serialNumber: new Date().getTime(),
          date: new Date(),
          quantity: $scope.product.qty,
          sum: $scope.product.sale
        };

        $scope.products.push(newProduct);

        $scope.productTotalAmount += parseInt($scope.product.sale) * parseInt($scope.product.qty);

        $scope.product.id = null;
        $scope.product.name = null;
        $scope.product.desc = null;
        $scope.product.sale = null;
        $scope.product.qty = null;

        // $scope.changeProductServiceScrollbarVisibility('PRODUCT');
      }

      // add a new service in update
      $scope.serviceMeta.AddService = function () {

        if ($scope.service.type === null || $scope.service.HourMin === null ||
          $('#datetimepicker1').val() === '' || $scope.service.desc === null) {

          alert('Please fill in all the fields.');
          return;
        }

        //console.log($scope.service.id);

        var newService = {
          id: $scope.service.id,
          name: $scope.service.name,
          item: $scope.service.item,
          HourMin: $scope.service.HourMin,
          selectedMin: $scope.service.selectedMin,
          selectedMinText: $scope.service.selectedMinText,
          selectedHour: $scope.service.selectedHour,
          selectedHourText: $scope.service.selectedHourText,
          date: $('#datetimepicker1').val(),
          desc: $scope.service.desc
        };

        $scope.services.push(newService);

        // attach event to the current row calendar
        var currentIndex = $scope.services.length - 1;
        setTimeout(function () {
          var elName = '#dtpicker_' + currentIndex;
          $(elName).datetimepicker({
            keepOpen: true,
            format: 'DD MMM YYYY',
            maxDate: new Date()
          }).on('dp.change', function (ev) {
            $(elName).blur();
          });

        }, 1000);

        // Clear the row where the data was added
        $scope.service.id = '';
        $scope.service.name = '';
        $scope.service.HourMin = '';
        $('#datetimepicker1').val('');
        $scope.service.desc = '';
        $scope.service.selectedMin = null;
        $scope.service.selectedMinText = '';
        $scope.service.selectedHour = null;
        $scope.service.selectedHourText = '';
      }

      // remove the service from the list
      $scope.serviceMeta.removeService = function ($index) {
        $scope.services.splice($index, 1);
      }

      $scope.removeProduct = function ($index) {
        $scope.productTotalAmount -= $scope.products[$index].sum * $scope.products[$index].quantity;
        $scope.products.splice($index, 1);
      }

      // set the time for the service - TODO: improve use a directive for this type of input
      $scope.setTime = function ($event, t, $index) {
        var el = $($event.target);

        if ($index == -1) {
          switch (t) {
            case 'hour' :
              $scope.service.selectedHourText = el.text(); // For Display Purpose
              $scope.service.selectedHour = parseInt($scope.service.selectedHourText); // For comparing purpose in template
              break;
            case 'min' :
              $scope.service.selectedMinText = el.text();
              $scope.service.selectedMin = parseInt($scope.service.selectedMinText);
              break;
          }

          if ($scope.service.selectedHour !== null && $scope.service.selectedMin != null) {
            $scope.service.HourMin = $scope.service.selectedHourText + ':' + $scope.service.selectedMinText;
            $event.preventDefault();
          } else {
            $event.preventDefault();
            $event.stopPropagation();
          }

        } else {
          switch (t) {
            case 'hour' :
              //console.log($index);
              //console.dir($scope.services[$index]);
              $scope.services[$index].selectedHourText = el.text(); // For Display Purpose
              $scope.services[$index].selectedHour = parseInt($scope.services[$index].selectedHourText); // For comparing purpose in template
              break;
            case 'min' :
              $scope.services[$index].selectedMinText = el.text();
              $scope.services[$index].selectedMin = parseInt($scope.services[$index].selectedMinText);
              break;
          }

          if ($scope.services[$index].selectedHour && $scope.services[$index].selectedMin) {
            $scope.services[$index].HourMin = $scope.services[$index].selectedHourText + ':' + $scope.services[$index].selectedMinText;
            $event.preventDefault();
          } else {
            $event.preventDefault();
            $event.stopPropagation();
          }
        }

      }

      $scope.setEditTime = function ($event, t) {

        var el = $($event.target);

        switch (t) {
          case 'hour' :
            $scope.editService.selectedHourText = el.text(); // For Display Purpose
            $scope.editService.selectedHour = parseInt($scope.editService.selectedHourText); // For comparing purpose in template
            break;
          case 'min' :
            $scope.editService.selectedMinText = el.text();
            $scope.editService.selectedMin = parseInt($scope.editService.selectedMinText);
            break;
        }

        if ($scope.editService.selectedHour !== null && $scope.editService.selectedMin != null) {
          $scope.editService.HourMin = $scope.editService.selectedHourText + ':' + $scope.editService.selectedMinText;
          $event.preventDefault();
        } else {
          $event.preventDefault();
          $event.stopPropagation();
        }

      }


      //---------------------- Users --------------------------------------------------

      var allUsers = UsersService.getAllUsers();

      $scope.tech_users = [];
      $scope.vendor_users = [];
      $scope.client_users = [];

      setTimeout(function () {
        angular.forEach(allUsers, function (user) {
          if (user.accountType === 'CLIENT') {
            $scope.client_users.push(user);
          } else if (user.accountType === 'TECH') {
            if (user.id !== $scope.currentUser.id) {
              $scope.tech_users.push(user);
            }
          } else if (user.accountType === 'VENDOR') {
            $scope.vendor_users.push(user);
          }
        });
      }, 1000); //TODO: find a better way to load users...


      $scope.update_users = [];

      $scope.addUsertoUpdate = function (user) {

        if (user.isSelected) {

          var isAlreadyAdded = false;

          for (var i = 0; i < $scope.update_users.length; i++) {
            if ($scope.update_users[i].id === user.id) {
              isAlreadyAdded = true;
            }
          }

          if (isAlreadyAdded === false)  $scope.update_users.push(user);

        } else {

          for (var i = 0; i < $scope.update_users.length; i++) {
            if ($scope.update_users[i].id === user.id)  $scope.update_users.splice(i, 1);
          }
        }
      }

      $scope.userFilter = {};
      $scope.userFilter.query = '';

      $scope.searchUser = function () {
        $scope.userQuery = {query: $scope.userFilter.query};
      }

      $scope.getUserType = function (accountType) {
        if (accountType === 'TECH') {
          return "Team Member";
        } else if (accountType === 'CLIENT') {
          return "Client";
        } else if (accountType === 'VENDOR') {
          return "Vendor";
        }
      }

      $scope.getUserTypeById = function (userId) {
        var user = UsersService.getOneById(userId);
        return $scope.getUserType(user.accountType);
      }

      // TODO: impove method name...
      $scope.postAssignTicket = function (event, ticket, user) {
        $scope.$parent.postAssignTicket(event, ticket, user);
        $scope.collapse();
      }

      $scope.canBeReOpened = function (createdAt) {
        // get the date before thirty days
        var d = new Date();
        d.setDate(d.getDate() - 30);
        // ticket can be re-opened if created within last thrity days
        return new Date($scope.ticketDetail.createdAt) > d;
      }

      $scope.postTagAs = function (event, ticketId) {
        $scope.$parent.postTagAs(event, ticketId);
        $('#btnTicketSettings').trigger('click');
      }

      $scope.getFileType = function (contentType) {
        if (contentType === 'image/jpeg') return 'jpg';
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

      $scope.getUserNameById = function (actionUser) {

        if (actionUser !== undefined && actionUser !== null) {

          var user = UsersService.getOneById(actionUser.id);
          var userName = user.firstName + ' ' + user.lastName;

          return userName;
        }
      }

      $scope.assignUsertoTicketDetailed = function (ticketId) {

        var user = $('.dropdown-submenu-wrapper #assignedToUserId').val();
        var fullName = $('.dropdown-submenu-wrapper #AssignedTo').val();
        $('#btnTicketSettings').trigger('click');

        TicketsService.assignTo(ticketId, user, function () {
          $scope.$parent.notification('Ticket is assigned successfully!');
          $scope.collapse();
        });
      }

      // TODO: check why delete ticket working without this function....
      $scope.deleteTicket = function (event, ticket, flag) {
        $scope.$parent.deleteTicket(event, ticket, flag);
        $scope.collapse();
      }

      $scope.collapse = function () {
        $('body').removeClass('opened-ticket');
        $('#listing_' + $stateParams.id).removeClass('active');

        $state.go('Tickets', {'listType': $stateParams.listType});
      }

      $scope.downloadAllAttachments = function (ticketId) {
        Downloader.downloadTicketAttachments(ticketId);
      }

      $scope.downloadFile = function (fileId) {
        Downloader.downloadFile(fileId);
      }


      //$scope.oldFileName = '';

      /*$scope.files.push({
       name: 'test.html',
       size: '10 KB',
       progress: 10
       });*/

      $scope.$on('$viewContentLoading',
        function (event, viewConfig) {
          $('#loading').show();
        });

      $scope.$on('$viewContentLoaded',
        function (event) {

          $('.ticket-content').hide();

          /*if($(window).width() > 1366) {
           $('.ticket-content').jScrollPane({
           autoReinitialise: true,
           verticalDragMinHeight: 54,
           verticalDragMaxHeight: 54,
           });
           }*/

          $(document).on('mouseenter', '#detailAssignTicketTo', function () {
            $('.dropdown-submenu-wrapper #assignedTo').focus();
          });

          $(document).on('click', '.dropdown-menu-services > li > a', function (e) {
            e.preventDefault();
            var selText = $(this).text();
            $(this).parents('.add-service').find('input.dropdown-toggle:first').val(selText);
            $scope.service.type = selText;
          });

          setTimeout(function () {
            $('#datetimepicker1').datetimepicker({
              keepOpen: true,
              format: 'DD MMM YYYY',
              maxDate: new Date()
            }).on('dp.change', function (ev) {
              $('#datetimepicker1').blur();
            });

            $('.dropdown-menu-tabs a[data-toggle="tab"]').click(function (e) {
              e.preventDefault();
              e.stopPropagation();

              $(this).tab('show');
            });

            $scope.$parent.populateTechGusy();

            $('#uploadFile').change(function (e) {

              var self = e.currentTarget, file = self.files[0];

              // TODO: check if the same file is being uploaded again!

              // KB
              var size = parseInt(file.size / 1024);

              // MB
              if (size >= 1024) {
                size = parseFloat(size / 1024).toFixed(2) + ' MB';
              } else {
                size = size + ' KB';
              }

              //var newFile = ; TODO: finish it...

              $scope.files.push({
                name: file.name,
                size: size,
                progress: 0
              });

              console.log($scope.files.length);
              //console.log('-----------');
              //console.dir($scope.files);
              //alert($scope.files.length);

              /*FilesService.create(file,
               function (arg) {
               //console.log('on progress!');
               newFile.progress = (arg.loaded / arg.total) * 100;
               }, function (arg) {
               console.log('on finish!');
               //$('input#' + id + '_val').val(arg.id);
               }, function (arg) {
               console.log('on error!');
               //$('li#' + id + '_li').remove();
               });*/
            });

// editable div - new note
            $("#ticket-new-note").focusout(function () {
              var element = $(this);
              if (!element.text().trim().length) {
                element.empty();
              }
            });

            function setCursorToEnd(ele) {
              var range = document.createRange();
              var sel = window.getSelection();
              range.setStart(ele, 1);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
              ele.focus();
            }

            function placeCaretAtEnd(el) {
              el.focus();
              if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
              } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
              }
            }

            var ProdServiceScrollElement = null;

            $scope.changeProductServiceScrollbarVisibility = function (category) {

              var itemCount = 0;

              if (category === 'PRODUCT') {
                itemCount = $scope.products.length;
              } else if (category === 'SERVICE') {
                itemCount = $scope.services.length;
              }

              if (itemCount > 6) {
                if (ProdServiceScrollElement === null) {
                  console.log('in there');
                  $('.ticket-form-header').css('overflow', 'auto');
                  ProdServiceScrollElement = $('.ticket-form-header').jScrollPane({
                    autoReinitialise: true,
                    verticalDragMinHeight: 54
                  });
                }
                ProdServiceScrollElement.data('jsp').scrollToBottom();
              }

              // vertical bar doesn't hide fast enough
              setTimeout(function () {
                if (ProdServiceScrollElement !== null && !$(".ticket-form-header .jspVerticalBar").is(":visible")) {
                  $('.ticket-form-header').css('overflow', 'hidden');
                  var api = ProdServiceScrollElement.data('jsp');
                  api.destroy();
                  ProdServiceScrollElement = null;
                }
              }, 500);
            }

            var element = null;
            $scope.changeScrollbarVisibility = function (selector) {

              var height = $(selector).height();
              if (height === 318) {
                if (element === null) {
                  console.log('in there');
                  $(selector).css('overflow', 'auto');
                  element = $(selector).jScrollPane({
                    autoReinitialise: true,
                    verticalDragMinHeight: 54
                  });
                  if (selector === '.editable-container') {
                    placeCaretAtEnd(document.getElementById("ticket-new-note"));
                  }
                }
                element.data('jsp').scrollToBottom();
              }

              // vertical bar doesn't hide fast enough
              setTimeout(function () {
                if (element !== null && !$(selector + " .jspVerticalBar").is(":visible")) {
                  $(selector).css('overflow', 'hidden');
                  var api = element.data('jsp');
                  api.destroy();
                  element = null;
                  if (selector === '.editable-container') {
                    placeCaretAtEnd(document.getElementById("ticket-new-note"));
                  }
                }
              }, 500);

            }

            $("#ticket-new-note").on('keyup', function (e) {

              $scope.changeScrollbarVisibility('.editable-container');

            });

          }, 2000);

          $scope.productCategories = ProductsService.getCategories($scope, function () {
            if ($scope.productCategories.length > 0) {
              var category = $scope.productCategories[0];
              $scope.loadCategoryProducts(null, category);
            }
          });


        });

      $scope.isSharedBetweenVisible = false;

      $scope.toggleSharedUsers = function () {
        $scope.isSharedBetweenVisible = !$scope.isSharedBetweenVisible;
      }

      $scope.catProducts = [];

      $scope.isUsersToolTipVisible = false;

      $scope.toggleUserToolTip = function () {
        $scope.isUsersToolTipVisible = true;
      }


      $scope.loadCategoryProducts = function ($event, category) {

        if ($event !== null) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        if (category.isSelected) return;

        var catId = category.id;

        angular.forEach($scope.productCategories, function (category) {
          if (category.id == catId) {
            category.isSelected = true;
          } else {
            category.isSelected = false;
          }
        });

        $scope.catProducts = ProductsService.getAllByCategory($scope, catId, function () {
        });
      }

      $scope.renderDateTime = function (time) {

        var d = new Date(time);

        if (Object.prototype.toString.call(d) === "[object Date]") {
          if (isNaN(d.getTime()));
          else {
            return d.toUTCString();
          }
        }

      }

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        if (toParams.id !== undefined && fromParams.id !== undefined && toParams.id === fromParams.id) {
          event.stopPropagation();
        }

        $('#listing_' + $stateParams.id).removeClass('active');

        if (toParams.id === undefined) {
          $('body').removeClass('opened-ticket');
        }

      });


      $scope.getUpdateClass = function (updateType) {
        switch (updateType) {
          case 'NOTE':
            return 'icn-update-message';
          case 'SERVICE':
            return 'icn-update-service';
          case 'PRODUCT':
            return 'icn-update-product'
        }
      }

      $scope.getUpdateName = function (updateType) {
        switch (updateType) {
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

      $scope.loadMoreUpdates = function (ticket) {

        $('#loading').show();

        TicketsService.loadRemainingTicketUpdates(ticket, function () {
          $('#loading').hide();
          $scope.allUpdatesLoaded = true;
        });

      }

      $scope.getFormattedDate = function (d) {

        var date = new Date(d);

        var monthNames = [
          "Jan", "Feb", "March",
          "April", "May", "June", "July",
          "Aug", "Sep", "Oct",
          "Nov", "Dec"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
      }

      $scope.getTimeinPoints = function (selectedHour, selectedMin) {

        var fraction = selectedMin / 60;
        //console.log(selectedHour, selectedMin, fraction);

        /*if(parseInt(selectedMin) == 5) fraction = .08;
         if(parseInt(selectedMin) == 10) fraction = .16;
         if(parseInt(selectedMin) == 15) fraction = .25;
         if(parseInt(selectedMin) == 20) fraction = .30;
         if(parseInt(selectedMin) == 25) fraction = .40;
         if(parseInt(selectedMin) == 30) fraction = .50;*/

        //console.log(selectedHour);

        return (selectedHour + fraction).toFixed(2);
      }

      $scope.getTimeinFormat = function (quantity) {

        var arr = (quantity + '').split('.');

        var hour = parseInt(arr[0]);
        var min = Math.round(parseFloat('.' + arr[1]) * 60);

        /*if(min == 8) min = 5;
         else if(min == 16) min = 10;
         else if(min == 25) min = 15;
         else if(min == 3) min = 20;
         else if(min == 4) min = 25;
         else if(min == 5) min = 30;*/


        if (hour < 10) {
          hour = '0' + hour;
        }

        if (min < 10) {
          min = '0' + min;
        }

        if (isNaN(min)) {
          min = '00';
        }

        return hour + ':' + min;
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

        //console.log($scope.updateType);
        if ($scope.updateType == 'NOTE') {
          ticketUpdate.note = $scope.ticketUpdate.note;
          //TODO: file uploading here...
        } else if ($scope.updateType == 'SERVICE') {

          var count = 0;

          angular.forEach($scope.services, function (item) {

            var serviceDate = new Date(item.date);
            serviceDate = Date.UTC(serviceDate.getFullYear(), serviceDate.getMonth(), serviceDate.getDate(), serviceDate.getHours(), serviceDate.getMinutes());

            ticketUpdate.services[count] = {
              item: {
                createdAt: new Date().getTime(),
                name: item.name
                ,
                versionedId: {
                  id: item.id
                }
              },
              description: item.desc,
              quantity: $scope.getTimeinPoints(item.selectedHour, item.selectedMin),
              date: serviceDate
            }
            count++;
          });
        } else {

          ticketUpdate.products = $scope.products;
        }

        angular.forEach($scope.update_users, function (user) {
          ticketUpdate.sharedBetween.push({"id": user.id});
        });

        TicketsService.saveTicketUpdate(ticketId, ticketUpdate, false, function (response) {

          if (response.code === 500) {
            $scope.$parent.notification('Error: ' + response.message);
          } else {
            $scope.$parent.notification('Update added successfully!');

            $scope.ticketUpdate.note = '';
            $scope.services = [];
            $scope.products = [];
            $scope.update_users = [];
            $scope.productTotalAmount = 0;
          }

        });
      };

    }]);
}(window, jQuery));
