'use strict';

/* Controllers */
(function (window, $, undefined) {
    var app = angular.module('main.app', [
        'main.services'
    ]);
    app.controller('TicketsController', ['$scope', 'TicketsService',
        function ($scope, TicketsService) {
            $scope.searchResult = [];

            $scope.oldFile = null;
            $scope.hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
            $scope.minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
            $scope.panelTitle = 'All Tickets';
            $scope.ticketCount = 0;
            $scope.tickets = [];
            $scope.getHours = function () {
                return $scope.hours;
            }
            $scope.getMinutes = function () {
                return $scope.minutes;
            }
            $scope.ticketCounts = TicketsService.getCounts($scope);
            $scope.ticketListType = 'all';

            $scope.checkMe = function (event) {
                event.preventDefault();
                event.stopPropagation();
                var val = $(event.target).parents('.filter-by-wrapper').find('input[type=hidden]').val();
                if (val == "false") {
                    setTimeout(function () {
                        $(event.target).parents('.filter-by-wrapper').find('input[type=checkbox]').prop('checked', true);
                    }, 500);

                    $(event.target).parents('.filter-by-wrapper').find('input[type=hidden]').val("true");
                } else {

                    setTimeout(function () {
                        $(event.target).parents('.filter-by-wrapper').find('input[type=checkbox]').prop('checked', false);
                    }, 500);

                    $(event.target).parents('.filter-by-wrapper').find('input[type=hidden]').val("false");
                }


            }
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
            $scope.renderHTML = function (elemClass, html) {
                $('.' + elemClass).html(html);
            }
            $scope.uploadFile = function (event) {
                var file = event.target;
            }
            $scope.selectHour = function (event, hour) {
                $(event.target).parents('.dropdown-menu-hour').removeClass('selected');
                $(event.target).addClass('selected');
                var minute = $(event.target).parents('div.col-2').find('.dropdown-menu-minute').find('a.selected').html();
                var time = hour + ':';
                if (minute)
                    time = hour + ':' + minute;
                $(event.target).parents('div.col-2').find('input[name=ticketUpdateTime]').val(time);

                if (minute) {
                    $(event.target).parents('div.col-2').removeClass('open');
                }
            }
            $scope.selectType = function (type) {
                $('input#updateType').val(type);
            }

            $scope.selectMinute = function (event, minute) {
                $(event.target).parents('.dropdown-menu-minute').removeClass('selected');
                $(event.target).addClass('selected');
                var hour = $(event.target).parents('div.col-2').find('.dropdown-menu-hour').find('a.selected').html();
                var time = ':' + minute;
                if (hour)
                    time = hour + ':' + minute;
                $(event.target).parents('div.col-2').find('input[name=ticketUpdateTime]').val(time);

                if (hour)
                    $(event.target).parents('div.col-2').removeClass('open');
            }
            $scope.selectService = function (event, service) {
                $(event.target).parents('div.col-1').find('input[name=ticketUpdateService]').val(service);
                $(event.target).parents('div.col-1').removeClass('open');
            }

            $scope.getLoggedUser = function () {
            }
            $scope.getTagAs = function (event) {
                if ($('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
                    $('div#labelAs').modal('show');
                }
            };
            $scope.showStatusOpt = function (event) {
                if (event.target.localName === 'span' || event.target.localName === 'ul' || event.target.localName === 'li') {
                    $(event.target).parents('div.ticket-actions').find('div.ticket-status').addClass('open');
                } else {
                    $(event.target).addClass('open');
                }
            }
            $scope.loadTickets = function (filter) {
                if (!filter) {
                    filter = 'user';
                }
                $scope.ticketListType = filter;
                $scope.tickets = TicketsService.getList($scope, {filter: filter});
                $scope.filterType = filter;
                if (filter == 'spam') {
                    $scope.reportedtickets = $scope.tickets;
                }
                filter = filter && filter[0].toUpperCase() + filter.slice(1)
                if (filter === 'User')
                    filter = 'My Tickets';
                $scope.panelTitle = filter;
                TicketsService.getCounts($scope, function (param) {
                    $scope.ticketCount = param[$scope.filterType.toUpperCase()];
                    $('div#bulk-actions').hide();
                    $('div.ticket').removeClass('selected');
                    $('div#search-and-filter').show();
                    $('.total-selected').text(0);
                });


            }

            $scope.clearSearch = function () {
                $('#typeahead').val('');
            }
            $scope.keywordSearch = function (event, filter) {
                var $input = $('#typeahead');
                var params = {};
                if ($input.val().length > 2) {
                    params.filter = $scope.ticketListType;
                    params.keyword = $input.val();
                    TicketsService.search(params, function (recs) {
                        var customRecs = [];
                        for (var i = 0; i < recs.tickets.length; i++) {
                            customRecs[i] = {};
                            customRecs[i].id = recs.tickets[i].id;
                            customRecs[i].type = 'ticket';
                            customRecs[i].value = recs.tickets[i].number;
                        }
                        //var customRecs = [];
                        for (var i = recs.tickets.length; i < recs.tickets.length + recs.companies.length; i++) {
                            customRecs[i] = {};
                            customRecs[i].id = recs.companies[i].id;
                            customRecs[i].type = 'company';
                            customRecs[i].value = recs.companies[i].legalName;
                        }
                        $('#typeahead').autocomplete({
                            lookup: customRecs,
                            onSelect: function (suggesstion) {
                                $scope.tickets = [];
                                if (suggesstion.type == 'ticket') {
                                    $scope.tickets[0] = {};

                                    $scope.tickets[0] = TicketsService.getOne(suggesstion.id, $scope, true);
                                } else {
                                    var extraParams = {}
                                    extraParams.companyId = suggesstion.id;
                                    extraParams.filter = $scope.ticketListType;
                                    $scope.tickets = $scope.tickets = TicketsService.getList($scope, extraParams);
                                }
                            }
                        });
                    });

                }


            }

            $scope.filterTickets = function (event, listType) {

                if (!listType) {
                    listType = 'user';
                }
                $scope.filter = listType;
                var params = {filter: listType};
                if (event) {
                    if ($(event.target).parents('div.dropdown-filter').find('input.filterPriority[type=checkbox]').prop('checked')) {
                        var priority = $(event.target).parents('div.dropdown-filter').find('div.filter-priority').find('div.active').attr('data-value');
                        if (priority)
                            params.priority = priority.toUpperCase();
                    }
                    if ($(event.target).parents('div.dropdown-filter').find('input.filterStatus[type=checkbox]').prop('checked')) {
                        var status = $(event.target).parents('div.dropdown-filter').find('div.filter-status').find('div.active').attr('data-value');
                        if (status)
                            params.status = status.toUpperCase();
                    }
                }
                if ($('input#typeahead').val()) {
                    var keyword = $('input#typeahead').val();
                }


                $scope.tickets = TicketsService.getList($scope, params, function () {
                    if (event) {
                        $(event.target).parents('div.dropdown').removeClass('open');
                    }
                });
                listType = listType && listType[0].toUpperCase() + listType.slice(1);
                if (listType === 'User')
                    listType = 'My Tickets';
                $scope.panelTitle = listType;
                TicketsService.getCounts($scope, function (param) {
                    $scope.ticketCount = param[$scope.filterType.toUpperCase()];
                });

            }

            $scope.getUnassignedCount = function () {
                TicketsService.getCounts($scope, function (param) {
                    return param["UNASSIGNED"];
                });
            }

            $scope.closeFilterTickets = function (event, listType) {
                $(event.target).parents('div.dropdown').removeClass('open');
                return;
            }
            $scope.loadTickets();
            $scope.claimAble = function (ticket) {
                if (ticket.assignedUser === null || ticket.assignedUser === undefined) {
                    return true;
                }
                return false;
            }
            $scope.openAble = function (ticket) {
                if (ticket && ticket.status && ticket.status.toLowerCase() === 'completed') {
                    return true;
                }
                return false;
            }
            $scope.filterList = function (filter) {
                if (!filter) {
                    filter = 'all';
                }
                $scope.filter = filter;
                $scope.tickets = TicketsService.getList($scope, {filter: filter});
                filter = filter && filter[0].toUpperCase() + filter.slice(1)
                $scope.panelTitle = filter + ' Tickets';
            }
            $scope.loadMore = function () {
                TicketsService.loadMore($scope, function (moreTickets) {
                });
            }
            $scope.loadRemainingTicketUpdates = function (ticket) {
                TicketsService.loadRemainingTicketUpdates(ticket, function () {

                });
            }
            setTimeout(function () {
                prepareTicketsModule();
            }, 1000);
            $scope.expand = function (event, ticket) {
                $('ul.dropdown-status').parents('div.ticket-status').removeClass('open')
                $scope.ticketDetail = TicketsService.getOne(ticket.id, $scope, true);
                $('body').addClass('opened-ticket');
//                $('.datetimepicker').datetimepicker({
//                    format: 'MM/DD/YYYY'
//                });
                $('.ticket-sidebar').find('.ticket').removeClass('active');
                $(event.target).parents('.ticket').addClass('active');
            };

            $scope.addTicket = function (event) {
                var type = $('#updateType').val();
            }
            $scope.deleteForEver = function (ticket, hide) {
                TicketsService.DELETEFOREVER(ticketId, function () {
                    $('div#notificationContainer div.alert-yellow').text(ticket.subject + ' is deleted successfully.');
                    $('div#notificationContainer').show();
                    if(hide){
                        $('body').removeClass('opened-ticket');
                    }
                    setTimeout(function () {
                        $('div#notificationContainer').hide();

                    }, 3000);
                });
            }
            $scope.deleteTicket = function (event, ticket, flag) {
                TicketsService.changeTrashFlag(ticket.id, flag, function () {
                    if(event!=null){
                        $(event.target).parents('div.dropdown').removeClass('open');
                    }else {
                        $('body').removeClass('opened-ticket');
                    }
                    $('div#notificationContainer div.alert-yellow').text(ticket.subject + ' is deleted successfully.');
                    $('div#notificationContainer').show();
                    
                    setTimeout(function () {
                        $('div#notificationContainer').hide();

                    }, 3000);
                });
            };
            $scope.deleteTicketUpdate = function (ticketId, updateId) {
                TicketsService.deleteTicketUpdate(ticketId, updateId, function () {
                    $('div#notificationContainer div.alert-yellow').text('ticket update is deleted successfully.');
                    $('div#notificationContainer').show();
                    setTimeout(function () {
                        $('div#notificationContainer').hide();
                    }, 3000);
                })
            };
            $scope.deleteTicketBulk = function (event, flag) {
                if ($('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
                    var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
                    var ticketArr = [];
                    tickets.each(function (i, ticket) {
                        ticketArr[i] = ticket.value;
                    });
                    if (ticketArr.length > 0) {
                        TicketsService.changeTrashFlag(ticketArr, flag, function () {
                            $('div#notificationContainer div.alert-yellow').text(ticketArr.length + ' tickets are deleted successfully.');
                            $('div#notificationContainer').show();
                            setTimeout(function () {
                                $('div#notificationContainer').hide();
                            }, 3000);
                        });
                    }
                }
                return;
            };
            $scope.deleteForEverBulk = function (event) {
                if ($('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
                    var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
                    var ticketArr = [];
                    tickets.each(function (i, ticket) {
                        ticketArr[i] = ticket.value;
                    });
                    if (ticketArr.length > 0) {
                        TicketsService.DELETEFOREVER(ticketArr, function () {
                            $('div#notificationContainer div.alert-yellow').text(ticketArr.length + ' tickets are deleted successfully.');
                            $('div#notificationContainer').show();
                            setTimeout(function () {
                                $('div#notificationContainer').hide();
                            }, 3000);
                        });
                    }
                }
                return;
            };

            $scope.getassignTicket = function (event, ticket) {
                $('div#assignTicketModel').modal('show');
            };

            $scope.getCreateTicket = function (event, ticket) {
                $('div#createTicketPopup').modal('show');
            };

            $scope.getCapitialize = function (str) {
                if (str) {
                    str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                    return str;
                }
            };

            $scope.lowerCaseWithOutUnderScore = function (str) {
                if (str == 'IN_PROGRESS') {
                    return 'progress';
                } else if (str == 'COMPLETED') {
                    return 'completed';
                } else if (str == 'ON_HOLD') {
                    return 'onhold';
                }
            }
            $scope.getStatusCSS = function (tag) {
                if (tag)
                    return tag.toLowerCase();
            }
            $scope.getIconStatus = function (status) {
                status = status.toLowerCase();
                if (status == 'new')
                    return '';
                else if (status == 'in_progress')
                    return 'icn-status-in-progress';
                else if (status == 'on_hold')
                    return 'icn-status-on-hold';
                else
                    return 'icn-status-completed';
            };

            $scope.postAssignTicket = function (event, ticket, user, claimCall) {
                TicketsService.assignTo(ticket.id, user.id, function () {
                    $('div#assignTicketModel').modal('hide');
                    if (claimCall) {
                        $('body').removeClass('opened-ticket');
                    }
                });

            };
            $scope.postTicketUpdate = function (event, ticketId) {
                var update = {};
                var note = '';
                update.products = [];
                update.services = [];
                update.attachments = [];
                update.sharedBetween = [];
                var type = $('input#updateType').val();
                update.type = type;
                var $ctrlDiv = $('div.add-' + type.toLowerCase());
                if (type == 'NOTE') {
                    note = $('div#tab-add-note').find('textarea[name=ticketUpdateNote]').val();
                } else if (type == 'PRODUCT') {
                    var i = $ctrlDiv.length;
                    for (var c = 0; c < i; c++) {
                        update.products[c] = {};
                        update.products[c].item = {};
                        update.products[c].item.versionedId = {};
                        update.products[c].item.versionedId.id = $('input[name=product-ids]')[c].value;
                        update.products[c].item.name = $('input[name=product-name]')[c].value;
                        update.products[c].description = $('input[name=product-desc]')[c].value;
                        //update.products[c].amount = $('input[name=product-amount]')[c].value;
                        update.products[c].amount = $('input[name=product-qty]')[c].value;
                    }
                } else {
                    var i = $ctrlDiv.length;
                    for (var c = 0; c < i; c++) {
                        update.services[c] = {};
                        update.services[c].description = $('input[name=ticketUpdateDescription]')[c].value;
                        update.services[c].time = $('input[name=ticketUpdateTime]')[c].value;
                        update.services[c].type = $('input[name=ticketUpdateService]')[c].value;
                        update.services[c].date = $('input[name=ticketUpdateDate]')[c].value;
                    }
                }
                update.note = note;
                $('input[name=attachmentId]').each(function (i, entry) {
                    update.attachments[i] = {};
                    update.attachments[i].file = {};
                    update.attachments[i].file.id = entry.value;
                });
                update.sharedBetween = [];
                var sharedWith = $('.ticket-actions-footer .control').find('input[type=checkbox]:checked');
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
                }

                TicketsService.saveTicketUpdate(ticketId, update, false, function () {
                    $('div#tab-add-note').find('textarea[name=ticketUpdateNote]').val('');
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
                    }, 3000);
                });
            };
            $scope.postCreateTicket = function (event) {
                var priority = $('input#createTicketPriority').val();
                if (priority) {
                    priority = priority.toUpperCase();
                }
                var ticket = {
                    "subject": $('input#createTicketSubject').val(),
                    "note": $('#createTicketNote').val(),
                    "company": $('input#ticketCompanyId').val(),
                    "createdUser": $('input#ticketCreatedById').val(),
                    "assignedUser": $('input#ticketAssignToId').val(),
                    "priorityLevel": priority
                };
                TicketsService.createTicket(ticket, function () {
                    $('div#notificationContainer div.alert-yellow').text(ticket.subject + ' is created successfully.');
                    $('div#notificationContainer').show();
                    $('input#createTicketSubject').val('');
                    $('#createTicketNote').val('');
                    $('input#ticketCompanyId').val('');
                    $('input#ticketCreatedById').val('');
                    $('input#ticketAssignToId').val('');
                    $('input#createTicketPriority').val('');
                    setTimeout(function () {
                        $('div#notificationContainer').hide();
                    }, 3000);
                    $('div#createTicketPopup').modal('hide');
                });

            };
            $scope.enableBulkAction = function (event) {
                setTimeout(function () {
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
                }, 100);

            }

            $scope.markAsOpen = function (event, ticket) {
                TicketsService.changeStatus(ticket.id, 'IN_PROGRESS', function () {
                    if(event!=null){
                        $(event.target).parents('div.dropdown').removeClass('open');
                    }
                    $('div#notificationContainer div.alert-yellow').text(ticket.subject + ' is successfully marked as open.');
                    $('div#notificationContainer').show();
                    $('body').removeClass('opened-ticket');
                    setTimeout(function () {
                        $('div#notificationContainer').hide();
                    }, 3000);
                });
            };
            $scope.markAsSpam = function (event, ticket, flag) {
                TicketsService.changeSpamFlag(ticket.id, flag, function () {
                    if(event!=null){
                        $(event.target).parents('div.dropdown').removeClass('open');
                    }else {
                        $('body').removeClass('opened-ticket');
                    }
                    $('div#notificationContainer div.alert-yellow').text(ticket.subject + ' is moved to spam.');
                    $('div#notificationContainer').show();
                    $('body').removeClass('opened-ticket');
                    setTimeout(function () {
                        $('div#notificationContainer').hide();

                    }, 3000);
                });
            };

            $scope.markAsSpamBulk = function (event, flag) {
                if ($('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
                    var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
                    var ticketArr = [];
                    tickets.each(function (i, ticket) {
                        ticketArr[i] = ticket.value;
                    });
                    if(flag==undefined){
                        flag = true;
                    }
                    if (ticketArr.length > 0) {
                        TicketsService.changeSpamFlag(ticketArr, flag, function () {
                            $(event.target).parents('div.dropdown').removeClass('open');
                            $('div#notificationContainer div.alert-yellow').text(ticketArr.length + 'tickets are moved to spam.');
                            $('div#notificationContainer').show();
                            setTimeout(function () {
                                $('div#notificationContainer').hide();
                            }, 3000);
                        });
                    }
                }
                return;
            };
            $scope.changeStatusBulk = function (event, status) {
                if ($('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
                    var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
                    var ticketArr = [];
                    tickets.each(function (i, ticket) {
                        ticketArr[i] = ticket.value;
                    });
                    if (ticketArr.length > 0) {
                        TicketsService.changeStatus(ticketArr, status, function () {
                            $(event.target).parents('div.dropdown').removeClass('open');
                            $('div#notificationContainer div.alert-yellow').text(ticketArr.length + 'tickets status is changed to ' + status);
                            $('div#notificationContainer').show();
                            setTimeout(function () {
                                $('div#notificationContainer').hide();
                            }, 3000);
                        });
                    }
                }
                return;
            };
            $scope.markAsOpenBulk = function (event) {
                if ($('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
                    var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
                    var ticketArr = [];
                    tickets.each(function (i, ticket) {
                        ticketArr[i] = ticket.value;
                    });
                    if (ticketArr.length > 0) {
                        TicketsService.getOne(ticketArr, $scope, true, function () {
                            $(event.target).parents('div.dropdown').removeClass('open');
                            $('div#notificationContainer div.alert-yellow').text(ticketArr.length + 'tickets are marked as open.');
                            $('div#notificationContainer').show();
                            setTimeout(function () {
                                $('div#notificationContainer').hide();
                            }, 3000);
                        });
                    }
                }
                return;
            };

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
            $scope.changePriorityBulk = function (event, priority) {
                if ($('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
                    var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
                    var ticketArr = [];
                    tickets.each(function (i, ticket) {
                        ticketArr[i] = ticket.value;
                    });
                    if (ticketArr.length > 0) {
                        TicketsService.changePriority(ticketArr, priority, function () {
                            $(event.target).parents('div.dropdown').removeClass('open');
                            $('div#notificationContainer div.alert-yellow').text(ticketArr.length + 'tickets priority is changed to ' + priority);
                            $('div#notificationContainer').show();
                            setTimeout(function () {
                                $('div#notificationContainer').hide();
                            }, 3000);
                        });
                    }
                }
                return;
            };

        }]);
    app.controller('CompaniesController', ['$scope', 'CompaniesService',
        function ($scope, CompaniesService) {
            $scope.companies = CompaniesService.getAllCompanies();
            $scope.currentCompany = CompaniesService.getCurrentCompany();
            $scope.getCompanyName = function (companyId) {
                var company = CompaniesService.getOneById(companyId);
                return company.legalName != undefined ? company.legalName : '';
            }
            $scope.getCompanyOwner = function (companyId) {
                if (companyId)
                    var company = CompaniesService.getOneById(companyId);
                else
                    return '';
                return company.primaryUser.id != undefined ? company.primaryUser.id : '';
            }
            $scope.filterUserByCompany = function (company) {
                $scope.companyUsers = CompaniesService.getAllByCompanyId(company.id);
            }
            $scope.selectUser = function (event, user) {
                $('input#ticketCreatedBy').val(user.firstName + " " + user.lastName);
                $('input#ticketCreatedById').val(user.id);
                $(event.target).parents('div.dropdown').removeClass('open');
            }

            $scope.selectPriority = function (event, priority) {
                $('input#createTicketPriority').val(priority);
                $(event.target).parents('div.dropdown').removeClass('open');
            }
        }]);

    app.controller('UserController', ['$scope', 'UsersService',
        function ($scope, UsersService) {

            $scope.companyUsers = [];
            $scope.currentUser = UsersService.getCurrentUser();
            $scope.currentCompanyUser = [];
            $scope.getFirstName = function (userId) {
                var user = UsersService.getOneById(userId);
                if (user)
                    return user.firstName != undefined ? user.firstName : '';
            }
            $scope.getlastName = function (userId) {
                var user = UsersService.getOneById(userId);
                if (user)
                    return user.lastName != undefined ? user.lastName : '';
            }
            $scope.currentUser = UsersService.getCurrentUser();
            $scope.selectCompany = function (event, company) {
                $scope.companyUsers = UsersService.getAllByCompanyId(company.id);
                $('input#ticketCompany').val(company.legalName);
                $('input#ticketCompanyId').val(company.id);
                $(event.target).parents('div.dropdown').removeClass('open');
            }
            $scope.getAssignToUsers = function (company) {
                $scope.currentCompanyUser = UsersService.getAllByCompanyId(company.id);
            }
            $scope.selectAssignTo = function (event, user) {
                $('input#ticketAssignTo').val(user.firstName + ' ' + user.lastName);
                $('input#ticketAssignToId').val(user.id);
                $(event.target).parents('div.dropdown').removeClass('open');
            }
            if ($scope.currentUser && $scope.currentUser.id)
                $scope.teamMembers = UsersService.getAllByCompanyId($scope.currentUser.id);
            $scope.clientUsers = UsersService.getClientUsers();
            $scope.getAllByCompanyId = function (company) {
                //return UsersService.getAllByCompanyId(company.id);
            }
            $scope.selectUsers = function (event, user) {
                if (user) {
                    if ($(event.target).parents('.checkbox').find('input[type=checkbox]').is('checked')) {
                        $(event.target).parents('.checkbox').find('input[type=checkbox]').prop('checked', '')
                    } else {
                        $(event.target).parents('.checkbox').find('input[type=checkbox]').prop('checked', 'checked')
                    }
                    $(event.target).parents('.addUsersDropdown').addClass('open');
                } else {
                    $(event.target).parents('.addUsersDropdown').addClass('open');
                }
                event.preventDefault();
                event.stopPropagation();
            }

            $scope.showMembers = function (event, panelId) {
                $(event.target).parents('ul').find('li').removeClass('active');
                $(event.target).parents('li').addClass('active');
                $(event.target).parents('div.addUsersDropdown').find('div.tab-content').find('div.tab-pane').removeClass('active');
                $(event.target).parents('div.addUsersDropdown').find('div.' + panelId).addClass('active');
            }
        }
    ]);
    app.controller('RightPanelController', ['$scope', 'RightPanelService',
        function ($scope, RightPanelService) {
            $scope.rightPanel = RightPanelService.getActivities($scope, null, function ($activities) {
            });

            $scope.getCompanyData = function (companyId) {
                $scope.groupData = RightPanelService.getOneCompanyGroupedData(companyId);
            }
            $scope.checkCheckBox = function (event) {
                debugger;
                $('#addUsersDropdown').addClass('open');
                if ($(event.target).is('checked')) {
                    $(event.target).removeAttr('checked');
                } else {
                    $(event.target).attr('checked', 'checked');

                }
                event.preventDefault();
                event.stopPropagation();
            }


        }]);
    app.controller('TagController', ['$scope', 'TicketTagsService',
        function ($scope, TicketTagsService) {
            $scope.getcreateTag = function (event, tag) {
                if (tag != null && tag != undefined) {
                    $('input#ticketTagName').val(tag.name);
                    $('a#color' + tag.color).addClass('is-selected');
                    $('input#tagColorCode').val(tag.color);
                    $('input#tagId').val(tag.id);
                    $('div#deleteTagIcon').show();
                } else {
                    $('div#deleteTagIcon').hide();
                }
                $('div#tagCreateModel').modal('show');
            };
            $scope.selectColor = function (event, code, color) {
                debugger;
                $(event.target).parents('ul.tag-list li a').addClass('open');
                event.preventDefault();
                event.stopPropagation();
//                $('input#tagColorCode').val(code);
//                if (event.target.localName === 'span') {
//                    $(event.target).parent().addClass('is-selected');
//                } else if (event.target.localName === 'a') {
//                    $(event.target).addClass('is-selected');
//                } else {
//                    $(event.target).find('a').addClass('is-selected');
//                }

            };
            $scope.tags = TicketTagsService.getList($scope);
            TicketTagsService.getTicketsCounts($scope, function (arg) {
                $scope.tagsCount = arg;
            });
            $scope.colorCodes = [{"code": 0}, {"code": 1}, {"code": 2}, {"code": 3}, {"code": 4}, {"code": 5}, {"code": 6}, {"code": 7}, {"code": 8}, {"code": 9}];
            $scope.deleteTag = function () {

                var tagId = $('#tagId').val();
                var tagName = $('#ticketTagName').val();
                if (!tagId) {
                    return;
                }
                TicketTagsService.deleteTag(tagId, function () {
                    $('div#notificationContainer div.alert-yellow').text(tagName + ' deleted successfully.');
                    $('div#notificationContainer').show();
                    $('div#tagCreateModel').modal('hide');
                    setTimeout(function () {
                        $('div#notificationContainer').hide();
                    }, 3000);
                });
            };
            $scope.postCreateTag = function () {
                var tag = {
                    "name": $('input#ticketTagName').val(),
                    "color": $('input#tagColorCode').val()
                };
                var tagId = $('#tagId').val();
                var message = ' created successfully';
                if (tagId) {
                    tag.id = tagId;
                    message = ' updated successfully';
                }
                TicketTagsService.save(tag, function () {
                    $('div#tagCreateModel').modal('hide');
                    $('div#notificationContainer div.alert-yellow').text(tag.name + message);
                    $('div#notificationContainer').show();
                    setTimeout(function () {
                        $('div#notificationContainer').hide();
                    }, 3000);
                });
            };

            $scope.postTagAsBulk = function (event) {
                if ($('div.ticketListClass').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
                    var ticketsNum = $('div.ticketListClass').find('input.ticketBulkSelection[type=checkbox]:checked').length;
                    var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
                    var tags = $('ul#ticketAssignTags').find('input[type=checkbox]:checked');
                    var ticketArr = [];
                    var tagsArr = [];
                    tickets.each(function (i, ticket) {
                        ticketArr[i] = {};
                        ticketArr[i].id = ticket.value;
                    });
                    tags.each(function (i, tag) {
                        tagsArr[i] = {};
                        tagsArr[i].id = tag.value;
                    });
                    var postData = {};
                    for (var c = 0; c < ticketArr.length; c++) {
                        postData[ticketArr[c].id] = [];
                        for (var j = 0; j < tagsArr.length; j++) {


                            postData[ticketArr[c].id][j] = tagsArr[j].id;
                        }
                    }

                    TicketTagsService.link(postData, function () {
                        $('div#labelAs').modal('hide');
                        $('div#notificationContainer div.alert-yellow').text(ticketsNum + 'has been updated successfully.');
                        $('div#notificationContainer').show();
                        setTimeout(function () {
                            $('div#notificationContainer').hide();
                        }, 3000);
                    });
                }
            };
            $scope.postTagAs = function (event, ticketId) {
                if ($(event.target).parents('ul.tag-list').find('input[type=checkbox]:checked').length > 0) {
                    var tags = $(event.target).parents('ul.tag-list').find('input[type=checkbox]:checked');
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
                        //$('div#labelAs').modal('hide');
                        $('div#notificationContainer div.alert-yellow').text('Ticket has been tagged successfully.');
                        $('div#notificationContainer').show();
                        setTimeout(function () {
                            $('div#notificationContainer').hide();
                        }, 3000);
                    });
                }
            }
            $scope.checkIntermediate = function (tag) {
                var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
                var classVal = '  ';
                tickets.each(function (i, ticket) {
                    if (classVal === 'selected' && ticket.value != tag.id) {

                    }
                });
                return ' intermediate ';
            }

        }]);
    app.controller('FilesController', ['$scope', 'FilesService',
        function ($scope, FilesService) {
            $scope.unlinkFile = function (event, elemId) {
                var fileId = $('input#' + elemId + '_val').val();
                FilesService.remove(fileId, function () {
                    $('li#' + elemId + '_li').remove();
                })
            }
            $scope.selectFile = function (event, fieldId) {
                $('#' + fieldId).trigger('click');
                var chooseFile = document.getElementById(fieldId);
                chooseFile.addEventListener('change', function (e) {
                    var self = e.currentTarget, file = self.files[0];
                    if (file.name === $scope.oldFile) {
                        return;
                    }
                    var id = Math.floor(Math.random() * (9999999 - 999 + 1) + 999);
                    $scope.oldFile = file.name;
                    var size = parseInt(file.size / 1024);
                    var template = '<li id="' + id + '_li" ng-controller="FilesController">';
                    template += '<input id="' + id + '_val" type="hidden" name="attachmentId" />';
                    template += '<span class="filename">' + file.name + '</span>';
                    template += '<span class="filesize">' + size + ' KB</span>';
                    template += '<a href="javascript:{}" ng-click="unlinkFile($event, ' + id + ')" class="icn-remove-attachment pull-right"></a>';
                    template += '<div class="progress progress-attachment pull-right">';
                    template += '<div id="' + id + '_element" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
                    template += '<span class="sr-only" id="' + id + '_percentage">0% Complete</span>';
                    template += '</div>';
                    template += '</div>';
                    template += '</li>';
                    $(self).next('ul.note-attachments').append(template);
                    FilesService.create(file,
                            function (arg) {
                                var uploadedPercentage = (arg.loaded / arg.total) * 100;
                                $('#' + id + '_element').attr('aria-valuenow', uploadedPercentage);
                                $('#' + id + '_element').attr('style', 'width:' + uploadedPercentage + '%;');
                                $('#' + id + '_percentage').text(parseInt(uploadedPercentage) + ' Complete');
                                //OnProgress
                            }, function (arg) {
                        $('input#' + id + '_val').val(arg.id);
                        //OnFinish
                    }, function (arg) {
                        $('li#' + id + '_li').remove();
                        //OnError
                    }
                    );
                }, false);

            }
        }]);

    app.controller('ProductsController', ['$scope', 'ProductsService',
        function ($scope, ProductsService) {
            $scope.productCategories = [];
            $scope.products = [];
            $scope.getAllCategories = function () {
                $scope.productCategories = ProductsService.getCategories()
            }
            $scope.getAllCategories();
            $scope.getProductByCategories = function (categoryId) {
                ProductsService.getAllByCategory(categoryId, function (products) {
                    $scope.products = products;
                })
            }

            $scope.getProductByCategories('10089607-3561-431a-bdde-0f932297362f');
            $scope.selectProduct = function (event, product) {
                $(event.target).parents('.add-product').find('input[name=product-name]').val(product.name);
                $(event.target).parents('.add-product').find('input[name=product-ids]').val(product.versionedId.id);
                $(event.target).parents('.add-product').find('.dropdown').removeClass('open');
                $(event.target).parents('.add-product').find('input[name=product-amount]').val(product.sale);

            }
            $scope.duplicateProductTemplate = function () {
                var templ = '<div class="add-product clearfix">';
                templ += '<div class="col-1">';
                templ += '<input type="text" name="product-name" class="form-control form-control-dropdown dropdown-toggle" placeholder="Product" value="" data-toggle="dropdown" aria-expanded="true" >';
                templ += '<input type="hidden" name="product-ids" value="" >';
                templ += '<div class="dropdown-menu dropdown-menu-transparent" >';
                templ += '<ul class="dropdown-menu dropdown-menu-categories" >';
                templ += '<li role="presentation" ng-repeat="category in productCategories" >';
                templ += '<a role="menuitem" tabindex="-1" href="javascript:{}" >{{category.name}}';
                templ += '<span class="pull-right total-count" > 46 items < /span>';
                templ += '</a>';
                templ += '</li>';
                templ += '</ul>';
                templ += '<ul class="dropdown-menu dropdown-menu-products" >';
                templ += '<li role="presentation" class="dropdown-header" >';
                templ += '<div class="form-group" >';
                templ += '<input type="text" class="form-control form-control-search form-control-dropdown-input" placeholder="Filter products..." / >';
                templ += '</div>';
                templ += '</li>';
                templ += '<li role="presentation" ng-repeat="product in products" >';
                templ += '<a role="menuitem" tabindex="-1" href="javascript:{}" >{{product.name}}';
                templ += '<span class="pull-right total-count" > #18240 < /span>';
                templ += '</a>';
                templ += '</li>';
                templ += '</ul>';
                templ += '</div>';

                templ += '</div>';
                templ += '<div class="col-2"><input type="text" name="product-desc" class="form-control" placeholder="Description"></div>';
                templ += '<div class="col-3"><input type="text" name="product-qty" class="form-control" placeholder="Qty"></div>';
                templ += '<div class="col-4"><input type="text" name="product-amount" class="form-control" placeholder="Amount" readonly="true"></div>';
                templ += '<div class="col-5 removeProductSection" style="display:none"><a ng-click="removeProductTemplate($event)" href="javascript:{}" class="btn btn-cr btn-gray btn-remove-update pull-left"><span class="icn-remove-update"></span></a></div>';
                templ += '<div class="col-5 addProductSection"><a ng-click="duplicateProductTemplate()" href="javascript:{}" class="btn btn-cr btn-green btn-add-more pull-left"><span class="icn-add"></span></a></div>';
                templ += '</div>'

                $('div.removeProductSection').show();
                $('div.addProductSection').hide();
                $('input#productAttachmentField').before(templ);
            }
            $scope.removeProductTemplate = function (event) {
                $(event.target).parents('div.add-product').remove();
            }
        }]);

    app.controller('ServicesController', ['$scope', 'ServicesService',
        function ($scope, ServicesService) {

            $scope.duplicateServiceTemplate = function () {
                var templ = '<div class="add-service clearfix">';
                templ += '<div class="col-1 dropdown">';
                templ += '<input type="text" class="form-control form-control-dropdown dropdown-toggle" name="ticketUpdateService" placeholder="Service" data-toggle="dropdown" aria-expanded="true">';
                templ += '<ul class="dropdown-menu dropdown-menu-services">';
                templ += '<li role="presentation"><a role="menuitem" tabindex="-1" ng-click="selectService($event, \'Remote_Service\')" href="javascript:{}">Remote Service</a></li>';
                templ += '<li role="presentation"><a role="menuitem" tabindex="-1" ng-click="selectService($event, \'Onsite\')" href="javascript:{}">Onsite</a></li>';
                templ += '</ul>';
                templ += '</div>';
                templ += '<div class="col-2 dropdown">';
                templ += '<input type="text" class="form-control form-control-dropdown dropdown-toggle" name="ticketUpdateTime" data-toggle="dropdown" aria-expanded="true" placeholder="Hr : Min">';
                templ += '<div class="dropdown-menu dropdown-menu-transparent dropdown-time">';
                templ += '<ul class="dropdown-menu dropdown-menu-hour">';
                templ += '<li role="presentation" ng-repeat="hour in getHours()"><a role="menuitem" tabindex="-1" href="javascript:{}" ng-click="selectHour($event, hour)">{{hour}}</a></li>';
                templ += '</ul>';
                templ += '<ul class="dropdown-menu dropdown-menu-minute">';
                templ += '<li ng-repeat="minute in getMinutes()" role="presentation"><a role="menuitem" tabindex="-1" href="javascript:{}" ng-click="selectMinute($event, minute)">{{minute}}</a></li>';
                templ += '</ul>';
                templ += '</div>';
                templ += '</div>';
                templ += '<div class="col-3">';
                templ += '<input type="text" class="form-control" placeholder="Description" name="ticketUpdateDescription">';
                templ += '</div>';
                templ += '<div class="col-4">';
                templ += '<input type="text" class="form-control form-control-dropdown dropdown-toggle datetimepicker" name="ticketUpdateDate" data-toggle="dropdown" aria-expanded="true" placeholder="Date">';
                templ += '</div>';
                templ += '<div class="col-5">';
                templ += '<a style="display:none" ng-click="removeServiceTemplate($event)" href="javascript:{}" class="removeProductSection btn btn-cr btn-gray btn-remove-update pull-left"><span class="icn-remove-update"></span></a>';
                templ += '<a href="javascript:{}" ng-click="duplicateServiceTemplate()" class="btn btn-cr btn-green btn-add-more pull-left"><span class="icn-add"></span></a>';
                templ += '</div>';
                templ += '</div>';

                $('.removeServiceSection').show();
                $('.addServiceSection').hide();
                $('input#serviceAttachmentField').before($.parseHTML(templ));
                $('.datetimepicker').datetimepicker({
                    format: 'MM/DD/YYYY'
                });
                $('.datetimepicker').click(function () {

                });
            }
            $scope.removeServiceTemplate = function (event) {
                $(event.target).parents('div.add-service').remove();
            }
        }
    ]);
})(window, jQuery);