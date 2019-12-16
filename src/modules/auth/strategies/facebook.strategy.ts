import { Injectable } from '@nestjs/common';
import { use } from 'passport';

import { AuthService } from '../auth.service';

const FacebookTokenStrategy = require('passport-facebook-token');

@Injectable()
export class FacebookStrategy {
    constructor(
        private authService: AuthService,
    ) {
        this.init();
    }

    init() {
        use('facebook', new FacebookTokenStrategy({
            clientID: process.env.FB_APP_ID,
            clientSecret: process.env.FB_APP_SECRET,
        }, (accessToken: string, refreshToken: string, profile: any, done: Function) => {
            this.validate(accessToken, refreshToken, profile, done);
        }))
    }

    async validate (accessToken: string, refreshToken: string, profile: any, done: Function) {
        const user = await this.authService.validateFacebook(profile);
        if (!user) {
            done("Failed to accuire user", null);
        }

        done(null, user);
    }
}