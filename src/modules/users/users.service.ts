import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { AlreadyExistsException, ForbiddenException, NotFoundException } from '../../shared/exceptions/rest.exception';
import { VPagination } from '../../shared/validators/pagination.validation';
import FileModel from '../common/files/file.entity';
import { FilesService } from '../common/files/files.service';
import UserModel, { IUser } from './entities/user.entity';
import { USER_ROLE } from './users.enum';
import { VUpdateUser, VRegisterUser } from './users.validation';
import { ImageService } from '../common/image/image.service';
import { AUTH_TYPE } from '../auth/auth.interfaces';
import { CryptUtil } from '../../shared/utils/crypt.util';

@Injectable()
export class UsersService {

    constructor(
        private imageService: ImageService,
    ){
    }

    public async register(registerUser: VRegisterUser) {
        const user = new UserModel(registerUser);
        const password = await CryptUtil.generatehash(registerUser.password);
        user.auth = { type: AUTH_TYPE.LOCAL, email: registerUser.email, password };
        user.contactEmail = registerUser.email;

        await user.save();

        if (registerUser.profileImage) {
            await this.imageService.setImageAssigned(user.profileImage);
            this.uploadImage(user);
        }

        return user;
    }

    public async get(id: mongoose.Types.ObjectId) {
        return await UserModel.findById(id).populate('bookmarks.bookmark');
    }

    public async update(id: mongoose.Types.ObjectId, user: IUser, updateUser: VUpdateUser) {
        // The current user has to be admin to change the role of users
        if (updateUser.role && user.role != USER_ROLE.ADMIN) {
            throw new ForbiddenException("Only ADMIN can assign roles!");
        }

        const newUser =  await UserModel.findByIdAndUpdate(id, updateUser, { new: true });

        if (updateUser.profileImage) {
            await this.imageService.setImageAssigned(user.profileImage);
            this.uploadImage(user);
        }

        return newUser;
    }

    private async uploadImage(user: IUser) {
        user.profileImage = await this.imageService.uploadImage(user.profileImage);
        await user.save();
    }

    public async delete(user: IUser) {
        if (user.profileImage) this.imageService.deleteImage(user.profileImage);

        return await UserModel.findByIdAndDelete(user._id);
    }

    public async addBookmark(user: IUser, id: mongoose.Types.ObjectId) {
        const foundIndex = user.bookmarks.indexOf(id);
        if (foundIndex >= 0) {
            throw new AlreadyExistsException('bookmark');
        }

        user.bookmarks.push(id);

        return await UserModel.findByIdAndUpdate(user._id, user, { new: true });
    }

    public async deleteBookmark(user: IUser, id: mongoose.Types.ObjectId) {
        const foundIndex = user.bookmarks.indexOf(id);
        if (foundIndex < 0) {
            throw new NotFoundException('bookmark');
        }

        user.bookmarks.splice(foundIndex, 1);

        return await UserModel.findByIdAndUpdate(user._id, user, { new: true });
    }

    public async getRecentUsers(pagination: VPagination) {
        const query = UserModel.find().sort({ createDate: -1});
        pagination.applyTo(query);

        return await query.exec();
    }
}
