String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function prepareTicketsModule() {
  var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;

  $(function () {


    // Assign User
    $('#bulkAssignUserDropDown').on({
      "show.bs.dropdown": function () {
        setTimeout(function () {
          $('#bulkAssignedTo').focus();
        }, 10);
      }
    });

    /*$('#assignUserDropDown').on({"show.bs.dropdown": function () {
     setTimeout(function(){
     $('#assignedTo').focus();
     }, 10);
     }});*/


    /*$('#tab-add-product-title').on('click', function(){
     alert('clicked');
     });*/


    //$('.ticket-content').css('height', $('body').innerHeight() - 90);

    $('body').tooltip({selector: '[data-toggle=tooltip]'});

    $('.tokenfield').tokenfield();
    $('.tooltip-dp').tooltip({html: true,});
    $('.tooltip-email').tooltip({
      html: true,
      template: '<div class="tooltip error email-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'

    });
    $('body').popover({
      selector: '[data-popover]',
      trigger: 'click hover',
      placement: 'auto',
      delay: {show: 0, hide: 0}
    });

    $('.selectpicker').selectpicker({
      style: 'btn-input-dropdown',
      size: 4
    });

    if (pixelRatio > 1) {
      var avatar = '<img src="images/avatars/avatar-xlarge@2x.png" alt="..." class="img-circle no-avatar">';
    } else {
      var avatar = '<img src="images/avatars/avatar-xlarge.png" alt="..." class="img-circle no-avatar">';
    }
    var template = '<div class="popover popover-userinfo" role="tooltip">\
        <a href="#" class="pull-right icn-email tp-hide" data-toggle="tooltip" data-original-title="send email" data-placement="top"></a>\
        <div class="pull-left avatar-120 avatar m-r">' + avatar + '</div>\
        <h3 class="popover-title"></h3>\
        <div class="label label-white label-ticket-number">CO-FOUNDER</div>\
        <div class="popover-content">asd</div>\
        </div>';

    var content = ['<div class="user-email"> <span class="icon icn-at-the-rate pull-left"></span> ryan.burns@sierradentalcare.com </div>',
      '<div class="user-no"> <span class="icon icn-iphone pull-left"></span>406 563 6486</div>',].join('');
    $('[data-toggle="popover"]').popover({
      trigger: 'hover',
      content: content,
      template: template,
      html: true, delay: {show: 0, hide: 0}
    });

    var content = ["<iframe src='https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2965.0824050173574!2d-93.63905729999999!3d41.998507000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sWebFilings%2C+University+Boulevard%2C+Ames%2C+IA!5e0!3m2!1sen!2sus!4v1390839289319' width=100%' height='240' frameborder='0' style='border:0'></iframe>",].join('');
    $('[data-toggle="popover-location"]').popover({
      trigger: 'hover',
      content: content,
      template: '<div class="popover popover-location">\
            <div class="popover-content">asdf</div>\
            </div>',
      html: true, delay: {show: 0, hide: 0}
    });

    var content = ['<h3 class="popover-title pull-left">Skynet.2013</h3><div class="popover-content pull-right"><a href="javascript:void(0)" class="icon icn-share-screen tp-hide" data-toggle="tooltip" data-placement="top" title="Share screen"></a><a href="javascript:void(0)" class="icon icn-instant-message  tp-hide" data-toggle="tooltip" data-placement="top" title="Send Alert"></a><a href="javascript:void(0)" class="icon icn-add-directory tp-hide" data-toggle="tooltip" data-placement="top" title="Shared directory"></a><a href="javascript:void(0)" class="icon icn-restart tp-hide" data-toggle="tooltip" data-placement="top" title="Reboot"></a></div>',].join('');
    $('[data-toggle="popover-devices"]').popover({
      trigger: 'click',
      content: content,
      template: '<div class="popover popover-deviceinfo">\
            <div class="popover-content">asdf</div>\
            </div>',
      html: true, delay: {show: 0, hide: 0}
    });

    $('aside.right').on('scroll', function () {
      var height = $('aside.right .jspPane').css("top");

      if (height === "0px") {

        $("aside.right").find(".nav-sb-tabs").css('box-shadow', 'none');
      } else {
        $("aside.right").find(".nav-sb-tabs").css('box-shadow', '0px 1px 0px 0px rgba(14, 22, 30, 0.05)');

      }

    });

    /*$('.ticket-sidebar').click(function(){
     $('body').addClass('opened-ticket');
     });

     $('.btn-collapse').click(function () {
     $('body').removeClass('opened-ticket');
     $('.ticket-sidebar').find('.ticket').removeClass('active');
     $(".ticket-sidebar .active").show();

     });*/

    $('.btn-update').click(function () {
      $(this).tooltip('hide');

      $(this).addClass("closed");
      $(this).attr("data-original-title", "");

    });
    $('.btn , .ticket-action > li > a , .tp-hide').click(function () {
      $(this).tooltip('hide');
    });
    $('.load-update').click(function () {
      if ($(this).hasClass("loading")) {

      } else {
        $(this).attr("data-original-title", "");
        $(this).addClass("loading");
        $(this).append("Loading...");
      }
    });

    $('.btn-remote-access').click(function () {
      $(this).addClass("connected");
      $(this).html('<img src="images/spacer.gif" class="icn-remote-access"> Connected');

    });

    /*$('.back-btn').click(function () {
     $('#bulk-actions').hide();
     $('.ticket-nav').removeClass("bulk-actions");
     $('#search-and-filter').show();
     });*/


    $('.ticket input').click(function () {
      $('.ticket-nav').addClass("bulk-actions");
      $('#bulk-actions').show();
      $('#search-and-filter').hide();
    });

    $('.toggle-menu').click(function () {
      $('body').toggleClass('opened-sidebar');
    });

    /*var $input = $('#typeahead, #typeaheadNewMessage');
     //$input.typeahead({source: [{id: "someId1", name: "Display name 1"}, {id: "someId2", name: "Display name 2"}], autoSelect: true});
     $input.change(function () {
     var current = $input.typeahead("getActive");
     });*/

    $('#myTabs').on('click', '.nav a', function () {
      $(this).closest('.dropdown').addClass('dontClose');
    })

    $('#addUsersDropdown').on('hide.bs.dropdown', function (e) {
      if ($(this).hasClass('dontClose')) {
        e.preventDefault();
      }
      $(this).removeClass('dontClose');
    });

    /*$('#datetimepicker1').datetimepicker({
     keepOpen: true,
     format: 'DD MMM YYYY'

     });
     $('#datetimepicker2').datetimepicker({
     keepOpen: true,
     format: 'DD MMM YYYY'

     });*/

    $('.editable-container').on('keyup', 'textarea', function (e) {
      $(this).css('height', 'auto');
      $(this).height(this.scrollHeight - 17);
    });

    $('.editable-container').find('textarea').keyup();

// $(window).scroll(function() {
//     var height = $('body').scrollTop();
//     var width=$(window).width();
//     var ticketListWidth =$(".tickets-list").width()+1;
//     var ticketHeaderW=$(".ticket-content .ticket-header > div").width();

//     if(height == "0") {
//         $(".ticket-content .ticket-header > div").removeClass('ticket-fixed-header');
//         $(".ticket-content .ticket-header > h3").css("margin-Top","10px");
//         $(".ticket-content .ticket-header > div").css("width","");
//     } else
//     if (height > "180") {
//                 /*if(width > "1880") {
//                     $(".ticket-content .ticket-header > div").css("width","calc( 100% - 401px - "+ticketListWidth+"px )");
//                 }*/
//                 $(".ticket-content .ticket-header > div").addClass('ticket-fixed-header');
//                 $(".ticket-content .ticket-header > h3").css("margin-Top","49px");
//             }

//         });
  });

// Set pixelRatio to 1 if the browser doesn't offer it up.

// Rather than waiting for document ready, where the images
// have already loaded, we'll jump in as soon as possible.
}
