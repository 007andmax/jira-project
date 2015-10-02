'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.PermissionsService',
    [function () {

      var USER_ROLES = {
        USER: 'USER',
        ADMIN: 'ADMIN',
        SUPER_ADMIN: 'SUPER_TECH_ADMIN'
      };

      var LIST_TYPES = {
        UNASSIGNED: 'unassigned',
        USER: 'user',
        SHARED: 'shared',
        OPEN: 'open',
        CLOSE: 'closed',
        TRASH: 'trash',
        SPAM: 'spam'
      };

      function isMoreActionsMenuVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForShared;
      }

      function isMoveIntoSpamVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && userRole === USER_ROLES.USER;

        return isTrueForUnassigned;
      }

      function isAssignTicketToVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForShared;
      }

      function isLabelAsVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);


        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForClose || isTrueForShared;
      }

      function isMoveToTrashVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForClose || isTrueForShared;
      }

      function isChangePriorityToVisible(listType, userRole, option) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) && !option;
        var isTrueForUser = listType === LIST_TYPES.USER && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) && option;
        var isTrueForOpen = listType === LIST_TYPES.OPEN && option;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) && option;

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForShared;
      }

      function isTagsVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);


        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForClose || isTrueForShared;
      }

      function isChangeStatusToVisible(listType, userRole) {

        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        return isTrueForUser || isTrueForOpen || isTrueForShared;
      }

      function isClaimTicketVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED;

        return isTrueForUnassigned;
      }

      function isStatusVisible(listType, userRole) {

        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;
        var isTrueForTrash = listType === LIST_TYPES.TRASH;
        var isTrueForShared = listType === LIST_TYPES.SHARED;

        return isTrueForUser || isTrueForOpen || isTrueForClose || isTrueForTrash || isTrueForShared;
      }

      function isUpdateAndCloseVisible(listType, userRole, ticketStatus) {

        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole !== USER_ROLES.USER || ticketStatus !== 'COMPLETED');

        return isTrueForUser || isTrueForOpen || isTrueForClose || isTrueForShared;
      }

      function isInitialsVisible(listType, userRole) {

        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;
        var isTrueForTrash = listType === LIST_TYPES.TRASH;
        var isTrueForShared = listType === LIST_TYPES.SHARED;

        return isTrueForOpen || isTrueForClose || isTrueForTrash || isTrueForShared;
      }

      function isSendToSpamVisible(listType, userRole) {

        var isFalse = listType !== LIST_TYPES.CLOSE;

        return isFalse;
      }

      function isSettingVisible(listType, userRole) {

        var isFalseForTrash = listType === LIST_TYPES.TRASH;
        var isFalseForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.USER);

        return !(isFalseForTrash || isFalseForShared);
      }

      function isCreateTicketUpdateVisible(listType, ticketStatus) {

        if (ticketStatus === 'COMPLETED') {
          return false;
        }

        var isTrue = listType === LIST_TYPES.USER || listType === LIST_TYPES.SHARED || listType === LIST_TYPES.OPEN;

        return isTrue;
      }

      function isEditUpdateDisabled(listType) {

        var isTrue = listType === LIST_TYPES.CLOSE || listType === LIST_TYPES.TRASH || listType === LIST_TYPES.SPAM;

        return isTrue;
      }

      function isAditionalActionAccessForUser(ticket, user) {

        if (ticket && ticket.createdUser && ticket.createdUser.id) {
          return user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN || ticket.createdUser.id === user.id;
        }
      }

      function isTipVisibleOnClosedPage(listType, ticket, option) {

        if(listType !== LIST_TYPES.CLOSE){
          return false;
        }

        if (option === 'BILLED') {
          return ticket.hasInvoice;

        } else if (option === 'OLD') {
          return !ticket.hasInvoice && !isCanBeReOpened();

        } else if(option === 'OPEN'){
          return !ticket.hasInvoice && isCanBeReOpened();
        }

        function isCanBeReOpened() {

          var thirtyDaysInMs = 2592000000,
            now = new Date(),
            isWithinThirtyDays;

          isWithinThirtyDays = ticket.closedAt >= (now - thirtyDaysInMs);

          return isWithinThirtyDays;
        }
      }

      function isTipVisibleOnSharedPage(listType, ticket, userRole, option) {

        if(listType !== LIST_TYPES.SHARED){
          return false;
        }

        if(option === 'ADMIN'){
          return ticket.status === 'COMPLETED' && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        } else if (option === 'USER'){
          return ticket.status === 'COMPLETED' && userRole === USER_ROLES.USER;
        }
      }

      return {
        isMoreActionsMenuVisible: isMoreActionsMenuVisible,
        isMoveIntoSpamVisible: isMoveIntoSpamVisible,
        isAssignTicketToVisible: isAssignTicketToVisible,
        isLabelAsVisible: isLabelAsVisible,
        isChangePriorityToVisible: isChangePriorityToVisible,
        isMoveToTrashVisible: isMoveToTrashVisible,
        isTagsVisible: isTagsVisible,
        isChangeStatusToVisible: isChangeStatusToVisible,
        isClaimTicketVisible: isClaimTicketVisible,
        isStatusVisible: isStatusVisible,
        isUpdateAndCloseVisible: isUpdateAndCloseVisible,
        isInitialsVisible: isInitialsVisible,
        isSendToSpamVisible: isSendToSpamVisible,
        isCreateTicketUpdateVisible: isCreateTicketUpdateVisible,
        isSettingVisible: isSettingVisible,
        isEditUpdateDisabled: isEditUpdateDisabled,
        isAditionalActionAccessForUser: isAditionalActionAccessForUser,
        isTipVisibleOnClosedPage: isTipVisibleOnClosedPage,
        isTipVisibleOnSharedPage: isTipVisibleOnSharedPage
      }

    }]);

})(window, jQuery);


