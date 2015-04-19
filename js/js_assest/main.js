var TICKETID;
function prepareTicketsModule() {
    //debugger;
    $('.scroll-pane').jScrollPane({
        autoReinitialise: true
    });
    $('[data-toggle="tooltip"]').tooltip();
    $('.tokenfield').tokenfield();
    $('.selectpicker').selectpicker({
        style: 'btn-input-dropdown',
        size: 4
    });

    var content = ['<div class="user-email"> <span class="icon icn-at-the-rate pull-left"></span> laurie.harding@sierradentalcare.com </div>',
        '<div class="user-no"> <span class="icon icn-iphone pull-left"></span> 1 406 555 1212 </div>', ].join('');
    $('[data-toggle="popover"]').popover({
        trigger: 'hover',
        content: content,
        template: '<div class="popover popover-userinfo" role="tooltip">\
								<a href="#" class="pull-right icn-email"></a>\
								<div class="pull-left avatar-120 avatar m-r"></div>\
							 	<h3 class="popover-title"></h3>\
							 	<span class="label label-white label-ticket-number">CO-FOUNDER</span>\
							 	<div class="popover-content">asd</div>\
							 </div>',
        html: true
    });
    $('aside.left li a').bind('click', function (e) {
        $('aside.left li').removeClass('active');
        $(e.target).parent('li').addClass('active');
        $('body').removeClass('opened-ticket');
        $('input.ticketBulkSelection[type=checkbox]').removeAttr('checked');
        $('div#ticketBulkActionCtrl').hide();
        e.stopPropagation();
        return;
    });
//    $('.ticket-sidebar .ticket').click(function ()
//    {
//        $('body').addClass('opened-ticket');
//
//    });

    $('.btn-collapse').click(function () {
        $('body').removeClass('opened-ticket');
    });

    $('.toggle-menu').click(function () {
        $('body').toggleClass('opened-sidebar');
    });
    
    $('body').click(function(){
        $('.addUsersDropdown').removeClass('open');
    })

//    var $input = $('#typeahead');
    //$input.typeahead({source: [{id: "someId1", name: "Display name 1"}, {id: "someId2", name: "Display name 2"}], autoSelect: true});
//    $input.change(function () {
//        var current = $input.typeahead("getActive");
//    });

    $('#myTabs').on('click', '.nav a', function () {
        $(this).closest('.dropdown').addClass('dontClose');
    })

    $('#addUsersDropdown').on('hide.bs.dropdown', function (e) {
        if ($(this).hasClass('dontClose')) {
            e.preventDefault();
        }
        $(this).removeClass('dontClose');
    });

    $('#datetimepicker1').datetimepicker({
        keepOpen: true
    });
    $(".slidpo").bind("click", function (e) {
        var left = 0;
        $(this).parents('div.dropdown-filter').find('div.slidpo').removeClass('active');
        var val = $(this).attr('data-value');
        if (val === 'low' || val === 'on_hold') {
            left = 9;
            $().addClass('active');
        } else if (val === 'medium' || val === 'in_progress') {
            left = 113;
        } else if (val === 'high' || val === 'completed') {
            left = 216;
        }
        if (left > 0) {
            $(this).parents('.filter-slider-wrapper').find('.icn-slider-handle').css('left', left + "px");
            $(this).addClass('active');
        }
        e.preventDefault();
        e.stopPropagation();
        return;
    });
    $(".dropdown-menu").bind("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        return;
    });
    $(".icn-checkbox").bind("click", function (e) {
        if ($(this).is('checked')) {
            $(this).parents('label.checkbox').find('input[type=checkbox]').prop('checked', false);
        } else {
            $(this).parents('label.checkbox').find('input[type=checkbox]').prop('checked', true);
        }
        //e.preventDefault();
        e.stopPropagation();
        return;
    });

    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > $('.ticket-list').context.body.clientHeight - 40) {
            $('a#loadMore').trigger('click');
        } else {
            return;
        }
    });
//    $('div.lastItem').scroll(function () {
//        debugger;
//        
//    })


}

function createAble(event) {

    if (!$('input#createTicketSubject').val()) {
        $('#createTicketBtn').attr('disabled', 'disabled');
        return;
    }
    if (!$('#createTicketNote').val()) {
        $('#createTicketBtn').attr('disabled', 'disabled');
        return;
    }
    if (!$('input#ticketCompanyId').val()) {
        $('#createTicketBtn').attr('disabled', 'disabled');
        return;
    }
    if (!$('input#ticketCreatedById').val()) {
        $('#createTicketBtn').attr('disabled', 'disabled');
        return;
    }
    if (!$('input#createTicketPriority').val()) {
        $('#createTicketBtn').attr('disabled', 'disabled');
        return;
    }
    $('#createTicketBtn').removeAttr('disabled');
}