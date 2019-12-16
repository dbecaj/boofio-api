import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { DAuthenticatedUser } from 'src/modules/users/dtos/users.dto';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      // Rename default function signature (username, password)
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<DAuthenticatedUser> {
    // Check if the user with the passed credentials match the one we have in our db
    const authUser = await this.authService.validateLocal(email, password);
    if (!authUser) {
      throw new UnauthorizedException();
    }
    return authUser;
  }
}