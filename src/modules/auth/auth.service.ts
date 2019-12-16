import { JwtService } from '@nestjs/jwt';

import { EmailExistsException, NotFoundException, InternalServerException, DataIntegrityException } from '../../shared/exceptions/rest.exception';
import { CryptUtil } from '../../shared/utils/crypt.util';
import FileModel from '../common/files/file.entity';
import { FilesService } from '../common/files/files.service';
import { DAuthenticatedUser, DAuthenticatedUserWithToken } from '../users/dtos/users.dto';
import UserModel, { IUser } from '../users/entities/user.entity';
import { VRegisterUser } from '../users/users.validation';
import { AUTH_TYPE } from './auth.interfaces';
import { ImageService } from '../common/image/image.service';
import { Logger } from '../../shared/logger';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private userService: UsersService,
    ){}

    /**
     * Match email and password to the user in the db and return a user if success
     * @param email Email to validate
     * @param password Password string to compare with the hash in the db
     */
    async validateLocal(email: string, password: string): Promise<DAuthenticatedUser> {
        const user = await UserModel.findOne({ "auth.email": email });
        if (!user) {
            throw new NotFoundException(`User with email ${email}`);
        }
        if (!user.auth || !user.auth.password) {
            throw new DataIntegrityException(`Registered user ${email} does not have valid auth data!`)
        }

        // Check if the password matches our hash stored in the db
        const match = await CryptUtil.compare(password, user.auth.password);
        return match ? user : null;
    }

    async validateFacebook(profile): Promise<DAuthenticatedUser> {
        const facebookId = profile.id;
        let user = await UserModel.findOne({ "auth.facebookId": facebookId});
        if (user) {
            return user;
        }

        // If the user doesn't exist create him
        return this.registerFacebook(profile);
    }

    /**
     * Add new user to the db if specified email is not already in db
     * @param registerUser User object with email and password
     */
    async register(registerUser: VRegisterUser) {
        const email = registerUser.email.toLowerCase();

        // Check if user with this email already exists
        let checkUser = await UserModel.findOne({ "auth.email": email });
        if (checkUser) {
            throw new EmailExistsException(email);
        }

        return this.userService.register(registerUser);
    }

    async registerFacebook(profile): Promise<IUser> {
        const facebookId = profile.id;
        const email = profile.emails.shift().value;
        const name = profile.displayName || undefined;

        const user = new UserModel();
        user.auth = { type: AUTH_TYPE.FACEBOOK, facebookId, email };
        user.contactEmail = email;
        user.name = name;

        return user.save();
    }

    /**
     * Signs in with user email and _id and return user info and jwt token
     * @param user User info to sign jwt service with
     */
    async login(user: IUser) {
        // Create a new access token with the users mongodb ObjectId and his email
        const payload = { username: user.auth.email, sub: user._id };
        const bearer = this.jwtService.sign(payload);
        return new DAuthenticatedUserWithToken(bearer, user);
    }
}
