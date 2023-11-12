import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './schema/dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('UnAuth')
  @Post('sign_in')
  async signin(@Body() params: SignInDto): Promise<any> {
    console.info(params);
    return await this.usersService.validateUser(params);
  }

  @ApiTags('Auth')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
}
