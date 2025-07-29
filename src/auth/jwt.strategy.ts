import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service'; // Assuming UsersService is correctly located

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // As per your previous request, token does not expire
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { sub: string; email: string }): Promise<any> {
    // 'sub' is the user ID from the JWT payload
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found or token invalid.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...result } = user; // Remove password before returning
    return result; // This object will be attached to req.user
  }
}