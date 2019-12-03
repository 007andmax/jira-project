import { UserAvatarCropped } from './user-avatar-cropped';
import { UserAvatarOrigin } from './user-avatar-origin';

export class UserAvatar {
    base64: string;
    cropped: UserAvatarCropped;
    h: number;
    id: string;
    origin: UserAvatarOrigin;
    updatedAt: number;
    w: number;
    x: number;
    y: number;
    constructor() { }
}