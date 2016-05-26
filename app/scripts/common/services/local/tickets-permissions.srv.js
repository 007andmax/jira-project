'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.TicketsPermissionsService',
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

      function isMoreActionsMenuVisible(ticket, currentUser) {

        var isShowForAdmin = (currentUser.role === USER_ROLES.ADMIN || currentUser.role === USER_ROLES.SUPER_ADMIN);
        var isShowForUser = ticket.assignedUser && (ticket.assignedUser.id === currentUser.id);
        var isShow = ticket.status !== 'COMPLETED' && !ticket.reportedAsSpamAt && !ticket.markedAsSpamAt && !ticket.trash;

        return (isShowForAdmin || isShowForUser) && isShow;
      }

      function isMoveIntoSpamVisible(listType, userRole, isReport, isMark) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && userRole === USER_ROLES.USER;
        var isTrueForSpam = listType === LIST_TYPES.SPAM && userRole !== USER_ROLES.USER && isReport && !isMark;

        return isTrueForUnassigned || isTrueForSpam;
      }

      function isAssignTicketToVisible(listType, userRole, users) {

        if (users.length <= 1) {
          return false;
        }

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForOpen = listType === LIST_TYPES.OPEN && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
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

      function isMoveToTrashVisible(listType, userRole, ticket) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        if (!ticket) {
          return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForClose || isTrueForShared;
        }

        if (!ticket.isBillable || (ticket.isBillable && ticket.hasInvoice)) {
          return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForClose || isTrueForShared
        } else if (ticket.isBillable && !ticket.hasInvoice) {
          return false;
        }

      }

      function isChangePriorityToVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForShared;
      }

      function isChangeStatusToVisible(listType, userRole, isAssigned) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && isAssigned;
        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForShared = listType === LIST_TYPES.SHARED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForShared;
      }

      function isClaimTicketVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED;

        return isTrueForUnassigned;
      }

      function isStatusVisible(ticket, userRole, isTrueForClosed) {

        var isHideWhenClosed = ticket.status === 'COMPLETED' && !isTrueForClosed;
        var isHideWhenTrash = ticket.trash;
        var isHideWhenSpam = ticket.markedAsSpamAt || ticket.reportedAsSpamAt;

        return !(isHideWhenClosed || isHideWhenTrash || isHideWhenSpam);
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
        var isTrueForSpam = listType === LIST_TYPES.SPAM;

        return isTrueForOpen || isTrueForClose || isTrueForTrash || isTrueForShared || isTrueForSpam;
      }

      function isSendToSpamVisible(listType, userRole) {

        var isFalse = listType !== LIST_TYPES.CLOSE;

        return isFalse;
      }

      function isSettingVisible(ticket, userRole) {

        var isHideWhenClosed = ticket.status === 'COMPLETED';
        var isHideWhenTrash = ticket.trash;
        var isHideWhenSpam = ticket.markedAsSpamAt || ticket.reportedAsSpamAt;
        var isHideForShares = ticket.sharedToCurrentUserAt && userRole === USER_ROLES.USER;

        return !(isHideWhenClosed || isHideWhenTrash || isHideWhenSpam || isHideForShares);

      }

      function isCreateTicketUpdateVisible(listType, ticketStatus) {

        if (ticketStatus === 'COMPLETED') {
          return false;
        }

        var isTrue = listType === LIST_TYPES.USER || listType === LIST_TYPES.SHARED || listType === LIST_TYPES.OPEN;

        return isTrue;
      }

      function isEditUpdateDisabled(ticket, userRole) {

        var isDisabledForUser = userRole === USER_ROLES.USER;
        var statusClosed = ticket.status === 'COMPLETED';
        var isTrash = ticket.trash;
        var isSpam = ticket.markedAsSpamAt || ticket.reportedAsSpamAt;
        //var isTrue = listType === LIST_TYPES.CLOSE || listType === LIST_TYPES.TRASH || listType === LIST_TYPES.SPAM;

        return statusClosed || isTrash || isSpam || isDisabledForUser;
      }

      function isAditionalActionAccessForUser(ticket, user) {

        if (ticket && ticket.createdUser && ticket.createdUser.id) {
          var isUserInShares = (user.role === USER_ROLES.USER) && ticket.sharedToCurrentUserAt;
          var isAdmin = user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN;
          var isAssignUser = ticket.assignedUser && (ticket.assignedUser.id === user.id);

          return isAdmin || isAssignUser || isUserInShares;
        }
      }

      function isTipVisibleOnClosedPage(ticket, option) {

        if (ticket.status !== 'COMPLETED') {
          return false;
        }

        if (option === 'BILLED') {
          return ticket.hasInvoice;

        } else if (option === 'OLD') {
          return !ticket.isBillable && !isCanBeReOpened();

        } else if (option === 'OPEN') {
          return !ticket.isBillable && isCanBeReOpened();

        } else if (option === 'BILLABLE') {
          return ticket.isBillable && !ticket.hasInvoice
        }

        function isCanBeReOpened() {

          var thirtyDaysInMs = 2592000000,
            now = new Date(),
            isWithinThirtyDays;

          isWithinThirtyDays = ticket.closedAt >= (now - thirtyDaysInMs);

          return isWithinThirtyDays;
        }
      }

      function isTipVisibleOnSharedPage(ticket, userRole, option) {

        if (!ticket.sharedToCurrentUserAt) {
          return false;
        }

        if (option === 'ADMIN') {
          return ticket.status === 'COMPLETED' && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        } else if (option === 'USER') {
          return ticket.status === 'COMPLETED' && userRole === USER_ROLES.USER;
        }
      }

      function isTipVisibleOnSpamPage(ticket, userRole, option) {

        if (!ticket.reportedAsSpamAt && !ticket.markedAsSpamAt) {
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

        if (!ticket.assignedUser) {
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

      function isClaimTicketTipVisible(ticket) {

        var isShow = !ticket.assignedUser && !ticket.trash && !ticket.reportedAsSpamAt && !ticket.markedAsSpamAt && ticket.status !== "COMPLETED";

        return isShow;
      }

      function isShowLabelsOnLeftPanel(listType) {
        for (var type in LIST_TYPES) {
          if (listType === LIST_TYPES[type]) {
            return true;
          }
        }
      }

      function isDisabledDeleteTicketUpdate(ticket, creatorId, userId, userRole) {
        var isDisabledForUser = userRole === USER_ROLES.USER && creatorId !== userId;
        //var isDisablenOnPage = listType === LIST_TYPES.CLOSE || listType === LIST_TYPES.TRASH || listType === LIST_TYPES.SPAM;
        var statusClosed = ticket.status === 'COMPLETED';
        var isTrash = ticket.trash;
        var isSpam = ticket.markedAsSpamAt || ticket.reportedAsSpamAt;

        return statusClosed || isTrash || isSpam || isDisabledForUser;
      }

      function isRestoreFromSpamVisible(ticket) {

        var isTrueForSpamList = ticket.markedAsSpamAt || ticket.reportedAsSpamAt;

        return isTrueForSpamList;
      }

      function isDeleteForeverVisible(ticket, userRole) {

        var isTrueForTrashList = ticket.trash;
        var isTrueForNotBillable = !ticket.isBillable;
        var isTrueForSpamList = userRole !== USER_ROLES.USER && ticket.markedAsSpamAt;

        return (isTrueForTrashList || isTrueForSpamList) && isTrueForNotBillable;
      }

      return {
        isMoreActionsMenuVisible: isMoreActionsMenuVisible,
        isMoveIntoSpamVisible: isMoveIntoSpamVisible,
        isAssignTicketToVisible: isAssignTicketToVisible,
        isLabelAsVisible: isLabelAsVisible,
        isChangePriorityToVisible: isChangePriorityToVisible,
        isMoveToTrashVisible: isMoveToTrashVisible,
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
        isTipVisibleOnSpamPage: isTipVisibleOnSpamPage,
        isClaimTicketTipVisible: isClaimTicketTipVisible
      }

    }]);

})(window, jQuery);


