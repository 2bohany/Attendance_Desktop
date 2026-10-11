import { Body, Controller, Get, Post } from '@nestjs/common';
import type { AuthUser, LoginResponse, SetupStatusResponse } from '@attendance/shared';
import { CurrentUser, Public } from '../../common/decorators';
import type { RequestUser } from '../../common/types/request-user.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { BootstrapAdminDto } from './dto/bootstrap-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('setup-status')
  getSetupStatus(): Promise<SetupStatusResponse> {
    return this.authService.getSetupStatus();
  }

  @Public()
  @Post('setup')
  bootstrapAdmin(@Body() dto: BootstrapAdminDto): Promise<LoginResponse> {
    return this.authService.bootstrapAdmin(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto.username, dto.password);
  }

  @Get('me')
  me(@CurrentUser() user: RequestUser): Promise<AuthUser> {
    return this.authService.getCurrentUser(user.id);
  }
}
