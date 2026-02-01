import { SearchUsersResult } from "../repositories/userRepository.js";

export enum UI_RELATIONSHIP_STATUS {
  NONE = 'NONE',
  FRIENDS = 'FRIENDS',
  REQUEST_SENT = 'REQUEST_SENT',
  REQUEST_RECEIVED = 'REQUEST_RECEIVED',
  YOU_BLOCKED = 'YOU_BLOCKED',
  THEY_BLOCKED = 'THEY_BLOCKED',
}

export function generateFriendshipStatusForUI(searchedUser: SearchUsersResult, currentUserId: number): UI_RELATIONSHIP_STATUS {
    const { friendship_status, requester_id, blocked_by } = searchedUser;

    if (!friendship_status) return UI_RELATIONSHIP_STATUS.NONE;

    switch (friendship_status) {
      case 'friends':
        return UI_RELATIONSHIP_STATUS.FRIENDS;

      case 'pending':
        return requester_id === currentUserId 
          ? UI_RELATIONSHIP_STATUS.REQUEST_SENT 
          : UI_RELATIONSHIP_STATUS.REQUEST_RECEIVED;

      case 'blocked':
        return blocked_by === currentUserId 
          ? UI_RELATIONSHIP_STATUS.YOU_BLOCKED 
          : UI_RELATIONSHIP_STATUS.THEY_BLOCKED;

      default:
        return UI_RELATIONSHIP_STATUS.NONE;
    }
}