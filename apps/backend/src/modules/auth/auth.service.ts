import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ADMIN_ROLE_NAME } from '@attendance/config';
import type { AuthUser, LoginResponse, SetupStatusResponse } from '@attendance/shared';
import { UsersRepository, type UserWithRole } from '../users/users.repository';
import { RolesRepository } from '../users/roles.repository';
import { toAuthUser } from '../users/users.mapper';
import type { BootstrapAdminDto } from './dto/bootstrap-admin.dto';

const PASSWORD_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    const user = await this.usersRepository.findByUsernameWithRole(username);

    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    await this.usersRepository.touchLastLogin(user.id);
    return this.buildLoginResponse(user);
  }

  async getSetupStatus(): Promise<SetupStatusResponse> {
    const count = await this.usersRepository.count();
    return { needsSetup: count === 0 };
  }

  async bootstrapAdmin(dto: BootstrapAdminDto): Promise<LoginResponse> {
    const existingUsers = await this.usersRepository.count();
    if (existingUsers > 0) {
      throw new ForbiddenException('Setup has already been completed');
    }

    const adminRole = await this.rolesRepository.findByName(ADMIN_ROLE_NAME);
    if (!adminRole) {
      throw new InternalServerErrorException('Admin role has not been seeded yet');
    }

    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);
    const created = await this.usersRepository.create({
      username: dto.username,
      email: dto.email || null,
      fullName: dto.fullName,
      passwordHash,
      roleId: adminRole.id,
    });

    const withRole = await this.usersRepository.findByIdWithRole(created.id);
    return this.buildLoginResponse(withRole!);
  }

  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await this.usersRepository.findByIdWithRole(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid session');
    }
    return toAuthUser(user);
  }

  private buildLoginResponse(user: UserWithRole): LoginResponse {
    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
      user: toAuthUser(user),
    };
  }
}
