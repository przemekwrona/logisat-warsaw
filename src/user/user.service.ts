import { Injectable } from '@nestjs/common';
import { Users, UsersResponse } from '../generated/logisat-api';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppUserEntity } from '../entities/user.entity';
import moment from 'moment/moment';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AppUserEntity) private usersRepository: Repository<AppUserEntity>,
  ) {}

  async getUsers(page: number = 1, size: number = 20): Promise<UsersResponse> {
    const appUserEntities: AppUserEntity[] = await this.usersRepository.find({
      skip: (page - 1) * size,
      take: size,
      order: { username: 'DESC' }
    });

    const items: Users[] = appUserEntities.map((appUser: AppUserEntity) => {
      const user: Users = {} as Users;
      user.username = appUser.username;
      user.email = appUser.email;
      user.created_at = moment(appUser.created_at).format('yyyy-MM-DDTHH:mm:SS')
      user.enabled = appUser.enabled;

      return user;
    });

    const response: UsersResponse = {} as UsersResponse;
    response.items = items;

    return Promise.resolve(response);
  }
}
