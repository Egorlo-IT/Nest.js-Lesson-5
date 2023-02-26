import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UserCreateDto } from './dto/user-create.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('create')
  async create(@Body() user: UserCreateDto): Promise<UsersEntity> {
    return this.usersService.create(user);
  }
}
