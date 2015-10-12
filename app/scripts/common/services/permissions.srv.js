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

      function isMoveIntoSpamVisible(listType, userRole, isReport, isMark) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && userRole === USER_ROLES.USER;
        var isTrueForSpam = listType === LIST_TYPES.SPAM && userRole !== USER_ROLES.USER && isReport && !isMark;

        return isTrueForUnassigned || isTrueForSpam;
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
        var isFalseForSpam = listType === LIST_TYPES.SPAM;

        return !(isFalseForTrash || isFalseForShared || isFalseForSpam);
      }

      function isCreateTicketUpdateVisible(listType, ticketStatus) {

        if (ticketStatus === 'COMPLETED') {
          return false;
        }

        var isTrue = listType === LIST_TYPES.USER || listType === LIST_TYPES.SHARED || listType === LIST_TYPES.OPEN;

        return isTrue;
      }

      function isEditUpdateDisabled(ticketStatus, listType, userRole) {

        var isDisabledForUser = userRole === USER_ROLES.USER;
        var statusClosed = ticketStatus === 'COMPLETED';
        var isTrue = listType === LIST_TYPES.CLOSE || listType === LIST_TYPES.TRASH || listType === LIST_TYPES.SPAM;

        return statusClosed || isTrue || isDisabledForUser;
      }

      function isAditionalActionAccessForUser(ticket, user) {

        if (ticket && ticket.createdUser && ticket.createdUser.id) {
          return user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN || ticket.assignedUser.id === user.id;
        }
      }

      function isTipVisibleOnClosedPage(listType, ticket, option) {

        if (listType !== LIST_TYPES.CLOSE) {
          return false;
        }

        if (option === 'BILLED') {
          return ticket.hasInvoice;

        } else if (option === 'OLD') {
          return !ticket.isBillable && !isCanBeReOpened();

        } else if (option === 'OPEN') {
          return !ticket.isBillable && isCanBeReOpened();

        } else if (option === 'BILLABLE') {
          return !ticket.hasInvoice
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

        if (listType !== LIST_TYPES.SHARED) {
          return false;
        }

        if (option === 'ADMIN') {
          return ticket.status === 'COMPLETED' && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        } else if (option === 'USER') {
          return ticket.status === 'COMPLETED' && userRole === USER_ROLES.USER;
        }
      }

      function isTipVisibleOnSpamPage(listType, ticket, userRole, option) {

        if (listType !== LIST_TYPES.SPAM) {
          return false;
        }

        if (option === 'USER_SPAM') {
          return userRole === USER_ROLES.USER && ticket.reportedAsSpamAt;
        } else if (option === 'ADMIN_DELETE') {
          return (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) && ticket.markedAsSpamAt;
        } else if (option === 'ADMIN_SPAM') {
          return (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) && !ticket.markedAsSpamAt && ticket.reportedAsSpamAt;
        }
      }

      function isUserMsgTipsVisible(listType, ticket, user, option) {

        if (listType === LIST_TYPES.UNASSIGNED) {
          return false
        }

        if (ticket && ticket.assignPerformer && ticket.assignPerformer.id && ticket.assignedUser && ticket.assignedUser.id) {

          var isUserAdminOrSAdmin = user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN,
            otherAPerformerAndAUser = ticket.assignPerformer.id !== ticket.assignedUser.id;

          switch (option) {
            case 'ASSIGNED_TO_ME':
              return (ticket.assignPerformer.id !== user.id) && (ticket.assignedUser.id === user.id) && !ticket.isReassigned;

            case 'RE-ASSIGNED_TO_ME':
              return (ticket.assignPerformer.id !== user.id) && (ticket.assignedUser.id === user.id) && ticket.isReassigned;

            case 'I_ASSIGNED_TO_USER':
              return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser.id !== user.id) && !ticket.isReassigned && isUserAdminOrSAdmin;

            case 'I_RE-ASSIGNED_TO_USER':
              return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser.id !== user.id) && ticket.isReassigned && isUserAdminOrSAdmin;

            case 'USER_CLAIMED':
              return (ticket.assignPerformer.id !== user.id) && (ticket.assignedUser.id === ticket.assignPerformer.id);

            case 'USER_RE-ASSIGNED_USER':
              return ticket.assignPerformer.id !== user.id && ticket.assignedUser.id !== user.id && otherAPerformerAndAUser && ticket.isReassigned && isUserAdminOrSAdmin;

            case 'USER_ASSIGNED_USER':
              return ticket.assignPerformer.id !== user.id && ticket.assignedUser.id !== user.id && otherAPerformerAndAUser && !ticket.isReassigned && isUserAdminOrSAdmin;

            case 'MY_TICKET':
              return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser.id === user.id);
          }
        }
      }

      function isShowLabelsOnLeftPanel(listType) {
        for (var type in LIST_TYPES) {
          if (listType === LIST_TYPES[type]) {
            return true;
          }
        }
      }

      function isDisabledDeleteTicketUpdate(listType, creatorId, userId, userRole) {
        var isDisabledForUser = userRole === USER_ROLES.USER && creatorId !== userId;
        var isDisablenOnPage = listType === LIST_TYPES.CLOSE || listType === LIST_TYPES.TRASH || listType === LIST_TYPES.SPAM;

        return isDisablenOnPage || isDisabledForUser;
      }

      function isRestoreFromSpamVisible(listType) {

        var isTrueForSpamList = listType === LIST_TYPES.SPAM;

        return isTrueForSpamList;
      }

      function isDeleteForeverVisible(listType, userRole, ticket) {

        var isTrueForTrashList = listType === LIST_TYPES.TRASH;
        var isTrueForSpamList = listType === LIST_TYPES.SPAM && userRole !== USER_ROLES.USER && ticket.markedAsSpamAt;

        return isTrueForTrashList || isTrueForSpamList;
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
        isTipVisibleOnSharedPage: isTipVisibleOnSharedPage,
        isUserMsgTipsVisible: isUserMsgTipsVisible,
        isShowLabelsOnLeftPanel: isShowLabelsOnLeftPanel,
        isDisabledDeleteTicketUpdate: isDisabledDeleteTicketUpdate,
        isRestoreFromSpamVisible: isRestoreFromSpamVisible,
        isDeleteForeverVisible: isDeleteForeverVisible,
        isTipVisibleOnSpamPage: isTipVisibleOnSpamPage
      }

    }]);

})(window, jQuery);


