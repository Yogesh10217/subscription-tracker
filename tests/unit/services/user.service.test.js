import { jest } from '@jest/globals';
import userService from '#services/user.service.js';
import userRepository from '#repositories/user.repository.js';
import ApiError from '#utils/api-error.js';

describe('UserService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getUsers should return list of users', async () => {
    jest.spyOn(userRepository, 'findAll').mockResolvedValue([{ _id: '1', name: 'John' }]);
    const users = await userService.getUsers();
    expect(users).toHaveLength(1);
  });

  test('getUserById should throw notFound error if user missing', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
    await expect(userService.getUserById('999')).rejects.toThrow(ApiError);
  });
});
