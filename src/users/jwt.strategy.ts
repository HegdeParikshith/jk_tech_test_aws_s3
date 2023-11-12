import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from './users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test-secret',
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userService.findById(payload.id);
      if (!user) {
        throw new HttpException('invalid token', 404);
      }

      return user;
    } catch (error) {
      console.error(`Admin JwtValidation Error -> ${error}`);
      return false;
    }
  }
}
