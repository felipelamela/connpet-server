import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { ErrorResponse } from 'src/commom/response/errorResponse';
import { ErrorEnum } from 'src/commom/enum/error.enum';
import { AuthUserPresenter } from './auth-user.presenter';
import { Public } from '../commom/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      const login = await this.authService.login(loginAuthDto);
      return new AuthUserPresenter(login)
    } catch (error) {
      return new ErrorResponse(error)
    }

  }
}
