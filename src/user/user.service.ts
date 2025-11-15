import { Injectable } from '@nestjs/common';
import { UsersResponse } from '../generated/logisat-api';

@Injectable()
export class UserService {

  async getUsers(): Promise<UsersResponse> {
    return Promise.resolve({} as UsersResponse);
  }

}
