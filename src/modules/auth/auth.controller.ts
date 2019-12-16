import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { DAuthenticatedUser } from '../users/dtos/users.dto';
import { IUser } from '../users/entities/user.entity';
import { AuthUser } from '../users/guards/user-auth.guard';
import { VRegisterUser } from '../users/users.validation';
import { AuthService } from './auth.service';
import { ResolveImage } from '../common/image/image.guard';

@Controller('v1/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) {}

    @UseGuards(AuthGuard([ 'local', 'facebook' ]))
    @Post('login')
    async loginLocal(@AuthUser() user: IUser) {
        return this.authService.login(user);
    }

    @ResolveImage('body', 'profileImage')
    @Post('register')
    async register(@Body(ValidatorPipe) registerUser: VRegisterUser) : Promise<DAuthenticatedUser> {
        return new DAuthenticatedUser(await this.authService.register(registerUser));
    }
}