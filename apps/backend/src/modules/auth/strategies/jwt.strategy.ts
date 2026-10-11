import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../users/users.repository';
import type { RequestUser } from '../../../common/types/request-user.type';

type JwtPayload = {
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwtSecret') || 'insecure-development-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.usersRepository.findByIdWithRole(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid session');
    }

    return {
      id: user.id,
      username: user.username,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: user.role.permissions.map((rolePermission) => rolePermission.permission.key),
    };
  }
}
