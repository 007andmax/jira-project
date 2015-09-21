'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketUploader',
    ['$modal', 'FilesService', '$rootScope', 'TicketsService', '$stateParams', '$timeout', 'quicktech.common.services.UserNotificationService',
      function ($modal, FilesService, $rootScope, TicketsService, $stateParams, $timeout, UserNotificationService) {

        return {
          restrict: 'A',
          link: function (scope, element) {

            var $document = $(document);
              //loader = $('#loading');

            scope.tickets = TicketsService.getList(scope, {filter: $stateParams.listType.toUpperCase()}, function(){

              scope.onTicketRendering = function(last) {

                if (last) {

                  var ticketConteiner = element.find('[tu-tickets-container]');

                  $timeout(function(){

                    if(ticketConteiner.height() < $(window).height()){

                      //UserNotificationService.show('Loading ...');
                      //loader.show();

                      TicketsService.loadMore(scope, function(moreTicket){

                        //UserNotificationService.hide();
                        //loader.hide();

                        if (moreTicket.length === 0){
                          $document.off('scroll');
                        }
                      })
                    }
                  }, 0);

                }
              };



              $document.on('scroll', function () {

                if($document.scrollTop() > ($document.height() - 750)){

                  //UserNotificationService.show('Loading ...');
                  //loader.show();

                  TicketsService.loadMore(scope, function(moreTicket){

                    //UserNotificationService.hide();
                    //loader.hide();

                    if (moreTicket.length === 0){
                      $document.off('scroll');
                    }
                  })
                }
              });

              scope.$on('$destroy', function(){
                $document.off('scroll');
              });

            });
          }
        };
      }]);

})();
