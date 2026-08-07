import { jest } from '@jest/globals';
import userRepository from '#repositories/user.repository.js';
import User from '#models/user.model.js';

describe('UserRepository Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('findByEmail should find user by email', async () => {
    const spy = jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'test@example.com' });
    const user = await userRepository.findByEmail('test@example.com');
    expect(spy).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(user.email).toBe('test@example.com');
  });

  test('findById should find user by id excluding password', async () => {
    const spy = jest.spyOn(User, 'findById').mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: '123', name: 'John' })
    });
    const user = await userRepository.findById('123');
    expect(spy).toHaveBeenCalledWith('123');
    expect(user.name).toBe('John');
  });

  test('create should create user record', async () => {
    const spy = jest.spyOn(User, 'create').mockResolvedValue({ _id: '123', name: 'John' });
    const user = await userRepository.create({ name: 'John', email: 'john@example.com' });
    expect(spy).toHaveBeenCalled();
    expect(user._id).toBe('123');
  });
});
