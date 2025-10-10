import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { CreateNewUserDTO } from './dto/create-new-user.dto';
import { SuccessResponse } from 'src/response/successResponse';
import { ErrorResponse } from 'src/response/errorResponse';
import type { FastifyReply } from 'fastify';
import { ErrorEnum } from 'src/enum/error.enum';
import { CreateNewTutorDTO } from './dto/create-new-tutor.dto';
import { AuthUserPresenter } from './auth-user.presenter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      const login = await this.authService.login(loginAuthDto);
      return new AuthUserPresenter(login)
    } catch (error) {
      return new ErrorResponse(error.message, 404, ErrorEnum.USER_CREATE_ERROR)
    }

  }

  @Post('new-user')
  async createNewUser(@Body() createNewUser: CreateNewUserDTO) {
    try {
      const newUser = await this.authService.create(createNewUser);
      return new SuccessResponse('Usuário criado com sucesso', newUser);
    } catch (error) {
      return new ErrorResponse(error.message, 404, ErrorEnum.USER_CREATE_ERROR)
    }
  }

  @Post('new-tutor')
  async createNewTutor(@Body() createNewTutor: CreateNewTutorDTO) {
    try {
      const newUser = await this.authService.createTutor(createNewTutor);
      return new SuccessResponse('Usuário criado com sucesso', newUser);
    } catch (error) {
      return new ErrorResponse(error.message, 404, ErrorEnum.USER_CREATE_ERROR)
    }
  }
}
