import * as mongoose from 'mongoose';

import { DAuth } from '../../auth/auth.dto';
import { IAuth } from '../../auth/auth.interfaces';
import { IUser } from '../entities/user.entity';
import { USER_ROLE } from '../users.enum';
import { IImage } from '../../common/image/image.entity';

/*
    Used to redact password from the user object
*/
export class DAuthenticatedUser {
    _id: mongoose.Types.ObjectId;
    auth: IAuth;
    name: string;
    contactEmail: string;
    phone?: string;
    role: USER_ROLE;
    profileImage: IImage;
    bookmarks: mongoose.Types.ObjectId[];
    createDate: Date;

    constructor(user: IUser) {
        this._id = user._id;
        this.auth = new DAuth(user.auth);
        this.name = user.name;
        this.contactEmail = user.contactEmail;
        this.phone = user.phone;
        this.role = user.role;
        this.profileImage = user.profileImage;
        this.bookmarks = user.bookmarks;
        this.createDate = user.createDate;
    }
}

export class DAuthenticatedUserWithToken {
    token: string;
    user: DAuthenticatedUser;

    constructor(token: string, user: IUser) {
        this.token = token;
        this.user = new DAuthenticatedUser(user);
    }
}

export class DUserTiny {
    _id: mongoose.Types.ObjectId;
    contactEmail: string;
    profileImage: IImage;
    createDate: Date;

    constructor(user: IUser) {
        this._id = user._id;
        this.contactEmail = user.contactEmail;
        this.profileImage = user.profileImage;
        this.createDate = user.createDate;
    }
}