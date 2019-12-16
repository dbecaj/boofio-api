import * as mongoose from 'mongoose';

import { AuthSchema, IAuth } from '../../auth/auth.interfaces';
import { USER_ROLE } from '../users.enum';
import { ImageSchema, IImage } from '../../common/image/image.entity';

export interface IUser extends mongoose.Document {
    contactEmail: string,
    name: string,
    auth: IAuth,
    phone?: string,

    profileImage: IImage,
    role: USER_ROLE,
    bookmarks: mongoose.Types.ObjectId[],
    createDate: Date,
}

const UserSchema = new mongoose.Schema({
    contactEmail: { type: String, required: true },
    name: { type: String },
    auth: { type: AuthSchema, required: true },
    phone: { type: String },

    profileImage: { type: ImageSchema, default: null },
    role: { type: USER_ROLE, required: true, default: USER_ROLE.NORMAL },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    createDate: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;