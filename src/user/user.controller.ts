import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersResponse } from '../generated/logisat-api';

@Controller('/api/v1/users')
export class UserController {

  constructor(private userService: UserService) {
  }

  @Get()
  async getUsers(): Promise<UsersResponse> {
    return this.userService.getUsers();
  }

}
