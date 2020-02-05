import { UserAvatarCropped } from './user-avatar-cropped';
import { UserAvatarOrigin } from './user-avatar-origin';

export class UserAvatar {
    base64: string;
    cropped: UserAvatarCropped = new UserAvatarCropped();
    h: number;
    id: string;
    origin: UserAvatarOrigin = new UserAvatarOrigin();
    updatedAt: number;
    w: number;
    x: number;
    y: number;
    constructor() { 
     
    }
}