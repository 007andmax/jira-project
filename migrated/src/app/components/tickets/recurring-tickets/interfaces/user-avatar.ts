import { Cropped } from './cropped';

export interface UserAvatar {
    base64: string
    cropped: Cropped;
    h: number
    id: string
    updatedAt: number
    w: number
    x: number
    y: number
}