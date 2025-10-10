import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { CreateNewUserDTO } from './dto/create-new-user.dto';
import { SuccessResponse } from 'src/response/successResponse';
import { ErrorResponse } from 'src/response/errorResponse';
import  type { FastifyReply } from 'fastify';
import { ErrorEnum } from 'src/emum/error.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('new-user')
  async createNewUser(@Body() createNewUser: CreateNewUserDTO) {
    try {
      const newUser = await this.authService.create(createNewUser);
      return new SuccessResponse('Usuário criado com sucesso', newUser);
    } catch (error) {
      return new ErrorResponse(error.message, 404,  ErrorEnum.USER_CREATE_ERROR)}
  }
}
