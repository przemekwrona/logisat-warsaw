import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { AppUserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { first, size } from 'lodash';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<AppUserEntity>;

  const mockUsers: AppUserEntity[] = [
    {
      app_user_id: 1,
      username: 'john',
      email: 'john@example.com',
      password: 'welcome1',
      created_at: new Date('2023-01-01T12:00:00'),
      enabled: true,
    } as AppUserEntity,
    {
      app_user_id: 2,
      username: 'adam',
      email: 'adam@example.com',
      password: 'welcome2',
      created_at: new Date('2023-01-02T13:00:00'),
      enabled: false,
    } as AppUserEntity,
  ];

  const mockRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(AppUserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<AppUserEntity>>(getRepositoryToken(AppUserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated users mapped to UsersResponse format', async () => {
    mockRepository.find.mockResolvedValue(mockUsers);

    const result = await service.getUsers(1, 2);

    expect(repo.find).toHaveBeenCalledWith({
      skip: 0,
      take: 2,
      order: { username: 'DESC' },
    });

    expect(size(result.items)).toBe(2);

    const firstUser = first(result.items) || {};
    expect(firstUser.username).toBe('john');
    expect(firstUser.email).toBe('john@example.com');
    expect(firstUser.enabled).toBe(true);

    // Check formatted date (yyyy-MM-DDTHH:mm:SS)
    expect(firstUser.created_at).toMatch('2023-01-01T12:00:00');
  });
});
