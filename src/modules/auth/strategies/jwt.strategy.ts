import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { NotFoundException } from '../../../shared/exceptions/rest.exception';
import { castToObjectId } from '../../../shared/pipes/object-id.pipe';
import { DAuthenticatedUser } from '../../users/dtos/users.dto';
import UserModel from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) : Promise<DAuthenticatedUser> {
        // Extract our mongodb ObjectId and email from the payload
        let { sub: userId,  username: email } = payload;
        // Check if the user exists just in case
        userId = castToObjectId(userId, 'userId');
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new NotFoundException(`Validation token not found for ${email}`);
        }

        return new DAuthenticatedUser(user);
    }
}