import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { authenticate } from 'passport';

import { FileModule } from '../common/files/files.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.stratagy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    // Set up JWT auth with secret from .env
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
  ],
  controllers: [ AuthController ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
  ],
  exports: [
    AuthService,
  ]
})
export class AuthModule implements NestModule {

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authenticate('facebook', { session: false }))
      .forRoutes('v1/auth/login/facebook');
  }
}
